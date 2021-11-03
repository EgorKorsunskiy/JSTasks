export default class CellsAllocation{
    constructor(corrections, cells, popSize=100){
        if(!corrections || !cells){
            throw new Error("Invalid input data")
        }

        this.corrections = corrections
        this.cells = cells

        this.popSize = popSize
        this.population = []
        this.bestMutation = null
    }

    generateThrusterValues(localCells){
        if(localCells.length === 1){
            return [localCells[0], 0]
        }

        const firstThrusterVal = localCells[Math.round(Math.random() * (localCells.length - 1))]
        let secondThrusterVal = localCells[Math.round(Math.random() * (localCells.length - 1))]

        while(secondThrusterVal === firstThrusterVal){
            secondThrusterVal = localCells[Math.round(Math.random() * (localCells.length - 1))]
        }

        return [firstThrusterVal, secondThrusterVal]
    }

    isGeneValid(firstThrusterVal, secondThrusterVal, index){
        if(firstThrusterVal + secondThrusterVal / 2 > this.corrections[index]) return false

        return true
    }

    calculateFitness(firstThruster, secondThruster){
        let fitness = 0

        for(let i = 0;i<this.corrections.length;i++){
            fitness += firstThruster[i] + secondThruster[i] / 2
        }

        return fitness
    }

    isFirstThrusterMutated(newAgent){
        return newAgent.firstThruster.length > newAgent.secondThruster.length
    }

    initPopulation(){

        for(let i = 0;i<this.popSize;i++){

            const firstThruster = []
            const secondThruster = []
            const localCells = JSON.parse(JSON.stringify(this.cells))

            for(let j = 0;j<this.corrections.length;j++){
                if(!localCells.length){
                    while(j < this.corrections.length){
                        firstThruster.push(0)
                        secondThruster.push(0)
                        j++
                    }

                    break
                }

                let [firstThrusterVal, secondThrusterVal] = this.generateThrusterValues(localCells)

                let counter = 0

                while(!this.isGeneValid(firstThrusterVal, secondThrusterVal, j)){
                    if(counter === 25) firstThrusterVal = 0
                    else if(counter > 25) secondThrusterVal = 0
                    else{
                        [firstThrusterVal, secondThrusterVal] = this.generateThrusterValues(localCells)
                    }

                    counter++
                }

                const firstDelIndex = localCells.indexOf(firstThrusterVal)
    
                if(firstDelIndex !== -1) localCells.splice(firstDelIndex, 1)

                const secondDelIndex = localCells.indexOf(secondThrusterVal)

                if(secondDelIndex !== -1) localCells.splice(secondDelIndex, 1)

                firstThruster.push(firstThrusterVal)
                secondThruster.push(secondThrusterVal)
            }

            this.population.push({
                firstThruster,
                secondThruster,
                additional: localCells,
                fitness: this.calculateFitness(firstThruster, secondThruster)
            })

        }
    }


    isMutationValid(gene, firstIndex, secondIndex){
        if(gene[firstIndex] === gene[secondIndex] || firstIndex === secondIndex) return false
        
        if(firstIndex < this.corrections.length && secondIndex >= this.corrections.length){
            if(secondIndex > 2*this.corrections.length - 1){
                if(this.isGeneValid(gene[secondIndex], gene[firstIndex + this.corrections.length], firstIndex)) return true
                return false
            }
            else{
                if(this.isGeneValid(gene[secondIndex], gene[firstIndex + this.corrections.length], firstIndex)
                    && this.isGeneValid(gene[secondIndex-this.corrections.length], gene[firstIndex], secondIndex-this.corrections.length)) return true
                return false
            }
        }
        else if(firstIndex >= this.corrections.length && secondIndex < this.corrections.length){
            if(this.isGeneValid(gene[secondIndex], gene[firstIndex - this.corrections.length], firstIndex - this.corrections.length)
                && this.isGeneValid(gene[firstIndex], gene[secondIndex + this.corrections.length], secondIndex)) return true
            return false
        }
        else{
            if(firstIndex < this.corrections.length){
                if(this.isGeneValid(gene[secondIndex], gene[firstIndex + this.corrections.length], firstIndex)
                    && this.isGeneValid(gene[firstIndex], gene[secondIndex + this.corrections.length], secondIndex)) return true
                
                return false
            }
            else{
                if(secondIndex > 2*this.corrections.length - 1){
                    if(this.isGeneValid(gene[firstIndex - this.corrections.length], gene[secondIndex], firstIndex - this.corrections.length)) return true
                    
                    return false
                }
                else{
                    if(this.isGeneValid(gene[firstIndex - this.corrections.length], gene[secondIndex], firstIndex - this.corrections.length)
                        && this.isGeneValid(gene[secondIndex - this.corrections.length], gene[firstIndex], secondIndex - this.corrections.length)) return true
                
                    return false
                }
            }
        }
    }

    chooseBestMutation(){
        let bestMutation = {
            fitness: 0
        }

        for(let el of this.population){
            if(el.fitness > bestMutation.fitness) bestMutation = el
        }

        this.bestMutation = bestMutation
    }

    makeSelection(){
        this.chooseBestMutation()
    
        this.population.sort((a,b) => -1)

        this.population = this.population.slice(0, 31)
    }

    mutateGene(gene){

        const newAgent = JSON.parse(JSON.stringify(gene)) 

        const CombinedThrustres = newAgent.firstThruster.concat(newAgent.secondThruster).concat(newAgent.additional)

        let firstMutationIndex = Math.round(Math.random() * (this.corrections.length * 2 - 1))
        let secondMutationIndex = Math.round(Math.random() * (CombinedThrustres.length - 1))

        while(!this.isMutationValid(CombinedThrustres, firstMutationIndex, secondMutationIndex)){
            firstMutationIndex = firstMutationIndex = Math.round(Math.random() * (this.corrections.length * 2 - 1))
            secondMutationIndex = Math.round(Math.random() * (CombinedThrustres.length - 1))
        }

        const temp = CombinedThrustres[firstMutationIndex]

        CombinedThrustres[firstMutationIndex] = CombinedThrustres[secondMutationIndex]
        CombinedThrustres[secondMutationIndex] = temp

        newAgent.firstThruster = CombinedThrustres.splice(0, this.corrections.length)
        newAgent.secondThruster = CombinedThrustres.splice(0, this.corrections.length)
        newAgent.additional = CombinedThrustres
        newAgent.fitness = this.calculateFitness(newAgent.firstThruster, newAgent.secondThruster)
 
        this.population.push(newAgent)
    }

    generateNewPopulation(){
        for(let i = 0;i<this.popSize - this.population.length;i++){
            this.mutateGene(this.population[i % (this.population.length - 1)])
        }
    }
}
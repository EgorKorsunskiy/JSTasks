export default class Converter{

    constructor(convertationRules){
        this.convRules = JSON.parse(convertationRules)

        this.firstUnit = null
        this.secondUnit = null
        this.convertValue = null
    }

    convert(){
        const firstUnitCoef = this.convRules[this.firstUnit]?.toMeterCoef
        const secondUnitCoef = this.convRules[this.secondUnit]?.toMeterCoef

        if(!firstUnitCoef || !secondUnitCoef){
            throw new Error('Wrong json format')
        }

        return (this.convertValue * firstUnitCoef / secondUnitCoef).toFixed(2)
    }

    parse(data){
        const parsedData = JSON.parse(data) 

        this.firstUnit = parsedData.distance.unit
        this.secondUnit = parsedData.convert_to
        this.convertValue = parsedData.distance.value

        if(!this.firstUnit || !this.secondUnit || !this.convertValue){
            throw new Error('Wrong input data fromat')
        }

        return [this.firstUnit, this.secondUnit, this.convertValue]
    }
}
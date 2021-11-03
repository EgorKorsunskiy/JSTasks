import { readFileSync, writeFileSync } from 'fs'
import CellsAllocation from './cellsAllocation.js'

const inputData = JSON.parse(readFileSync('Calculations/input.json', 'utf-8'))
const cellsAllocation = new CellsAllocation(inputData.corrections, inputData.cells)

cellsAllocation.initPopulation()

for(let i = 0;i<50;i++){
    cellsAllocation.makeSelection()
    cellsAllocation.generateNewPopulation()
}

delete cellsAllocation.bestMutation.additional

try{
    writeFileSync('Calculations/output.json', JSON.stringify(cellsAllocation.bestMutation))
}
catch(err){
    console.log(err)
}
 import { readFileSync, writeFileSync } from 'fs'
 import Converter from './converter.js'

let outputData = {}

const convertationRules = readFileSync('convertationRules.json', 'utf-8')
const inputData = readFileSync('Calculations/input.json', 'utf-8')

const converter = new Converter(convertationRules)

const [_, secondUnit] = converter.parse(inputData)
const convertedVal = converter.convert()

outputData.unit = secondUnit
outputData.value = convertedVal

try {
    writeFileSync('Calculations/output.json', JSON.stringify(outputData))
}
catch(err){
    console.log(err)
}

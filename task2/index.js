import { readFileSync, writeFileSync } from 'fs'
import ModificationTools from './modificationTools.js'

const modificationRules = JSON.parse(readFileSync('modificationRules.json', 'utf-8'))
const inputData = JSON.parse(readFileSync('Calculations/input.json', 'utf-8'))

const modificationTools = new ModificationTools(inputData)

modifyObject()

function modifyObject(){
    for(let [key, value] of Object.entries(modificationRules.condition)){
        switch(key){
            case 'include': 
                modificationTools.includeModify(value)
            break
            case 'sort_by':
                modificationTools.sortModify(value)
            break
            case 'exclude':
                modificationTools.excludeModify(value)
        }
    }
    try{
        writeFileSync('Calculations/output.json', JSON.stringify(modificationTools.obj))
    }
    catch(err){
        console.log(err)
    }
}
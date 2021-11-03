import { readFileSync, writeFileSync } from 'fs'

let outputData = {
    list:[]
}

const inputData = JSON.parse(readFileSync('Files/input.json', 'utf-8'))

console.log(inputData)
test()

function test(){
    for(let questionGroup of inputData){
        const mainQuestion = questionGroup[0]

        let branch = []

        const recursion = (question, depth) => {

            for(let answerItem of question.answers){
                if(answerItem.nextQuestion){
                    branch.push({
                        [question.question]: answerItem.answer
                    })

                    recursion(questionGroup[answerItem.nextQuestion - 1], depth + 1)
                }
                else{
                    
                    let allAnswers = ''
                    
                    question.answers.forEach(el => {
                        if(!el.nextQuestion){
                            allAnswers += '/' + el.answer
                        }
                    });

                    branch.push({
                        [question.question]: allAnswers.slice(1)
                    })

                    outputData.list.push(branch)
                    branch = branch.slice(0, depth === 0?depth:depth - 1)

                    return
                }
            }
            branch = []
        }

        recursion(mainQuestion, 0)
    }
    try{
        writeFileSync('Files/output.json', JSON.stringify(outputData))
    }
    catch(err){
        console.log(err)
    }
}
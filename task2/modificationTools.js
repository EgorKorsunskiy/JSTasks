export default class ModificationTools {

    constructor(obj){
        this.obj = obj
    }

    includeModify(params){
        let newObj = {
            data: []
        }

        this.obj.data.forEach(el => {
            let is_match = true

            for(let param of params){

                let key = Object.keys(param)[0]
                let value = param[key]

                if(!el[key]){
                    is_match = false
                    break
                }
                else if(el[key] !== value){
                    is_match = false
                    break
                }
            }
            if(is_match) newObj.data.push(el)

        })

        this.obj = newObj
    }

    sortModify(params){
        this.obj.data.sort((a, b) => {

            for(let param of params){

                if(!a[param]){
                    return 1
                }

                if(a[param] > b[param]) return 1

                return -1

            }
        })
    }

    excludeModify(params){
        let newObj = {
            data: []
        }

        this.obj.data.forEach(el => {
            let is_match = true

            for(let param of params){

                let key = Object.keys(param)[0]
                let value = param[key]

                if(el[key] === value){
                    is_match = false
                    break
                }
            }
            if(is_match) newObj.data.push(el)

        })

        this.obj = newObj
    }
}
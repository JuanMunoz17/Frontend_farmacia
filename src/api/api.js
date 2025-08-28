import axios from 'axios'

export const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api'
})

async function getActas(){
    
    // const respuesta = API.get('actas').then((response) => {
    //     return response.data
    // }).catch((error) => {
    //     console.log('hubo un error', error)
    // })

    try{
        const actas = (await API.get('actas')).data
        console.log(actas)
    } catch(e) {
        console.log('error', error)
    }
}

getActas()
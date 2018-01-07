import axios from 'axios';
import config from '../config';
import { getItemDatosSesion } from '../funciones_globales/manejosesion';

const token = getItemDatosSesion('token');

var global_axios = axios.create({
    baseURL: config.api,
    timeout: config.request_timeout_api,
    responseType: 'json'
});

if (token){
    //console.log("token extraido: ",token )
    global_axios.defaults.headers.common['x-access-token'] = token;    
    
    //console.log("cabeceras seteadas: ",global_axios.defaults.headers )
}

export default global_axios;
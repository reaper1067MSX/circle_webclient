export const borrarDatosSesion = () => {
    sessionStorage.clear();    
}

export const getItemDatosSesion = (item) => {
    let data = sessionStorage.getItem(item);    
    if (data){
        return data;
    }else{
        return undefined;
    }
    
}

export const setDatosSesion = (item, sesion_data) => {
    sessionStorage.setItem(item, sesion_data);        
}

export const delDatosSesion = (item) => {
    sessionStorage.removeItem(item)
}

export const getItemParametros = (arr_parametros, key_item) => {
    let valor_item;
    console.log(arr_parametros[0].parametro)
    for(let i=0; i<arr_parametros.length; i++){        
        if (arr_parametros[i].parametro.toString().toUpperCase() === key_item.toString().toUpperCase()){
            valor_item = arr_parametros[i].valor;
            break;
        }
    }
    return valor_item;
}




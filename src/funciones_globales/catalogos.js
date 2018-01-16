import global_axios from './interaccion_api';

//OK
export function cargarCatalogos(tipo) {
    return new Promise((resolve, reject) => {
        global_axios.get('/catalogos?tabla='+tipo+'&estado=A')
	    .then((response)=>{
            resolve(response.data.map(item => ({value: item.Codigo.toString().toUpperCase(), label: `${item.Descripcion.toString().toUpperCase()} (${item.Codigo.toString().toUpperCase()})` })));
        })
        .catch((err)=>{
            reject('Error al cargar datos de catálogos desde API: ' + err);
        });
    });
}

//OK
export function cargarCatalogosGenerico(ruta) {
    return new Promise((resolve, reject) => {
        global_axios.get(ruta)
	    .then((response)=>{
            resolve(response.data.map(item => ({value: item.Codigo.toString().toUpperCase(), label: `${item.Descripcion.toString().toUpperCase()} (${item.Codigo.toString().toUpperCase()})` })));
        })
        .catch((err)=>{
            reject('Error al cargar datos de catálogos desde API: ' + err);
        });
    });
}

//OK
export function cargarCatalogosAsync(tipo, parametro_busqueda, callback){
    return global_axios.get('/catalogos?tabla='+tipo+'&estado=A&cadena_busq='+parametro_busqueda)
    .then(response => response.data)
    .then(data => callback(null, {
        options: data.map(item => ({value: item.Codigo.toString().toUpperCase(), label: `${item.Descripcion.toString().toUpperCase()} (${item.Codigo.toString().toUpperCase()})` })),
        complete: true
    }))
    .catch((err)=>{
        console.log('Error al cargar datos de catálogos desde API: ' + err);
    });
}

//OK
export function cargarCatalogosGenericoAsync(ruta, query, callback){
    return global_axios.get(ruta + query)
    .then(response => response.data)
    .then(data => callback(null, {
        options: data.map(item => ({value: item.Codigo.toString().toUpperCase(), label: `${item.Descripcion.toString().toUpperCase()} (${item.Codigo.toString().toUpperCase()})` })),
        complete: true        
    }))
    .catch((err)=>{
        console.log('Error al cargar datos de catálogos desde API: ' + err);
    });
}


export function cargarCatalogos_Otros(tipo) {
    return new Promise((resolve, reject) => {
        global_axios.get('/catalogos?tipo=otros&opcion=' + tipo)
	    .then((response)=>{
            console.log("Oficiales: ",response.data)
            resolve(response.data.map(item => ({value: item.Codigo.toString().toUpperCase(), label: `${item.Descripcion.toString().toUpperCase()} (${item.Codigo.toString().toUpperCase()})` })));
        })
        .catch((err)=>{
            reject('Error al cargar datos de catálogos desde API: ' + err);
        });
    });
}
 

export function cargarCatalogosGenericoAsyncInvertido(ruta, query, callback){
    return global_axios.get(ruta + query)
    .then(response => response.data)
    .then(data => callback(null, {
        options: data.map(item => ({value: item.Codigo.toString().toUpperCase(), label: `${item.Codigo.toString().toUpperCase()} (${item.Descripcion.toString().toUpperCase()})` })),
        complete: true        
    }))
    .catch((err)=>{
        console.log('Error al cargar datos de catálogos desde API: ' + err);
    });
} 



export function generarItemCatalogoSeleccionado(value, label){
    return { label: label.toString().trim() + ' (' + value.toString().trim() + ')',
             value: value.toString().trim()
    };
}

export function cargarCatalogoEstados(tipo) {
    return new Promise((resolve, reject) => {
        global_axios.get('/estados?tipo=' + tipo)
	    .then((response)=>{            
            resolve(response.data.map(item => ({value: item.Codigo.toString().toUpperCase(), label: `${item.Descripcion.toString().toUpperCase()} (${item.Codigo.toString().toUpperCase()})` })));
        })
        .catch((err)=>{
            reject('Error al cargar datos de catálogos de estados desde API: ' + err);
        });
    });
}

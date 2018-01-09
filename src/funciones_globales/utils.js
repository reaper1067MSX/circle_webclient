import { completar_String } from './format';
import { getItemDatosSesion } from '../funciones_globales/manejosesion';

export const get_FechaLocalActual = () => {
    let fecha = new Date();
    return completar_String(fecha.getDate().toString(), '0', 2) + '/' + completar_String((fecha.getMonth()+1).toString(), '0', 2) + '/' + fecha.getFullYear();
}

export const get_FechaSistema_FormatoDate = () =>  {    
    let fecha = getItemDatosSesion('fechasistema').toString().split("/");
    return new Date(fecha[2], fecha[1], fecha[0]);
}

export const get_FechaSistema_FormatoString = () =>  {
    return getItemDatosSesion('fechasistema').toString();
}

export const get_MesActual = () =>  {
    return getItemDatosSesion('fechasistema').toString().substring(3,5);
}

export const convertirFechaStringtoDate = (par_st_fecha) => {
    let st_fecha = par_st_fecha.toString().split("/");
    return new Date(st_fecha[2], st_fecha[1], st_fecha[0]);
}
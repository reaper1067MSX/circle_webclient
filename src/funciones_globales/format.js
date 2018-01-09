import moment from 'moment';
import 'moment/locale/es';

export const completar_String = (cadena, char_relleno, tam_final) => {
    let tam_actual = cadena.toString().length;    
    let veces_repetir = tam_final - tam_actual;
    return char_relleno.repeat(veces_repetir).concat(cadena);
}

export const formatearFecha = (fecha) => {
    var partes_fecha = '';
    var temp = '';
    partes_fecha = fecha.split("-");
    temp = partes_fecha[2];
    partes_fecha[2] = temp.substring(0, 2);

    fecha = partes_fecha[2] + '/' + partes_fecha[1] + '/' + partes_fecha[0];
    return fecha;
}

export const formatearNumeroComaDecimal = (numero) =>{
    return numero.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

//Permite limpiar el resultado del control SelectgetAsync
export const formatearLabel = (label) => {
    var temp;
    temp = label.split("(");

    return temp[0];
}

export const formatearNumeroEntero = (valor) => {
    valor = parseInt(valor, 10);        
    return valor;
}

export const fomatearFechaMoment_a_String = (fechaMoment) => {
    moment.locale('es');
    return moment(fechaMoment).format('L');
}

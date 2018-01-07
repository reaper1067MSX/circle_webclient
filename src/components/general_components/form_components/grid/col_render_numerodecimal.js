import React, {Component} from "react";

import styled from 'styled-components';

const ContenedorDatos = styled.span`
    float: right;
`;

export default class DecimalRenderer extends Component {
 
    formatearNumero(valor, decimals) {
        valor = parseFloat(valor);
        decimals = decimals || 0;
        if (isNaN(valor) || valor === 0) 
            return parseFloat(0).toFixed(decimals);
    
        valor = valor.toFixed(decimals);
    
        var partes_valor = valor.split('.'),
            regexp = /(\d+)(\d{3})/;
    
        while (regexp.test(partes_valor[0])){
            partes_valor[0] = partes_valor[0].replace(regexp, '$1,$2');
        }
    
        return partes_valor.join('.');
    }

    render() {
        return (
            <ContenedorDatos>{this.formatearNumero(this.props.value, 2)}</ContenedorDatos>
        );
    }
};
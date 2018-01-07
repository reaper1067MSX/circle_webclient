import React, {Component} from "react";

import styled from 'styled-components';

const ContenedorDatos = styled.span`
    float: right;
`;

export default class EnteroRenderer extends Component {
 
    formatearNumero(valor) {
        valor = parseInt(valor, 10);        
        if (isNaN(valor) || valor === 0) 
            return 0;
        
        return valor;
    }

    render() {
        return (
            <ContenedorDatos>{this.formatearNumero(this.props.value)}</ContenedorDatos>
        );
    }
};
import React, {Component} from "react";

import styled from 'styled-components';

const ContenedorDatos = styled.span`
    float: right;
`;

export default class CalculatorDecimalRenderer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.invokeParentMethod()
        };
        this.invokeParentMethod = this.invokeParentMethod.bind(this);
    }
 
    formatearNumero(valor, decimals) {
        valor = parseFloat(valor);
        decimals = decimals || 0;
        if (isNaN(valor) || valor === 0) 
            return parseFloat(0).toFixed(decimals);
    
        valor = valor.toFixed(decimals);
    
        var partes_valor = valor.split('.'),
            regexp = /(\d+)(\d{3})/;
    
        while (regexp.test(partes_valor[0]))
            // eslint-disable-next-line
            partes_valor[0] = partes_valor[0].replace(regexp, '$1' + ',' + '$2');
    
        return partes_valor.join('.');
    }

    invokeParentMethod() {
        return this.props.context.componentParent.calcular_colFromParent(this.props.node.id,this.props.node.data)
    }

    render() {
        return (
            <ContenedorDatos>{this.formatearNumero(this.state.value, 2)}</ContenedorDatos>
        );
    }
};
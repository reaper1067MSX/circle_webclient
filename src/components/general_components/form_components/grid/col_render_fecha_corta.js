import React, {Component} from "react";

import styled from 'styled-components';
import { formatearFecha } from '../../../../funciones_globales/format';

const ContenedorDatos = styled.span`
    float: right;
`;

export default class FechaRender extends Component {
    
    render() {
        return (
            <ContenedorDatos>{formatearFecha(this.props.value)}</ContenedorDatos>
        );
    }
};
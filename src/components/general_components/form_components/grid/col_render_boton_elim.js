import React, {Component} from "react";
import styled from 'styled-components';

const Boton = styled.button`
    color: white;

    border-color: transparent;
    border-radius: 40;
    font-weight: normal;
    padding: 0px;
    width: 100%;
    height: 20px;
    &:hover {
        border-color: transparent;        
    };
    &:focus {
        border-color: transparent;        
    };
    &:active {
        border-color: transparent;        
    };
`;


export default class BotonEliminarRenderer extends Component {
    constructor(props) {
        super(props);
        this.invokeParentMethod = this.invokeParentMethod.bind(this);
    }

    invokeParentMethod() {
        this.props.context.componentParent.methodFromParent(this.props.node.id, this.props.node.data)
    }

    

    render() {
        return (
            <span><Boton type="button" className="btn btn-danger" onClick={this.invokeParentMethod}><i className="fa fa-trash-o"></i></Boton></span>
        );
    }


};
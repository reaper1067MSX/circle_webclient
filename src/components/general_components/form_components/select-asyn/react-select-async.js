import React from 'react';
import Select from 'react-select';
import '../selects/react-select.css';

export default class ReactSelectAsync extends React.Component{    
    
    render(){
        return(
            < Select.Async value={this.props.value} placeholder='Seleccione...' noResultsText='No existen resultados' searchPromptText='Escriba para buscar' loadingPlaceholder='Buscar...'
            onChange={this.props.func_onChange} onBlur={this.props.func_onBlur} loadOptions={this.props.func_loadOptions} cache={false}/>
        )
    }
}    
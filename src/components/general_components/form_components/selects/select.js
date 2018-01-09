
import React from 'react';
import Select from 'react-select';
import './react-select.css';

export default class Selects extends React.Component{

    render() {
        return (
            <Select name={this.props.name} value={this.props.value} disabled={this.props.disabled} onChange={this.props.onChange} options={this.props.options}
            />
        )
    }

}





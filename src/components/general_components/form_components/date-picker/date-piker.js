
import React from 'react';
import DatePicker from 'react-datepicker';

import './react-datepicker.css';


export default class DayPicker extends React.Component{

    render() {
        return (
            <DatePicker id={this.props.id} selected={this.props.selected} onChange={this.props.onChange} dateFormat="DD/MM/YYYY"/>
        )
    }
} 




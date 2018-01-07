
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker.css';


export default class DayPicker extends React.Component{

    render() {
        return (
            <DatePicker className='control' dateFormat='DD/MM/YYYY' selected={this.props.fechaSeleccionada} onChange={this.props.func_onChange} 
            todayButton={'Hoy'} placeholderText='dd/mm/aaaa' showWeekNumbers
            showYearDropdown            
            scrollableYearDropdown
            yearDropdownItemNumber={50}/>
         )
    }
} 




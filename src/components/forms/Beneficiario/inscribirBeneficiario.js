import React from 'react';
//import styled from 'styled-components'; //STYLES
import ReactSelectAsync from '../../general_components/form_components/select-asyn/react-select-async';
import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, /*ContainerEdit,*/ Row, HeaderForm, Container, TituloForm, /*Topbar*/ } from '../../general_components/form_components/container';
import { Label, InputText, Fieldset, Legend, TextArea, Fieldset1, Legend1 } from '../../general_components/form_components/controles';

import DayPicker from '../../general_components/form_components/date-picker/date-piker';
import moment from 'moment';

//GRID
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';



export default class inscribirBeneficiario extends React.Component{
    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            estado: "",
            //SELECTS
            options_estado: [],
            options_estado_sel: '',


            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

            //Grid
            grid_Club: [],
            colDefs_Club: [{
                header: "Club",
                field: "DescripcionPago",
                width: 150,
                type: "string"
            },
            {
                header: "Punto Satelite",
                field: "Cuenta",
                width: 150,
                type: "string",
            },
            {
                header: "Día",
                field: "Dia",
                width: 80,
                type: "string",
            },
            {
                header: "Desde",
                field: "Banco",
                width: 150,
                type: "string"
            },
            {
                header: "Hasta",
                field: "Cuenta",
                width: 150,
                type: "string",
            },
            
            ],
        };

        //GRID
        this.gridOptions = {
            context: {
                componentParent: this
            },      
            enableColResize: true,
            enableCellChangeFlash: true,
            onCellValueChanged: (event)=>{  }
                                            
        };

        //Funciones binds
        this.changeValues = this.changeValues.bind(this);

        //GRID
        this.onGridReady = this.onGridReady.bind(this);
    }

    getOptionsBeneficiario(input, callback){
        if(input.toString().length >= 3){
            let cadena_busq = '?cadena_busq='+input;
            
        }

    }

    render() {

        return <div className="container">
            <HeaderForm>
                <TituloForm>Inscripción Beneficiario</TituloForm>
            </HeaderForm>
            <CuerpoForm>
                <Row>

                            <Row>
                            <Container className='col-md-4' >
                                    <Label>Beneficiario:</Label>
                                    <ReactSelectAsync name="options_programa_sel" value={this.state.options_programa_sel} onChange={(value) => { this.setState({ options_programa_sel: value }) }} func_loadOptions={this.getOptionsBeneficiario.bind(this)} />
                                </Container>
                                <Container className='col-md-4' >
                                    <Label>Programa:</Label>
                                    <Selects name="options_programa_sel" value={this.state.options_programa_sel} onChange={(value) => { this.setState({ options_programa_sel: value }) }} options={this.state.options_programa} />
                                </Container>
                                <Container className='col-md-4' >
                                    <Label>Estado:</Label>
                                    <Selects name="options_estado_sel" value={this.state.options_estado_sel}  onChange={(value) => { this.setState({ progoptions_estado_selrama: value }) }} options={this.state.options_estado} />
                                </Container>
                            </Row>
                            <Row>
                                <Container className='col-md-12'>
                                    <AgGridRender altura='250px' data={this.state.grid_Club} columnas={this.state.colDefs_Club} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                                </Container> 
                            </Row>
                            <Row>
                                <Container className='col-md-12'>
                                    <div className="btn-group pull-right">
                                        <button type="submit" className='btn btn-secondary btn-sm'>
                                            <i className="fa fa-trash-o fa-lg"></i> Limpiar
                                        </button>
                                    </div>
                                    <div className="btn-group pull-right">
                                        <button type="submit" className='btn btn-primary btn-sm'>
                                            <i className="fa fa-floppy-o fa-lg"></i> Guardar
                                        </button>
                                    </div>
                                </Container>
                            </Row>
            </Row>
            </CuerpoForm>

        </div>;
    }


    //--------------------------------------------------Funciones-------------------------------------------------------------

    //Funciones Grid
    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
    }

    //Valores aplicados

    ChangeDateNacimiento(day) {
        //SAVE
        this.setState({ fecha_nacimiento: day });

        //LEERLO
        //moment.locale('es');
        //alert(moment(this.state.fecha_creacion).format('L'));
    }

    

    //Functions


    changeValues(event) {

        console.log("evento: ", event)
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    //Realiza todas estas operaciones al renderizar el form
    componentDidMount() {
     
    }

    

}//End
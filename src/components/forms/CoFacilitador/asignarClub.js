import React from 'react';
//import styled from 'styled-components'; //STYLES

import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, /*ContainerEdit,*/ Row, HeaderForm, Container, TituloForm, /*Topbar*/ } from '../../general_components/form_components/container';
import { Label, InputText, /*Fieldset, Legend, TextArea,*/ Fieldset1, Legend1 } from '../../general_components/form_components/controles';

//import DayPicker from '../../general_components/form_components/date-picker/date-piker';
//import moment from 'moment';

//GRID
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';



export default class asignarClub extends React.Component{
    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            buscar: "",
            codigo:"",
            nombres: "",
            apellidos: "",
            punto_satelite: "",
            programa: "",
            estado: "",
            options_users: [],


            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

            //Grid
            data: [],
            columnDefs: [{
                header: "Club",
                field: "DescripcionPago",
                width: 150,
                type: "string"
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
            {
                header: "Punto Satelite",
                field: "Cuenta",
                width: 150,
                type: "string",
            }
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

    render() {

        return <div className="container">
            <HeaderForm>
                <TituloForm>Asignar Club a Co-Facilitador</TituloForm>
            </HeaderForm>
            <CuerpoForm>
                <Row>
                    <Container className='col-md-4' >
                        <Label>Co-Facilitador:</Label>
                        <Selects name="programa" value={this.state.programa} onChange={(value) => { this.setState({ programa: value }) }} options={this.state.options_users} />
                    </Container>
                        <Container className='col-md-4' >
                            <Label>Nombres:</Label>
                            <InputText name='nombres' value={this.state.nombres} type="string" className='form-control input-sm' placeholder='Nombres' onChange={this.changeValues} />
                        </Container>
                            <Container className='col-md-4' pull-left >                           
                                <Label>Apellidos:</Label>
                                <InputText name='apellidos' value={this.state.apellidos} type="string" className='form-control input-sm' placeholder='Apellidos' onChange={this.changeValues} />
                            </Container>
                </Row>
                <Row>
                    <Container className='col-md-12'>
                        <AgGridRender altura='250px' data={this.state.data} columnas={this.state.columnDefs} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                    </Container>
                </Row>
                <Row>
                    <Fieldset1 className='col-md-12'>
                        <Legend1>Asigancion</Legend1>
                            <Container className='col-md-12'>
                                <AgGridRender altura='250px' data={this.state.data} columnas={this.state.columnDefs} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                            </Container>
                            <Container className='col-md-12'>
                                <div className="btn-group pull-right">
                                    <Label></Label>
                                    <button type="submit" className='btn btn-primary btn-sm' onClick={this.showModal}>
                                    <i className="fa fa-check-circle fa-lg"></i> Asignar
                                    </button>
                                </div>
                            </Container>
              
                    </Fieldset1>
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
        var options = [{ value: 0, label: 'YORK' },
        { value: 1, label: 'Amadeus' },
        { value: 2, label: 'Landa' },
        { value: 3, label: 'FORK' }]

        this.setState({ options_users: options })
    }

    

}//End
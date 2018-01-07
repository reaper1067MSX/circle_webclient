import React from 'react';
//import styled from 'styled-components'; //STYLES


import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, /*ContainerEdit,*/ Row, HeaderForm, Container, TituloForm, /*Topbar,*/ HeaderModal, /*CuerpoModal*/ } from '../../general_components/form_components/container';
import { Label, InputText,Fieldset,Legend ,TextArea } from '../../general_components/form_components/controles'; 

//GRID
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';
/* import { ColumnApi, GridApi } from "ag-grid";
import { GridOptions } from "ag-grid"; */

import { Link } from 'react-router-dom';

class visualizarClub extends React.Component{

    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            buscar: "",
            codigo: "",
            nombre: "",
            punto_satelite: "",
            programa: "",
            estado: "",
            options_users: [],

            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

            //Grid
            data: [],
            columnDefs: [{
                            header: "Codigo",
                            field: "DescripcionPago",
                            width: 150,
                            type: "string"
                        },
                        {
                            header: "Programa",
                            field: "Banco",
                            width: 150,
                            type: "string"
                        },
                        {
                            header: "Punto Satelite",
                            field: "Cuenta",
                            width: 150,
                            type: "string"
                        },
                        {
                            header: "Horario.",
                            field: "Cheque",
                            width: 150,
                            type: "num_entero"
                        }]
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

        //Modals
        this.showModal = this.showModal.bind(this); //SWITCH OPEN/CLOSE
        this.onClose = this.onClose.bind(this);     //CLOSE

        //GRID
        this.onGridReady = this.onGridReady.bind(this);

    }

    render() {

        return <div className="container">
            <HeaderForm>
                <TituloForm>Visualizar Clubs</TituloForm>
            </HeaderForm>
            <CuerpoForm>
                <Row>
                    <Container className='col-md-12'>
                        <AgGridRender altura='250px' data={this.state.data} columnas={this.state.columnDefs} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                    </Container>
                </Row>
                <Row>
                    <Container className='col-md-12'>
                        <div className="btn-group pull-right">
                            <Link to={'/registroClub'}>
                                <button type="submit" className='btn btn-primary btn-sm'>
                                    <i className="fa fa-plus-circle fa-lg"></i> Nuevo
                                </button>
                            </Link>
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


    //Functions modal
    //Abrir/cerrar
    showModal(event) {
        this.setState({ isShowingModal: !this.state.isShowingModal })
    }

    onClose(event) {
        this.setState({ isShowingModal: false });
    }


    //Functions

    ChangeDateCreacion(day) {
        //SAVE
        this.setState({ fecha_creacion: day });

        //LEERLO
        //moment.locale('es');
        //alert(moment(this.state.fecha_creacion).format('L'));
    }

    ChangeDateVigencia(event) {
        console.log(event);
        this.setState({ fecha_vigencia: event });
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

export default visualizarClub;

    

    
import React from 'react';
//import styled from 'styled-components'; //STYLES

//import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, Row, HeaderForm, Container, TituloForm } from '../../general_components/form_components/container';
//import { Label, InputText, Fieldset, Legend, TextArea } from '../../general_components/form_components/controles';
import { Link } from 'react-router-dom';
//import DayPicker from '../../general_components/form_components/date-picker/date-piker';
//import moment from 'moment';

//Axios
import  global_axios  from '../../../funciones_globales/interaccion_api';

//GRID
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';


export default class visualizarBeneficiario extends React.Component{
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
            columnDefs: [{      header: "Codigo",
                                field: "Codigo",
                                width: 100,
                                type: "string"
                            },
                            {
                                header: "Nombre",
                                field: "Nombre",
                                width: 90,
                                type: "string"
                            },
                            {
                                header: "Apellido",
                                field: "Apellido",
                                width: 90,
                                type: "string"
                            },
                            {
                                header: "Edad",
                                field: "Edad",
                                width: 80,
                                type: "string"
                            },
                            {
                                header: "Estado",
                                field: "Estado",
                                width: 60,
                                type: "string"
                            },
                            {
                                header: "",
                                field: "modificar",
                                width: 40,
                                type: "boton_modi"
                            },
                            {
                                header: "",
                                field: "eliminar",
                                width: 40,
                                type: "boton_elim"
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
                <TituloForm>Visualizar Beneficiarios</TituloForm>
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
                        <Link to={'/registroBeneficiario'}>
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

        //Proceso Adquirir clave
        let config_request = {
            method: 'GET',
            url: '/beneficiarios?estado=A'
        }
       
        global_axios(config_request)
        .then((response)=>{
            console.log("DATA respondida en request paramentros: ",response.data)
            this.setState({data: response.data})
        })
    }

    

}//End
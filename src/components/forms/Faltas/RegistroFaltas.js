import React from 'react';
//import styled from 'styled-components'; //STYLES
import ReactSelectAsync from '../../general_components/form_components/select-asyn/react-select-async';
import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, /*ContainerEdit,*/ Row, HeaderForm, Container, TituloForm, /*Topbar*/ } from '../../general_components/form_components/container';
import { Label, InputText, Fieldset, Legend, TextArea, Fieldset1, Legend1 } from '../../general_components/form_components/controles';
import { cargarCatalogos, cargarCatalogosGenericoAsync} from '../../../funciones_globales/catalogos';
import  global_axios  from '../../../funciones_globales/interaccion_api';
import DayPicker from '../../general_components/form_components/date-picker/date-piker';
import moment from 'moment';

//GRID
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';



export default class RegistroFaltas extends React.Component{
    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            cedula:"",
            fecha_creacion: moment(),
            club_sel: null,
            //SELECTS
            options_estado: [],
            options_estado_sel: null,

            options_beneficiario_sel: null,


            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

            //Grid
            grid_Club: [],
            grid_Asignacion:[],
            colDefs_Club: [
                            {
                                header: "Beneficiario",
                                field: "beneficiario",
                                width: 300,
                                type: "string"
                            },
                            {
                                header: "Semana",
                                field: "s1",
                                width: 120,
                                type: "string"
                            },
                            {
                                header: "Falta",
                                field: "Falta",
                                width: 150,
                                type: "string",
                            }
                        ],

};

            //GRID
            this.gridOptionsClub = {
                context: {
                    componentParent: this
                },
                enableFilter: true,      
                enableColResize: true,
                enableCellChangeFlash: true,
                onCellValueChanged: (event)=>{  }                                  
           };
    
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

     //Asignacion
    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
    }

    getOptions_Club(input, callback){

        if (input.toString().length >= 3 ){
            let cadena_busq = '?cadena_busq=' + input;
            cargarCatalogosGenericoAsync('/club', cadena_busq, callback)  
        }
    }

    render() {

        return <div className="container">
            <HeaderForm>
                <TituloForm>Registro de Faltas</TituloForm>
            </HeaderForm>
            <CuerpoForm>
                <Row>
                <Row>
                    <Container className='col-md-4' >
                        <Label>Club:</Label>
                        <ReactSelectAsync  value={this.state.club_sel} func_onChange={(value)=>{this.setState({club_sel: value})}} func_loadOptions={this.getOptions_Club.bind(this)} />
                    </Container>
                </Row>
                <Row>
                    <Container className='col-md-12'>
                          <AgGridRender altura='250px' data={this.state.grid_Club} columnas={this.state.colDefs_Club} gridOptions={this.gridOptionsClub} onGridReady={this.onGridReady} />
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

  //Realiza todas estas operaciones al renderizar el form catalogos?tabla=DIASEMANA&estado=A
    componentDidMount(){
        Promise.all([
            cargarCatalogos('GENESTADO')
        ])
        .then(([result_estado]) => {
            this.setState({ options_estado: result_estado }, ()=>{
                //DEFAULT VALUE DESPUES DE ASIGNAR
                this.state.options_estado.forEach((OP)=>{
                    if(OP.value === 'A'){
                        console.log(OP)
                        this.setState({options_estado_sel: OP});
                    }
                })
                this.cargarGridAsignacion();
            })
        })
        .catch(err => {
          console.log(err);
        });
    }

    cargarGridAsignacion(){
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: 'GET',
            url: '/asignaciones'
        }
       
        global_axios(config_request)
        .then((response)=>{
            console.log("DATA respondida en request paramentros: ",response.data)
            this.setState({grid_Club: response.data})
        })
        .catch(err => {
            console.log(err);
        });
    } 

}//End
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



export default class inscribirBeneficiario extends React.Component{
    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            cedula:"",
            fecha_creacion: moment(),
            //SELECTS
            options_estado: [],
            options_estado_sel: null,

            options_beneficiario_sel: null,


            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

            //Grid
            grid_Club: [],
            grid_Asignacion:[],
            colDefs_Club: [{    header: "",
                                width: 30,
                                suppressRowClickSelection:true,
                                checkboxSelection: true,
                                suppressSorting: true,
                                suppressMenu: true,
                                suppressFilter: true,
                                pinned: true
                            },
                            {   header: "N°",
                                field: "secuencia",
                                width: 50,
                                type: "string"
                            },
                            {
                                header: "Club",
                                field: "club",
                                width: 150,
                                type: "string"
                            },
                            {
                                header: "Punto Satélite",
                                field: "punto_satelite_N",
                                width: 150,
                                type: "string",
                            },
                            {
                                header: "Dia",
                                field: "dia_D",
                                width: 100,
                                type: "string"
                            },
                            {
                                header: "Desde",
                                field: "desde",
                                width: 100,
                                type: "string"
                            },
                            {
                                header: "Hasta",
                                field: "hasta",
                                width: 100,
                                type: "string"
                            }],

            columnDefs_Asignacion: [{   header: "N°",
                                        field: "secuencia",
                                        width: 50,
                                        type: "string"
                                    },
                                    {
                                        header: "Club",
                                        field: "club",
                                        width: 150,
                                        type: "string"
                                    },
                                    {
                                        header: "Punto Satélite",
                                        field: "punto_satelite_N",
                                        width: 150,
                                        type: "string",
                                    },
                                    {
                                        header: "Dia",
                                        field: "dia_D",
                                        width: 100,
                                        type: "string"
                                    },
                                    {
                                        header: "Desde",
                                        field: "desde",
                                        width: 100,
                                        type: "string"
                                    },
                                    {
                                        header: "Hasta",
                                        field: "hasta",
                                        width: 100,
                                        type: "string"
                                    },
                                    {
                                        header: "",
                                        field: "eliminar",
                                        width: 40,
                                        type: "boton_elim"
                                    }]
            };

            //GRID
            this.gridOptionsClub = {
                context: {
                    componentParent: this
                },
                rowSelection: 'single',
                enableFilter: true,      
                enableColResize: true,
                enableCellChangeFlash: true,
                onRowSelected: (event)=>{
                    let seleccion = this.api.getSelectedRows();
                    var cont = 0;

                    console.log("EVENTO: ",event)
                    if(event.node.selected === true){
                        if(this.state.options_beneficiario_sel !== null){
                        
                            var item ={};
                            var index = 0;
                            index = this.state.grid_Asignacion.length + 1;
                            console.log("ARRAY SEL", seleccion[0])
                            item.secuencia = index;
                            item.beneficiario_cod = this.state.options_beneficiario_sel.value;
                            item.club_cod = seleccion[0].id;
                            item.club = seleccion[0].club;
                            item.punto_satelite = seleccion[0].punto_satelite;
                            item.punto_satelite_N = seleccion[0].punto_satelite_N;
                            item.dia = seleccion[0].dia;
                            item.dia_D = seleccion[0].dia_D;
                            item.desde = seleccion[0].desde;
                            item.hasta = seleccion[0].hasta;
                            
                            if(this.comprobarCruces(item)===false){
                                this.setState(
                                    { grid_Asignacion: this.immutablePush(this.state.grid_Asignacion, item) }
                                ,()=>{
                                    console.log("ARRAY", this.state.grid_Asignacion)
                                    this.api.deselectAll();
                                })
                            }else{
                                alert("Cruce de horario detectado con el club: "+item.club);
                            }

                            
                        }else{
                            alert("Seleccione un beneficiario antes de proceder a asignar");
                            this.api.deselectAll();
                        }
                    }
                }                                  
           };
    
           this.gridOptions = {
            context: {
                componentParent: this
            },      
            enableColResize: true,
            enableCellChangeFlash: true
                                            
        };

        //Funciones binds
        this.changeValues = this.changeValues.bind(this);
        this.guardarInscripcion = this.guardarInscripcion.bind(this);

        //GRID
        this.onGridReady = this.onGridReady.bind(this);
    }

    comprobarCruces(fila){
        var response = false;
        this.state.grid_Asignacion.forEach((DATA)=>{
            if(fila.dia === DATA.dia && fila.desde === DATA.desde && fila.hasta === DATA.hasta){
                response = true;
            }
        })
        return response;
    }

     //Asignacion
    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
    }

    onGridReadyAsig(params) {
        this.apiA = params.api;
        this.columnApiA = params.columnApi;
    }

    //Adicionar un elimento en un ARRAY INMUTABLE
    immutablePush(array, newItem){
        return [ ...array, newItem ];  
    }

    //Eliminar un registro especifico del ARAAY
    immutableDelete (arr, index) {
        var i = parseInt(index, 10);
        return arr.slice(0,i).concat(arr.slice(i+1));
    }

    //ACTION PARA ELIMINAR
    methodFromParent(id ,datos_fila){
        var mensaje = window.confirm("¿Desea eliminar la dirección seleccionada?"); 
        
        if (mensaje){
            this.eliminarAsignacion(id, datos_fila ) 
        }
    }

    eliminarAsignacion(id, datos_fila){
        //ELIMINACION LOCAL
        this.setState(
            {grid_Asignacion: this.immutableDelete(this.state.grid_Asignacion, id)}
        )
    }

    getOptionsBeneficiario(input, callback){
        if(input.toString().length >= 3){
            let cadena_busq = '?cadena_busq=' + input;
            cargarCatalogosGenericoAsync('/beneficiarios', cadena_busq, callback)  
        }
    }

    guardarInscripcion(){
        if(this.state.grid_Asignacion.length > 0 && this.state.options_beneficiario_sel !== null){
            var data = {};
            data.detalle = this.state.grid_Asignacion;
            data.id = this.state.options_beneficiario_sel.value;

            let config_request = {
                method: 'POST',
                url: '/inscripciones/'+data.id,
                data
            }
        
            global_axios(config_request)
            .then((response)=>{
                alert(response.data.msg);
                //FUNC RECARGAR GRID
                this.cargarGridAsignacion();
                this.setState({grid_Asignacion: [], options_beneficiario_sel: null});
            })
            .catch(err => {
                console.log(err);
            });
        }else{
            alert("Cree una asignacion antes de guardar la transaccion")
        }
    }

    render() {

        return <div className="container">
            <HeaderForm>
                <TituloForm>Inscripción Beneficiario</TituloForm>
            </HeaderForm>
            <CuerpoForm>
                <Row>
                    <Container className='col-md-6' >
                        <Label>Beneficiario:</Label>
                        <ReactSelectAsync name="options_beneficiario_sel" value={this.state.options_beneficiario_sel} func_onChange={(value) => { this.setState({ options_beneficiario_sel: value }) }} func_loadOptions={this.getOptionsBeneficiario.bind(this)} />
                    </Container>
                    <Container className='col-md-3' >
                        <Label>Estado:</Label>
                        <Selects name="options_estado_sel" value={this.state.options_estado_sel}  onChange={(value) => { this.setState({ options_estado_sel: value }) }} options={this.state.options_estado} />
                    </Container>
                    <Container className='col-md-3' >
                        <Label>Fecha:</Label>
                        <DayPicker disabled={true} fechaSeleccionada={this.state.fecha_creacion} func_onChange={(fechaEscogida)=>{this.setState({fecha_creacion: fechaEscogida})}} />
                    </Container>
                </Row>
                <Row>
                    <Container className='col-md-12'>
                        <AgGridRender altura='250px' data={this.state.grid_Club} columnas={this.state.colDefs_Club} gridOptions={this.gridOptionsClub} onGridReady={this.onGridReady} />
                    </Container> 
                </Row>
                <Row>
                    <Container className='col-md-12' > 
                        <Fieldset className='col-md-12'>
                            <Legend>Asignación</Legend>
                            <AgGridRender altura='100px' data={this.state.grid_Asignacion} columnas={this.state.columnDefs_Asignacion} gridOptions={this.gridOptions} onGridReady={this.onGridReadyAsig} />
                        </Fieldset>
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
                            <button type="submit" className='btn btn-primary btn-sm' onClick={this.guardarInscripcion}>
                                <i className="fa fa-floppy-o fa-lg"></i> Guardar
                            </button>
                        </div>
                    </Container>
                </Row>                        
            </CuerpoForm>

        </div>;
    }

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
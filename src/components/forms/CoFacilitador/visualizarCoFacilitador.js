import React from 'react';
import styled from 'styled-components'; //STYLES

import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, /*ContainerEdit,*/ Row, HeaderForm, Container, TituloForm, /*Topbar,*/ HeaderModal, CuerpoModal } from '../../general_components/form_components/container';
import { Label, InputText, TextArea } from '../../general_components/form_components/controles';

import DayPicker from '../../general_components/form_components/date-picker/date-piker';
import moment from 'moment';

//GRID
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';
import { get_FechaLocalActual } from '../../../funciones_globales/utils';

//Modal
import MyModal from '../../general_components/form_components/modal/modal';

import  global_axios  from '../../../funciones_globales/interaccion_api';
import { cargarCatalogos, cargarCatalogosGenerico } from '../../../funciones_globales/catalogos';

import { getItemDatosSesion } from '../../../funciones_globales/manejosesion';


const LabelTitle = styled.label` //LABEL STYLE
    font-size: 18px;
    font-weight: 700;
    color: #901f61;
`;

class visualizarCoFacilitador extends React.Component{

    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            cedula:"",
            codigo: "",
            fecha_creacion: moment(get_FechaLocalActual(),'DD/MM/YYYY'),
            localidad: "",
            nombres: "",
            apellidos: "",
            fecha_nacimiento: moment(get_FechaLocalActual(),'DD/MM/YYYY'),
            observacion: "",
            motivo:"",
            //SELECTS
            options_estado: [],
            options_estado_sel: '',

            //operacion
            operacion: 'G',

            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

            //Grid
            grid_cofacilitador: [],
            grid_Asignacion:[],
            columnDefs_cofacilitador: [ 
                                        {
                                            header: "Cédula",
                                            field: "Codigo",
                                            width: 130,
                                            type: "string"
                                        },
                                        {
                                            header: "Nombre",
                                            field: "Nombre",
                                            width: 200,
                                            type: "string"
                                        },
                                        {
                                            header: "Apellido",
                                            field: "Apellido",
                                            width: 200,
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
                                            width: 80,
                                            type: "string",
                                        },
                                        {
                                            header: "Motivo",
                                            field: "Motivo",
                                            width: 160,
                                            type: "string",
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
            columnDefs_Asignacion: [{   header: "N°",
                                        field: "secuencia",
                                        width: 80,
                                        type: "string"
                                    },
                                    {
                                        header: "Co Facilitador",
                                        field: "cofacilitador",
                                        width: 350,
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
                                        header: "Día",
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
               this.eliminarParametro = this.eliminarParametro.bind(this);
               this.guardarCofacilitador = this.guardarCofacilitador.bind(this);
           


        //Modals
        this.showModal = this.showModal.bind(this); //SWITCH OPEN/CLOSE
        this.onClose = this.onClose.bind(this);     //CLOSE

        //GRID
        this.onGridReady = this.onGridReady.bind(this);

    }

        //ACTION PARA ELIMINAR
        methodFromParent(id ,datos_fila){
            if(datos_fila.hasOwnProperty('Edad')===true && datos_fila.hasOwnProperty('Estado')===true){
                var mensaje = window.confirm("¿Desea eliminar la dirección seleccionada?"); 
                if (mensaje){
                    this.eliminarParametro(id, datos_fila ) 
                }
            }

            if(datos_fila.hasOwnProperty('desde')===true && datos_fila.hasOwnProperty('hasta')===true){
                var mensaje = window.confirm("¿Desea desvincular al cofacilitador actual de todos los clubs de "+datos_fila.club+"?"); 
                if (mensaje){
                    this.desVincularCofacilitador(id, datos_fila ) 
                }
            }
        }
    
        eliminarParametro(id, datos_fila ){
            //ELIMINACION LOCAL
            /* this.setState(
                {gridParametros: this.immutableDelete(this.state.gridParametros, id)}
            ) */
    
            //Eliminacion DB
            //Proceso Adquirir Registros GRID
            let config_request = {
                method: 'DELETE',
                url: '/cofacilitadores/'+datos_fila.Codigo.toString()
            }
        
            global_axios(config_request)
            .then((response)=>{
                alert(response.data.msg);
                //FUNC RECARGAR GRID
                this.cargarGrid();
                
            })
            .catch(err => {
                console.log(err);
            });
        }

        desVincularCofacilitador(id, datos_fila){
            let config_request = {
                method: 'PATCH',
                url: '/asignaciones/desvinculacion/'+datos_fila.id.toString()
            }
        
            global_axios(config_request)
            .then((response)=>{
                alert(response.data.msg);
                //FUNC RECARGAR GRID
                this.cargarGridAsignacionCO();
            })
            .catch(err => {
                console.log(err);
            });
        }
    
//ACTION PARA MODIFICAR
methodModifyFromParent(id, datos_fila){
    console.log(datos_fila)
    this.setState({cedula: datos_fila.Codigo});
    this.setState({operacion: 'M'});
    this.cargarCoFacilitador(datos_fila.Codigo);
    this.showModal();
}

        //Adicionar un elimento en un ARRAY INMUTABLE
    immutablePush(array, newItem){
        return [ ...array, newItem ];  
    }

    render() {
        return <div className="container">
            <HeaderForm>
                <TituloForm>Visualizar Co-Facilitador</TituloForm>
            </HeaderForm>
            <CuerpoForm>
                <Row>
                    <Container className='col-md-12'>
                        <AgGridRender altura='250px' data={this.state.grid_cofacilitador} columnas={this.state.columnDefs_cofacilitador} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                    </Container>
                </Row>
                <Row>
                    <Container className='col-md-12'>
                        <div className="btn-group pull-right">
                            <Label></Label>
                            <button type="submit" className='btn btn-primary btn-sm' onClick={this.showModal}>
                            <i className="fa fa-plus-circle fa-lg"></i> Nuevo
                            </button>
                        </div>
                    </Container>
                </Row>
                <Row>
                    <Container className='col-md-12'>
                        <LabelTitle>Asignaciones</LabelTitle>
                        <AgGridRender altura='200px' data={this.state.grid_Asignacion} columnas={this.state.columnDefs_Asignacion} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                    </Container>
                </Row>
                
            </CuerpoForm>



            {/*-----------------------------------------------Modal---------------------------------------------------*/}

            <MyModal open={this.state.isShowingModal} onClose={this.onClose}>
                <HeaderModal>
                    <TituloForm>Registro Co-Facilitador</TituloForm>
                </HeaderModal>
                <CuerpoModal>
                    <Row>
                        <Container className='col-md-4' >
                            <Label>Cédula:</Label>
                            <InputText name='cedula' value={this.state.cedula} type="number" className='form-control input-sm' placeholder='Cédula' onChange={this.changeValues} />
                        </Container>
                        <Container className='col-md-4' >
                                <Label>Código Apadrinado:</Label>
                                <InputText name='codigo' value={this.state.codigo} type="number" className='form-control input-sm' placeholder='Código Apadrinado' onChange={this.changeValues} />
                        </Container>
                       <Container className='col-md-4' >
                                    <Label>Fecha:</Label>
                                    <DayPicker disabled={true} fechaSeleccionada={this.state.fecha_creacion} func_onChange={(fechaEscogida)=>{this.setState({fecha_creacion: fechaEscogida})}} />
                        </Container>
                    </Row>
                    <Row>
                        <Container className='col-md-4' >
                            <Label>Nombres:</Label>
                            <InputText name='nombres' value={this.state.nombres} type="string" className='form-control input-sm' placeholder='Nombres' onChange={this.changeValues} />
                        </Container>
                        <Container className='col-md-4' >
                            <Label>Apellidos:</Label>
                            <InputText name='apellidos' value={this.state.apellidos} type="string" className='form-control input-sm' placeholder='Apellidos' onChange={this.changeValues} />
                        </Container>
                        <Container className='col-md-4' >
                            <Label>Fecha Nacimiento:</Label>
                            <DayPicker fechaSeleccionada={this.state.fecha_nacimiento} func_onChange={(fechaEscogida)=>{this.setState({fecha_nacimiento: fechaEscogida})}}/>
                        </Container>
                    </Row>
                    <Row>
                        <Container className='col-md-12' >
                            <Label>Observaciones:</Label>
                            <TextArea name='observacion'value={this.state.observacion} placeholder='Observaciones' onChange={this.changeValues}></TextArea>
                        </Container>
                    </Row>
                    <Row>
                        <Container className='col-md-3' >
                            <Label>Estado:</Label>
                            <Selects name="options_estado_sel" value={this.state.options_estado_sel} onChange={(value) => { this.setState({ options_estado_sel: value }) }} options={this.state.options_estado} />
                        </Container>
                        <Container className='col-md-9' >
                            <Label>Motivo:</Label>
                            <InputText name='motivo' value={this.state.motivo} type="string" className='form-control input-sm' placeholder='Motivo' onChange={this.changeValues} />
                        </Container>
                    </Row>

                    <Row>
                        <Container className='col-md-12'>
                            <div className="btn-group pull-right">
                                <button type="button" className='btn btn-secondary btn-sm'>
                                    <i className="fa fa-trash-o fa-lg"></i> Limpiar
                            </button>
                            </div>
                            <div className="btn-group pull-right">
                                <button type="button" className='btn btn-primary btn-sm' onClick={this.guardarCofacilitador}>
                                    <i className="fa fa-floppy-o fa-lg"></i> Guardar
                            </button>
                            </div>
                        </Container>
                    </Row>
                </CuerpoModal>
            </MyModal>

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


    guardarCofacilitador(){
        //VALIDACION DE CAMPS REQUERIDOS

        //Asignacion a guardar
        var data = {};

        data.cedula = this.state.cedula
        data.codigo = this.state.codigo;
        data.localidad = getItemDatosSesion('localidad');
        data.nombres = this.state.nombres;
        data.apellidos = this.state.apellidos;
        data.fecha_nacimiento = moment(this.state.fecha_nacimiento).format('L');
        data.options_estado_sel = this.state.options_estado_sel.value;
        data.observacion = this.state.observacion;
        data.motivo= this.state.motivo;
        data.fecha_creacion = moment(this.state.fecha_creacion).format('L');
        

        //Request
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: (this.state.operacion==='G'?'POST':'PATCH'),
            url: (this.state.operacion==='G'?'/cofacilitadores':'/cofacilitadores/'+this.state.cedula.toString()),
            data
        }
        global_axios(config_request)
        .then((response)=>{
            console.log("DATA respondida en request paramentros: ",response.data)
            alert(response.data.msg);
            //Actualizacion del grid luego de guardar
            this.cargarGrid();
        })
        .catch(err => {
            console.log(err);
        });
    }


   //Realiza todas estas operaciones al renderizar el form
    componentDidMount() {
        Promise.all([
            cargarCatalogos('GENESTADO')

        ])
        .then(([result_estado]) => {
            this.setState(
                { options_estado: result_estado   
            }, ()=>{
                //DEFAULT VALUE DESPUES DE ASIGNAR
                this.state.options_estado.forEach((OP)=>{
                    if(OP.value === 'A' ){
                        this.setState({options_estado_sel: OP});
                    }
                })
            })
        })
        .catch(err => {
        console.log(err);
        });

        this.cargarGrid();
        this.cargarGridAsignacionCO();
    }

    cargarGrid(){
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: 'GET',
            url: '/cofacilitadores?estado=A&estado=I'
        }
    
        global_axios(config_request)
        .then((response)=>{
            console.log("DATA respondida en request paramentros: ",response.data)
            this.setState({grid_cofacilitador: response.data})
        })
        .catch(err => {
            console.log(err);
        });

    }

    
    cargarCoFacilitador(cedula){
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: 'GET',
            url: '/cofacilitadores/'+cedula
        }
       
        global_axios(config_request)
        .then((response)=>{
            if(response.data === null){
                alert("El registro no existe");
            }else{
                //console.log(response.data);
                var respuesta = response.data;
                console.log(response.data)
                this.setState({
                    cedula: respuesta.cedula, codigo: (respuesta.cod_apadrinado===null?'':respuesta.cod_apadrinado), fecha_creacion: moment(respuesta.fecha_inscripcion, 'DD/MM/YYYY'),
                    localidad: respuesta.localidad, nombres: respuesta.nombre, apellidos: respuesta.apellido,
                    fecha_nacimiento: moment(respuesta.fecha_nacimiento, 'DD/MM/YYYY'),
                    observacion: (respuesta.observaciones===null?'':respuesta.observaciones),
                    options_estado_sel: respuesta.estado
                    
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    cargarGridAsignacionCO(){
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: 'GET',
            url: '/asignaciones?cofacilitador=true'
        }
       
        global_axios(config_request)
        .then((response)=>{
            console.log("DATA respondida en request paramentros: ",response.data)
            this.setState({grid_Asignacion: response.data})
        })
        .catch(err => {
            console.log(err);
        });
    }

}//End

export default visualizarCoFacilitador;
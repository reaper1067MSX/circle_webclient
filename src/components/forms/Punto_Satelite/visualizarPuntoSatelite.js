import React from 'react';
import styled from 'styled-components'; //STYLES

import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, /*ContainerEdit,*/ Row, HeaderForm, Container, TituloForm, /*Topbar,*/ HeaderModal, CuerpoModal } from '../../general_components/form_components/container';
import { Label, InputText, Fieldset,Legend } from '../../general_components/form_components/controles';

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
import { fomatearFechaMoment_a_String } from '../../../funciones_globales/format';



const Content = styled.div`
    border: 1px solid #000;
    
    width: 200px;
    height: 200px;
`;


class visualizarPuntoSatelite extends React.Component{

    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            codigo:"",
            localidad: "",
            nombre: "",
            fecha_creacion: moment(get_FechaLocalActual(),'DD/MM/YYYY'),
            telefono:"",
            direccion:"",
            longitud:"",
            latitud:"",
            responsable:"",
            capacidad:"",
            //SELECTS
            options_estado: [],
            options_estado_sel: '',
            options_tipo:[],
            options_tipo_sel: '',

             //estado op
             operacion: 'G',


            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

            //Grid
            grid_Satelite: [],
            columnDefs_Satelite: [
                                    {
                                        header: "Código",
                                        field: "Codigo",
                                        width: 100,
                                        type: "string"
                                    },
                                    {
                                        header: "Nombre",
                                        field: "Nombre",
                                        width: 250,
                                        type: "string"
                                    },
                                    {
                                        header: "Tipo",
                                        field: "Tipo",
                                        width: 100,
                                        type: "string",
                                    },
                                    {
                                        header: "Dirección",
                                        field: "Direccion",
                                        width: 350,
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
        this.guardarPuntoSatelite = this.guardarPuntoSatelite.bind(this);

        //Modals
        this.showModal = this.showModal.bind(this); //SWITCH OPEN/CLOSE
        this.onClose = this.onClose.bind(this);     //CLOSE

        //GRID
        this.onGridReady = this.onGridReady.bind(this);
    }

    //ACTION PARA ELIMINAR
    methodFromParent(id ,datos_fila){
        var mensaje = window.confirm("¿Desea eliminar la dirección seleccionada?"); 
        
        if (mensaje){
            this.eliminarParametro(id, datos_fila ) 
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
            url: '/puntosatelite/'+datos_fila.Codigo.toString()
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

       
//ACTION PARA MODIFICAR
methodModifyFromParent(id, datos_fila){
    console.log(datos_fila)
    this.setState({codigo: datos_fila.Codigo});
    this.setState({operacion: 'M'});
    this.cargarPuntoSatelite(datos_fila.Codigo);
    this.showModal();
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

    render() {

        return <div className="container">
            <HeaderForm>
                <TituloForm>Visualizar Puntos Satelites</TituloForm>
            </HeaderForm>
           
            <CuerpoForm>
                <Row>
                    <Container className='col-md-12'>
                        <AgGridRender altura='250px' data={this.state.grid_Satelite} columnas={this.state.columnDefs_Satelite} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
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
            </CuerpoForm>



            {/*-----------------------------------------------Modal---------------------------------------------------*/}

            <MyModal open={this.state.isShowingModal} onClose={this.onClose}>
                <HeaderModal>
                    <TituloForm>Registro Punto Satélite</TituloForm>
                </HeaderModal>
                <CuerpoModal>
                <Row>
                    <Container className='col-md-5' >
                        <Label>Código:</Label>
                        <InputText name='codigo' value={this.state.codigo} type="text" className='form-control input-sm' placeholder='Código' onChange={this.changeValues} />
                    </Container>
                    <Container className='col-md-3' >
                        <Label>Estado:</Label>
                        <Selects name="options_estado_sel" value={this.state.options_estado_sel} onChange={(value) => { this.setState({ options_estado_sel: value }) }} options={this.state.options_estado} />
                    </Container>
                    <Container className='col-md-4' >
                        <Label>Fecha:</Label>
                        <DayPicker disabled={true} fechaSeleccionada={this.state.fecha_creacion} func_onChange={(fechaEscogida)=>{this.setState({fecha_creacion: fechaEscogida})}} />
                    </Container>
                </Row>
                <Row>
                        <Container className='col-md-12' > 
                            <Label>Nombre:</Label>
                            <InputText name='nombre' value={this.state.nombre} type="text" className='form-control input-sm' placeholder='Nombre' onChange={this.changeValues} />
                        </Container>
                </Row>
                <Row>
                        <Container className='col-md-6' > 
                                <Label>Tipo:</Label>
                                <Selects name="options_tipo_sel" value={this.state.options_tipo_sel} onChange={(value) => { this.setState({ options_tipo_sel: value }) }} options={this.state.options_tipo} />
                        </Container>
                        <Container className='col-md-6' > 
                                <Label>Telf:</Label>
                                <InputText name='telefono' value={this.state.telefono} type="text" className='form-control input-sm' placeholder='Teléfono' onChange={this.changeValues} />
                        </Container>
                </Row>
                            <Row>
                                <Container className='col-md-12' > 
                                    <Label>Dirección:</Label>
                                    <InputText name='direccion' value={this.state.direccion} type="text" className='form-control input-sm' placeholder='Dirección' onChange={this.changeValues} />    
                                </Container>
                            </Row>
                           <Row>
                                 <Container className='col-md-6' > 
                                        <Label>Mz:</Label>
                                        <InputText name='longitud' value={this.state.longitud} type="text" className='form-control input-sm' placeholder='Mz' onChange={this.changeValues} />
                                    </Container>
                                    <Container className='col-md-6' > 
                                        <Label>Vila:</Label>
                                        <InputText name='latitud' value={this.state.latitud} type="text" className='form-control input-sm' placeholder='Villa' onChange={this.changeValues} />
                                    </Container>
                            </Row>
     
                            <Row>
                                <Container className='col-md-8' > 
                                    <Label>Responsable:</Label>
                                    <InputText name='responsable' value={this.state.responsable} type="text" className='form-control input-sm' placeholder='Responsable' onChange={this.changeValues} />
                                </Container>
                                <Container className='col-md-4' > 
                                    <Label>Capacidad:</Label>
                                    <InputText name='capacidad' value={this.state.capacidad} type="text" className='form-control input-sm' placeholder='Capacidad' onChange={this.changeValues} />
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
                                <button type="button" className='btn btn-primary btn-sm' onClick={this.guardarPuntoSatelite}>
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
        Promise.all([
            cargarCatalogos('TIPOSATELI'),cargarCatalogos('GENESTADO')
        ])
        .then(([result_tipoPuntoSatelie, result_genEstado]) => {
            this.setState(
              { options_tipo: result_tipoPuntoSatelie,  options_estado: result_genEstado      
              }, ()=>{
                //DEFAULT VALUE DESPUES DE ASIGNAR
                this.state.options_estado.forEach((OP)=>{
                    if(OP.value === 'A'){
                        this.setState({options_estado_sel: OP});
                    }
                })
            })
        })
        .catch(err => {
            console.log(err);
        });
        
        this.cargarGrid();
    }

    cargarGrid(){
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: 'GET',
            url: '/puntosatelite?estado=A'
        }
    
        global_axios(config_request)
        .then((response)=>{
            console.log("DATA respondida en request paramentros: ",response.data)
            this.setState({grid_Satelite: response.data})
        })
        .catch(err => {
            console.log(err);
        });

    }

    guardarPuntoSatelite(){
        //VALIDACION DE CAMPS REQUERIDOS

        //Asignacion a guardar
        var data = {};
        data.codigo = this.state.codigo;
        data.localidad = getItemDatosSesion('localidad');
        data.nombre = this.state.nombre;
        data.options_tipo_sel = this.state.options_tipo_sel.value;
        data.longitud = this.state.longitud;
        data.latitud = this.state.latitud;
        data.telefono = this.state.telefono;
        data.capacidad = this.state.capacidad;
        data.options_estado_sel = this.state.options_estado_sel.value;
        data.fecha_creacion = moment(this.state.fecha_creacion).format('L');
        data.direccion = this.state.direccion;
        data.responsable = this.state.responsable;
        

        //Request
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: (this.state.operacion==='G'?'POST':'PATCH'),
            url: (this.state.operacion==='G'?'/puntosatelite':'/puntosatelite/'+this.state.codigo.toString()),
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

    
    cargarPuntoSatelite(codigo){
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: 'GET',
            url: '/puntosatelite/'+codigo
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
                    codigo: respuesta.id, 
                    localidad: respuesta.localidad, 
                    nombre: respuesta.nombre,
                    options_tipo_sel: respuesta.tipo,
                    longitud: respuesta.longitud,
                    latitud: respuesta.latitud,
                    telefono: respuesta.telefono,
                    capacidad: respuesta.capacidad,
                    options_estado_sel: respuesta.estado,
                    fecha_creacion: moment(respuesta.fecha_registro, 'DD/MM/YYYY'),
                    direccion: respuesta.direccion,
                    responsable: respuesta.responsable
   
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
    }



}//End

export default visualizarPuntoSatelite;

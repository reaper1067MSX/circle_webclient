import React from 'react';
import styled from 'styled-components'; //STYLES

import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, /*ContainerEdit,*/ Row, HeaderForm, Container, TituloForm, /*Topbar,*/ HeaderModal } from '../../general_components/form_components/container';
import { Label, InputText } from '../../general_components/form_components/controles';

import DayPicker from '../../general_components/form_components/date-picker/date-piker';
import moment from 'moment';

//GRID
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';

//Modal
import MyModal from '../../general_components/form_components/modal/modal';

//Axios
import  global_axios  from '../../../funciones_globales/interaccion_api';

import { cargarCatalogos, cargarCatalogosGenerico } from '../../../funciones_globales/catalogos';
import { get_FechaLocalActual } from '../../../funciones_globales/utils';
import { fomatearFechaMoment_a_String } from '../../../funciones_globales/format';



const CuerpoModal = styled.div`
    padding-bottom: 10px;
    padding-top: 20px;    
    padding-left: 10px;
    padding-right: 10px;
    margin-left: 1%;
    margin-right: 20px;
    height: 150px;
    width: 600px;
`;

class visualizarParametros extends React.Component{

    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            codigo: "",
            fecha_creacion: moment(get_FechaLocalActual(),'DD/MM/YYYY'),
            descripcion: "",
            //SELECTS
            options_estado: [],
            options_estado_sel: '',
            options_depen: [],
            options_depen_sel: '',
            options_tipo:[],
            options_tipo_sel: '',

            //estado op
            operacion: 'G',

            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

            //Grid
            gridParametros: [],
            columnDefs: [{
                            header: "Código",
                            field: "Codigo",
                            width: 150,
                            type: "string"
                        },
                        {
                            header: "Descripción",
                            field: "Descripcion",
                            width: 150,
                            type: "string"
                        },
                        {
                            header: "Tipo",
                            field: "Tipo",
                            width: 150,
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
        this.methodModifyFromParent = this.methodModifyFromParent.bind(this);
        this.guardarParametro = this.guardarParametro.bind(this);

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
            method: 'PATCH',
            url: '/parametros/'+datos_fila.Codigo.toString()
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
        this.cargarParametro(datos_fila.Codigo);
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
                <TituloForm>Visualizar Parametros</TituloForm>
            </HeaderForm>
            <CuerpoForm>
                <Row>
                    <Container className='col-md-12'>
                        <AgGridRender altura='250px' data={this.state.gridParametros} columnas={this.state.columnDefs} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                    </Container>
                </Row>
                <Row>
                    <Container className='col-md-12'>
                        <div className="btn-group pull-right">
                            <Label></Label>
                            <button type="submit" className='btn btn-primary btn-sm' onClick={()=>this.showModal('G')}>
                            <i className="fa fa-plus-circle fa-lg"></i> Nuevo
                            </button>
                        </div>
                    </Container>
                </Row>
            </CuerpoForm>
            {/*-----------------------------------------------Modal---------------------------------------------------*/}
            <MyModal open={this.state.isShowingModal} onClose={this.onClose}>
                <HeaderModal>
                    <TituloForm>Registro Parametros</TituloForm>
                </HeaderModal>
                <CuerpoModal>
                <Row>
                        <Container className='col-md-4 ' >
                                <Label>Codigo:</Label>
                                <InputText name='codigo' value={this.state.codigo} type="text" disabled={this.state.operacion==='M'?true:false} className='form-control input-sm' placeholder='Ej: 123' onChange={this.changeValues} />
                        </Container>
                        <Container className='col-md-4' >
                                <Label>Fecha:</Label>
                                <DayPicker disabled={true} fechaSeleccionada={this.state.fecha_creacion} func_onChange={(fechaEscogida)=>{this.setState({fecha_creacion: fechaEscogida})}} />
                        </Container>
                        <Container className='col-md-4' >
                            <Label>Estado:</Label>
                            <Selects name="options_estado_sel" value={this.state.options_estado_sel} onChange={(value) => { this.setState({ options_estado_sel: value }) }} options={this.state.options_estado} />
                        </Container>
                    </Row>
                    <Row>  
                        <Container className='col-md-4'>
                            <Label>Descripción:</Label>
                            <InputText name='descripcion' value={this.state.descripcion} type="text" className='form-control input-sm' placeholder='Ej: 123' onChange={this.changeValues} />
                        </Container>
                        <Container className='col-md-4'>
                            <Label>Tipo:</Label>
                            <Selects name="options_tipo_sel" value={this.state.options_tipo_sel} onChange={(value) => { this.setState({ options_tipo_sel: value }) }} options={this.state.options_tipo} />
                        </Container>
                        <Container className='col-md-4' >
                                <Label>Dependencia:</Label>
                                <Selects name="options_depen_sel" value={this.state.options_depen_sel} disabled={this.desactivarDep()} onChange={(value) => { this.setState({ options_depen_sel: value }) }} options={this.state.options_depen} />
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
                                <button type="button" className='btn btn-primary btn-sm' onClick={this.guardarParametro}>
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
    showModal(operacion){
        if(operacion === 'G'){
            this.setState({codigo: ''});
        }
        this.setState({ isShowingModal: !this.state.isShowingModal });
        console.log("OPERACION: ", this.state.operacion)
    }

    onClose(event) {
        this.setState({ isShowingModal: false });
        if(this.state.operacion === 'M'){
            this.setState({operacion: 'G'})
        }
    }

    desactivarDep(){
        if(this.state.options_tipo_sel === null){
            return true;
        }else if(this.state.options_tipo_sel.value === 'P'){
            return false;
        }else{
            return true;
        }
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

    guardarParametro(){
        //VALIDACION DE CAMPS REQUERIDOS

        //Asignacion a guardar
        var data = {};

        data.codigo = this.state.codigo;
        data.descripcion = this.state.descripcion;
        data.options_tipo_sel = this.state.options_tipo_sel.value;
        data.fecha_creacion = moment(this.state.fecha_creacion).format('L');
        data.options_estado_sel = this.state.options_estado_sel.value;

        if(this.state.options_depen_sel!==""){
            data.options_depen = this.state.options_depen_sel;
        }else{
            data.options_depen = "";
        }
        
        //Request
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: 'POST',
            url: '/parametros',
            data
        }
       
        global_axios(config_request)
        .then((response)=>{
            console.log("DATA respondida en request paramentros: ",response.data)
            alert(response.data.msg);

            //Actualizacion del grid luego de guardar

            //Proceso Adquirir Registros GRID
            let config_request = {
                method: 'GET',
                url: '/parametros?estado=A'
            }
        
            global_axios(config_request)
            .then((response)=>{
                console.log("DATA respondida en request paramentros: ",response.data)
                this.setState({gridParametros: response.data})
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err);
        });
    }

    //Realiza todas estas operaciones al renderizar el form
    componentDidMount() {
        
        Promise.all([
            cargarCatalogos('TIPOPARAM'), cargarCatalogos('GENESTADO'), cargarCatalogosGenerico('/parametros?tipo=O')

        ])
        .then(([result_tipoParametros, result_genEstado, resul_dependencia]) => {
          this.setState(
            { options_tipo: result_tipoParametros,  options_estado: result_genEstado, options_depen: resul_dependencia
                 
            })
            
        })
        .catch(err => {
          console.log(err);
        });

        this.cargarGrid();
        //console.log();
        
    }

    cargarGrid(){
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: 'GET',
            url: '/parametros?estado=A'
        }
       
        global_axios(config_request)
        .then((response)=>{
            console.log("DATA respondida en request paramentros: ",response.data)
            this.setState({gridParametros: response.data})
        })
        .catch(err => {
            console.log(err);
        });

    }

    cargarParametro(codigo){
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: 'GET',
            url: '/parametros/'+codigo
        }
       
        global_axios(config_request)
        .then((response)=>{
            if(response.data === null){
                alert("El registro no existe");
            }else{
                console.log(response.data);
                var respuesta = response.data;
                console.log(response.data.fecha_creacion)
                //fecha_creacion: moment(response.data.fecha_creacion, 'DD/MM/YYYY'),
                this.setState({
                    descripcion: respuesta.descripcion, options_estado_sel: respuesta.estado,
                    options_tipo_sel: respuesta.tipo, options_depen_sel: respuesta.dependencia,
                    fecha_creacion: moment(response.data.fecha_creacion, 'DD/MM/YYYY'),
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

}//End

export default visualizarParametros;
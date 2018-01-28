import React from 'react';
import styled from 'styled-components';
import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, /*ContainerEdit,*/ Row, HeaderForm, Container, TituloForm, /*Topbar,*/ HeaderModal, CuerpoModal } from '../../general_components/form_components/container';
import { Label, InputText ,TextArea } from '../../general_components/form_components/controles'; 
import DayPicker from '../../general_components/form_components/date-picker/date-piker';
import moment from 'moment';
import { get_FechaLocalActual } from '../../../funciones_globales/utils';
import  global_axios  from '../../../funciones_globales/interaccion_api';
import { cargarCatalogos, cargarCatalogosGenerico } from '../../../funciones_globales/catalogos';
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';
import MyModal from '../../general_components/form_components/modal/modal';

const LabelTitle = styled.label` //LABEL STYLE
    font-size: 18px;
    font-weight: 700;
    color: #901f61;
`;

class visualizarClub extends React.Component{

    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            codigo: "",
            nombre: "",
            observacion:"",
            objEspecOpc: [],
            objEspec_sel: '',
            programaOpc: [],
            programa_sel:'',
            estadoOpc: [],
            estado_sel: 'A',
            fecha_creacion: moment(get_FechaLocalActual(),'DD/MM/YYYY'),

            //estado op
            operacion: 'G',

            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

            //Grid
            grid_club: [],
            grid_Asignacion:[],
            columnDefs: [{
                            header: "Cod.",
                            field: "Codigo",
                            width: 50,
                            type: "string"
                        },
                        {
                            header: "Club",
                            field: "Nombre",
                            width: 150,
                            type: "string"
                        },
                        {
                            header: "Fecha",
                            field: "fecha_creacion",
                            width: 100,
                            type: "string"
                        },
                        {
                            header: "Objetivo. Est.",
                            field: "ObjetivoEstrategico",
                            width: 150,
                            type: "string"
                        },
                        {
                            header: "Programa",
                            field: "NombrePrograma",
                            width: 170,
                            type: "string"
                        },
                        {
                            header: "Observación",
                            field: "observacion",
                            width: 150,
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
        this.eliminarClub = this.eliminarClub.bind(this);
        this.guardarClub = this.guardarClub.bind(this);
        //Modals
        this.showModal = this.showModal.bind(this); //SWITCH OPEN/CLOSE
        this.onClose = this.onClose.bind(this);     //CLOSE

        //GRID
        this.onGridReady = this.onGridReady.bind(this);

    }

    //ACTION PARA ELIMINAR
    methodFromParent(id ,datos_fila){

        if(datos_fila.hasOwnProperty('ObjetivoEstrategico') === true && datos_fila.hasOwnProperty('NombrePrograma')===true){
            var mensaje = window.confirm("¿Desea eliminar la dirección seleccionada?"); 
            if (mensaje){
                this.eliminarClub(id, datos_fila ) 
            }
        }

        if(datos_fila.hasOwnProperty('punto_satelite_N') === true && datos_fila.hasOwnProperty('dia_D')===true){
            var mensaje = window.confirm("¿Desea eliminar la asignación seleccionada?"); 
            if (mensaje){
                this.eliminarAsignacion(id, datos_fila ) 
            }
        }

    
    }

    eliminarClub(id, datos_fila ){
        let config_request = {
            method: 'DELETE',
            url: '/club/'+datos_fila.Codigo.toString()
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

    //MANDAR 4 FUCK CAMPS PARA ELIMINAR UN PUERCO REGISTRO
    eliminarAsignacion(id, datos_fila){
        let config_request = {
            method: 'DELETE',
            url: '/asignaciones/'+datos_fila.id.toString()+'/'+datos_fila.punto_satelite+'/'+datos_fila.secuencia+'/'+datos_fila.dia
        } 
        global_axios(config_request)
        .then((response)=>{
            alert(response.data.msg);
            //FUNC RECARGAR GRID
            this.cargarGridAsignacion();   
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
        this.cargarClub(datos_fila.Codigo);
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
                <TituloForm>Visualizar Clubs</TituloForm>
            </HeaderForm>
            <CuerpoForm>
                <Row>
                    <Container className='col-md-12'>
                        <AgGridRender altura='250px' data={this.state.grid_club} columnas={this.state.columnDefs} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                    </Container>
                </Row>
                <Row>
                    <Container className='col-md-12'>
                        <div className="btn-group pull-right">
                                <button type="submit" className='btn btn-primary btn-sm' onClick={()=>this.showModal('G')}>
                                    <i className="fa fa-plus-circle fa-lg"></i> Nuevo
                                </button>
                        </div>
                    </Container>
                </Row>
                <Row>
                    <Container className='col-md-10'>
                        <LabelTitle>Asignaciones</LabelTitle>
                        <AgGridRender altura='200px' data={this.state.grid_Asignacion} columnas={this.state.columnDefs_Asignacion} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                    </Container>
                </Row>
            </CuerpoForm>

            {/*-----------------------------------------------Modal---------------------------------------------------*/}

            <MyModal open={this.state.isShowingModal} onClose={this.onClose}>

                <HeaderModal>
                    <TituloForm> Registro Club</TituloForm>
                </HeaderModal>
                <CuerpoModal>
                    <Row>
                        <Container className='col-md-4' >
                                <Label>Código:</Label>
                                <InputText name='codigo' value={this.state.codigo} disabled={this.state.operacion==='M'?true:false} type="text"className='form-control input-sm' placeholder='Código' onChange={this.changeValues} />
                        </Container>
                        <Container className='col-md-4' >
                            <Label>Fecha:</Label>
                            <DayPicker disabled={true} fechaSeleccionada={this.state.fecha_creacion} func_onChange={(fechaEscogida)=>{this.setState({fecha_creacion: fechaEscogida})}} />
                        </Container>
                        <Container className='col-md-4' >
                            <Label>Estado:</Label>
                            <Selects name="estado_sel" value={this.state.estado_sel} onChange={(value) => { this.setState({ estado_sel: value }) }} options={this.state.estadoOpc} />
                         </Container> 
                    </Row>
                    <Row>
                        <Container className='col-md-4'>
                            <Label>Nombre:</Label>
                            <InputText name='nombre' value={this.state.nombre} type="text" className='form-control input-sm' placeholder='Nombre' onChange={this.changeValues} />
                         </Container>
                         <Container className='col-md-4'>
                            <Label>Objetivo Est.:</Label>
                            <Selects name="objEspec_sel" value={this.state.objEspec_sel} onChange={(value) => { this.setState({ objEspec_sel: value }) }} options={this.state.objEspecOpc} />
                        </Container>
                         <Container className='col-md-4'>  
                            <Label>Programa:</Label>
                            <Selects name="programa_sel" value={this.state.programa_sel} onChange={(value) => { this.setState({ programa_sel: value }) }} options={this.state.programaOpc} />
                        </Container>
                    </Row>
                    <Row>
                        <Container className='col-md-12' >
                            <Label>Observación:</Label>
                            <TextArea name='observacion'value={this.state.observacion} placeholder='Observación' onChange={this.changeValues}></TextArea>
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
                                <button type="button" className='btn btn-primary btn-sm' onClick={this.guardarClub}>
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

    //Abrir/cerrar modal
    showModal(operacion) {
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

    //Functions
    changeValues(event) {
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
            cargarCatalogos('GENESTADO'), cargarCatalogosGenerico('/parametros?tipo=O'),cargarCatalogosGenerico('/parametros?tipo=P')

        ])
        .then(([result_estado, result_objetivo, result_programa]) => {
            this.setState(
                { estadoOpc: result_estado,  objEspecOpc: result_objetivo, programaOpc: result_programa   
            }, ()=>{
                //DEFAULT VALUE DESPUES DE ASIGNAR
                this.state.estadoOpc.forEach((OP)=>{
                    if(OP.value === 'A'){
                        this.setState({estado_sel: OP});
                    }
                })
            })
        })
        .catch(err => {
          console.log(err);
        });

        this.cargarGrid();
        this.cargarGridAsignacion();
    }

    cargarGrid(){
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: 'GET',
            url: '/club?estado=A'
        }
       
        global_axios(config_request)
        .then((response)=>{
            console.log("DATA respondida en request paramentros: ",response.data)
            this.setState({grid_club: response.data})
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
            this.setState({grid_Asignacion: response.data})
        })
        .catch(err => {
            console.log(err);
        });
    }

    //INSERT CLUB
    guardarClub(){
        //VALIDACION DE CAMPS REQUERIDOS

        //Asignacion a guardar
        var data = {};

        data.codigo = this.state.codigo;
        data.fecha_creacion = moment(this.state.fecha_creacion).format('L');
        data.nombre = this.state.nombre;
        data.estado_sel = this.state.estado_sel.value;
        data.objEspec_sel = this.state.objEspec_sel.value;
        data.programa_sel = this.state.programa_sel.value;
        data.observacion = this.state.observacion;
        
        //Request
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: (this.state.operacion==='G'?'POST':'PATCH'),
            url: (this.state.operacion==='G'?'/club':'/club/'+this.state.codigo.toString()),
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

    cargarClub(codigo){
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: 'GET',
            url: '/club/'+codigo
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
                    codigo: respuesta.id, fecha_creacion: moment(respuesta.fecha_creacion, 'DD/MM/YYYY'),
                    nombre: respuesta.nombre, estado_sel: respuesta.estado, objEspec_sel: respuesta.objetivo_Estrategico,
                    programa_sel: respuesta.programa, observacion: (respuesta.observacion===null?'':respuesta.observacion),
                    
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

}//End

export default visualizarClub;

    

    
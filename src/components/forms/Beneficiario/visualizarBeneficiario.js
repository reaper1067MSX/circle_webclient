import React from 'react';
//import styled from 'styled-components'; //STYLES

import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, Row, HeaderForm, Container, TituloForm, HeaderModal, CuerpoModal } from '../../general_components/form_components/container';
import { Label, InputText, Fieldset, Legend, TextArea } from '../../general_components/form_components/controles';
import { Link } from 'react-router-dom';
import DayPicker from '../../general_components/form_components/date-picker/date-piker';
import moment from 'moment';
import { get_FechaLocalActual } from '../../../funciones_globales/utils';
import { fomatearFechaMoment_a_String } from '../../../funciones_globales/format';
import  global_axios  from '../../../funciones_globales/interaccion_api';
import { cargarCatalogos, cargarCatalogosGenerico } from '../../../funciones_globales/catalogos';

//GRID
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';

//Modal
import MyModal from '../../general_components/form_components/modal/modal';


class visualizarBeneficiario extends React.Component{
    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            codigo_apadrinado:'',
            cedula: "",
            fecha_creacion: moment(get_FechaLocalActual(),'DD/MM/YYYY'),
            nombres: "",
            apellidos: "",
            fecha_nacimiento: moment(get_FechaLocalActual(),'DD/MM/YYYY'),
            dolencia:"",
            escuela:"",
            periodoEscolar:"",
            calificacion:"",
            cedulaRepresentante:"",
            nombreRe:"",
            apellidoRe:"",
            direccion:"",
            telefono:"",
            //SELECTS
            options_estado: [],
            options_estado_sel: '',

            operacion: 'G',

            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

            //Grid
            gridBeneficiario: [],
            columnDefs_Beneficiario: [{         header: "Cedula",
                                                field: "Cedula",
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
        this.guardarBeneficiario = this.guardarBeneficiario.bind(this);
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
            this.eliminarBeneficiario(id, datos_fila ) 
        }
    }

    eliminarBeneficiario(id, datos_fila ){
        let config_request = {
            method: 'DELETE',
            url: '/beneficiarios/'+datos_fila.Cedula.toString()
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
        this.setState({cedula: datos_fila.Cedula});
        this.setState({operacion: 'M'});
        this.cargarBeneficiario(datos_fila.Cedula);
        this.showModal();
    }

    render() {

        return <div className="container">
            <HeaderForm>
                <TituloForm>Visualizar Beneficiarios</TituloForm>
            </HeaderForm>
            <CuerpoForm>
   
                <Row>
                    <Container className='col-md-12'>
                        <AgGridRender altura='250px' data={this.state.gridBeneficiario} columnas={this.state.columnDefs_Beneficiario} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
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
            </CuerpoForm>

    
            {/*-----------------------------------------------Modal---------------------------------------------------*/}

            <MyModal open={this.state.isShowingModal} onClose={this.onClose}>

                <HeaderModal>
                    <TituloForm> Registro Beneficiario</TituloForm>
                </HeaderModal>
            <CuerpoModal>
                <Row>
                    <Row>
                        <Container className='col-md-4' >
                            <Label>Cédula:</Label>
                            <InputText name='cedula' value={this.state.cedula} type="number" className='form-control input-sm' placeholder='Cédula' onChange={this.changeValues} />
                        </Container>
                        <Container className='col-md-4' >
                            <Label>Codigo Apadrinado:</Label>
                            <InputText name='codigo_apadrinado' value={this.state.codigo_apadrinado} type="number" className='form-control input-sm' placeholder='Codigo' onChange={this.changeValues} />
                        </Container>
                        
                        <Container className='col-md-4' >
                            <Label>Fecha:</Label>
                            <DayPicker disabled={true} fechaSeleccionada={this.state.fecha_creacion} func_onChange={(fechaEscogida)=>{this.setState({fecha_creacion: fechaEscogida})}} />
                        </Container>
                    </Row>
                    <Row>
                        <Container className='col-md-8' >
                            <Label>Nombres:</Label>
                            <InputText name='nombres' value={this.state.nombres} type="text" className='form-control input-sm' placeholder='Nombres' onChange={this.changeValues} />
                        </Container>
                        
                        <Container className='col-md-4' >
                            <Label>Fecha Nacimiento:</Label>
                            <DayPicker fechaSeleccionada={this.state.fecha_nacimiento} func_onChange={(fechaEscogida)=>{this.setState({fecha_nacimiento: fechaEscogida})}}/>
                        </Container> 
                    </Row>
                    <Row>
                    <Container className='col-md-8' pull-left >                           
                            <Label>Apellidos:</Label>
                            <InputText name='apellidos' value={this.state.apellidos} type="text" className='form-control input-sm' placeholder='Apellidos' onChange={this.changeValues} />
                    </Container>
                    <Container className='col-md-4 ' >
                            <Label>Estado:</Label>
                            <Selects name="options_estado_sel" value={this.state.options_estado_sel} onChange={(value) => { this.setState({ options_estado_sel: value }) }} options={this.state.options_estado} />
                        </Container>
                    </Row>
                    <Row>
                        <Container className='col-md-12' >
                            <Label>Dolencia Medica:</Label>
                            <TextArea name='dolencia' placeholder='Dolencia Medica' value={this.state.dolencia} onChange={this.changeValues} ></TextArea>
                        </Container>
                    
                    </Row>
                    {/*Educacion*/}
            
                    <Fieldset className='col-md-12'>
                        <Legend>Educacion</Legend>
                            <Container className='col-md-5' >
                                <Label>Nombre unidad edu.:</Label>
                                <InputText name='escuela' value={this.state.escuela} type="text" className='form-control input-sm' placeholder='Escuela' onChange={this.changeValues} />
                            </Container>
                            <Container className='col-md-4' >
                                <Label>Periodo Escolar:</Label>
                                <InputText name='periodoEscolar' value={this.state.periodoEscolar} type="text" className='form-control input-sm' placeholder='Periodo Escolar' onChange={this.changeValues} />
                            </Container>
                            <Container className='col-md-3' >
                                <Label>Calificacion:</Label>
                                <InputText name='calificacion' value={this.state.calificacion} type="number" className='form-control input-sm' placeholder='Calificacion' onChange={this.changeValues} />
                            </Container>
                    </Fieldset>
                    
                    {/*Representante*/}
                    <Fieldset className='col-md-12'>
                            <Legend>Representante</Legend>
                                <Row>
                                    <Container className='col-md-4' >
                                        <Label>Cedula:</Label>
                                        <InputText name='cedulaRepresentante' value={this.state.cedulaRepresentante} type="number" className='form-control input-sm' placeholder='Cedula' onChange={this.changeValues} />
                                    </Container>
                                    <Container className='col-md-4' >
                                        <Label>Nombres:</Label>
                                        <InputText name='nombreRe' value={this.state.nombreRe} type="text" className='form-control input-sm' placeholder='Nombres' onChange={this.changeValues} />
                                    </Container>
                                    <Container className='col-md-4' >
                                        <Label>Apellidos:</Label>
                                        <InputText name='apellidoRe' value={this.state.apellidoRe} type="text" className='form-control input-sm' placeholder='Apellidos' onChange={this.changeValues} />
                                    </Container> 
                                </Row>
                                <Row>
                                    <Container className='col-md-8' pull-left >
                                        <Label>Direccion:</Label>
                                        <InputText name='direccion' value={this.state.direccion} type="text" className='form-control input-sm' placeholder='Direccion' onChange={this.changeValues} />
                                    </Container>
                                    <Container className='col-md-4' >
                                        <Label>Telefono:</Label>
                                        <InputText name='telefono' value={this.state.telefono} type="number" className='form-control input-sm' placeholder='Telefono' onChange={this.changeValues} />
                                    </Container>
                                        
                                </Row>
                        </Fieldset>
                    </Row>
                        <Row>
                            <Container className='col-md-12'>
                                <div className="btn-group pull-right">
                                    <button type="submit" className='btn btn-secondary btn-sm'>
                                        <i className="fa fa-trash-o fa-lg"></i> Limpiar
                                    </button>
                                </div>
                                <div className="btn-group pull-right">
                                    <button type="submit" className='btn btn-primary btn-sm' onClick={this.guardarBeneficiario}> 
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

    ChangeDateNacimiento(day) {
        //SAVE
        this.setState({ fecha_nacimiento: day });

        //LEERLO
        //moment.locale('es');
        //alert(moment(this.state.fecha_creacion).format('L'));
    }

    // modal Abrir/cerrar
    showModal(operacion) {
        if(operacion === 'G'){
            this.setState({cedula: ''});
        }
        this.setState({ isShowingModal: !this.state.isShowingModal });
        console.log("OPERACION: ", this.state.operacion)
    }

    onClose(event) {
        this.setState({ isShowingModal: false });
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
    componentDidMount(){

        Promise.all([
            cargarCatalogos('GENESTADO')
        ])
        .then(([result_estado]) => {
            this.setState(
                { options_estado: result_estado }, ()=>{
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
        //Proceso Adquirir clave
        let config_request = {
            method: 'GET',
            url: '/beneficiarios?estado=A'
        }
       
        global_axios(config_request)
        .then((response)=>{
            console.log("DATA respondida en request paramentros: ",response.data)
            this.setState({gridBeneficiario: response.data})
        })
    }

    //INSERT CLUB
    guardarBeneficiario(){
        //VALIDACION DE CAMPS REQUERIDOS

        //Asignacion a guardar
        var data = {};

        data.cedula = this.state.cedula;
        data.codigo_apadrinado = this.state.codigo_apadrinado;
        data.fecha_inscripcion = moment(this.state.fecha_creacion).format('L');
        data.nombres = this.state.nombres;
        data.apellidos = this.state.apellidos;
        data.fecha_nacimiento = moment(this.state.fecha_nacimiento).format('L');
        data.estado = this.state.options_estado_sel.value;
        data.dolencia_medica = this.state.dolencia;
        data.unidad = this.state.escuela;
        data.periodoEscolar = this.state.periodoEscolar;
        data.calificacion = this.state.calificacion;
        data.telefono = this.state.telefono;
        data.cedulaRepresentante = this.state.cedulaRepresentante;
        data.nombreRe = this.state.nombreRe;
        data.apellidoRe = this.state.apellidoRe;
        data.direccion = this.state.direccion;
         
        
        //Request
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: (this.state.operacion==='G'?'POST':'PATCH'),
            url: (this.state.operacion==='G'?'/beneficiarios':'/beneficiarios/'+this.state.cedula.toString()),
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

    cargarBeneficiario(cedula){
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: 'GET',
            url: '/beneficiarios/'+cedula
        }
       
        global_axios(config_request)
        .then((response)=>{
            if(response.data === null){
                alert("El registro no existe");
            }else{
                //console.log(response.data);
                var res = response.data;
                console.log(response.data)
                this.setState({
                    cedula: res.cedula, nombres: res.nombre,apellidos: res.apellido, fecha_nacimiento: moment(res.fecha_nac, 'DD/MM/YYYY'),
                    options_estado_sel: res.estado, telefono: res.telefono, fecha_creacion: moment(res.fecha_inscripcion, 'DD/MM/YYYY'), 
                    dolencia: res.dolencia_medica, escuela: res.unidad_academica, periodoEscolar: res.periodo_electivo, calificacion: res.promedio_general,
                    cedulaRepresentante: res.representante_ced, nombreRe: res.representante_nombre, apellidoRe: res.representante_apellido,
                    direccion: res.direccion, codigo_apadrinado: res.cod_apadrinado 
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    

}//End

export default visualizarBeneficiario;

import React from 'react';
//import styled from 'styled-components'; //STYLES

import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, Row, HeaderForm, Container, TituloForm, HeaderModal, CuerpoModal } from '../../general_components/form_components/container';
import { Label, InputText, Fieldset, Legend, TextArea } from '../../general_components/form_components/controles';
import { Link } from 'react-router-dom';
import DayPicker from '../../general_components/form_components/date-picker/date-piker';
import moment from 'moment';

//Axios
import  global_axios  from '../../../funciones_globales/interaccion_api';

//GRID
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';

//Modal
import MyModal from '../../general_components/form_components/modal/modal';


class visualizarBeneficiario extends React.Component{
    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            cedula: "",
            codigo:"",
            fecha_creacion:"",
            nombres: "",
            apellidos: "",
            fecha_nacimiento:"",
            dolencia:"",
            escuela:"",
            periodoEscolar:"",
            calificacion:"",
            cedularepresentante:"",
            nombreRe:"",
            apellidoRe:"",
            direccion:"",
            telefono:"",
            //SELECTS
            options_estado: [],
            options_estado_sel: '',


            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

            //Grid
            gridBeneficiario: [],
            columnDefs_Beneficiario: [{         header: "Codigo",
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

          //Modals
          this.showModal = this.showModal.bind(this); //SWITCH OPEN/CLOSE
          this.onClose = this.onClose.bind(this);     //CLOSE
  

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
                        <AgGridRender altura='250px' data={this.state.gridBeneficiario} columnas={this.state.columnDefs_Beneficiario} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                    </Container>
                </Row>
                <Row>
                    <Container className='col-md-12'>
                        <div className="btn-group pull-right">
                        
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
                                    <InputText name='codigo' value={this.state.codigo} type="number" className='form-control input-sm' placeholder='Codigo' onChange={this.changeValues} />
                            </Container>
                            
                            <Container className='col-md-4' >
                                    <Label>Fecha:</Label>
                                    <DayPicker disabled={true} fechaSeleccionada={this.state.fecha_creacion} func_onChange={(fechaEscogida)=>{this.setState({fecha_creacion: fechaEscogida})}} />
                        
                            </Container>
                        </Row>
                        <Row>
                            <Container className='col-md-8' >
                                <Label>Nombres:</Label>
                                <InputText name='nombres' value={this.state.nombres} type="string" className='form-control input-sm' placeholder='Nombres' onChange={this.changeValues} />
                            </Container>
                            
                            <Container className='col-md-4' >
                                <Label>Fecha Nacimiento:</Label>
                                <DayPicker id="fecha_nacimiento" selected={this.state.fecha_nacimiento} onChange={this.ChangeDateNacimiento} />
                         </Container> 
                        </Row>
                        <Row>
                        <Container className='col-md-8' pull-left >                           
                                <Label>Apellidos:</Label>
                                <InputText name='apellidos' value={this.state.apellidos} type="string" className='form-control input-sm' placeholder='Apellidos' onChange={this.changeValues} />
                        </Container>
                        <Container className='col-md-4 ' >
                                <Label>Estado:</Label>
                                <Selects name="options_estado_sel" value={this.state.options_estado_sel} onChange={(value) => { this.setState({ progoptions_estado_selrama: value }) }} options={this.state.options_estado} />
                            </Container>
                        </Row>
                        <Row>
                            <Container className='col-md-12' >
                                <Label>Dolencia Medica:</Label>
                                <TextArea name='dolencia' placeholder='Dolencia Medica' value={this.state.observacion} onChange={this.changeValues} ></TextArea>
                            </Container>
                        
                        </Row>
                        {/*Educacion*/}
               
                    <Fieldset className='col-md-12'>
                        <Legend>Educacion</Legend>
                            <Container className='col-md-5' >
                                <Label>Nombre de Escuela:</Label>
                                <InputText name='escuela' value={this.state.escuela} type="string" className='form-control input-sm' placeholder='Escuela' onChange={this.changeValues} />
                            </Container>
                            <Container className='col-md-4' >
                                <Label>Periodo Escolar:</Label>
                                <InputText name='periodoEscolar' value={this.state.periodoEscolar} type="string" className='form-control input-sm' placeholder='Periodo Escolar' onChange={this.changeValues} />
                            </Container>
                            <Container className='col-md-3' >
                                <Label>Calificacion:</Label>
                                <InputText name='calificacion' value={this.state.calificacion} type="string" className='form-control input-sm' placeholder='Calificacion' onChange={this.changeValues} />
                            </Container>
                    </Fieldset>
                    
                {/*Representante*/}
                <Fieldset className='col-md-12'>
                        <Legend>Representante</Legend>
                            <Row>
                                <Container className='col-md-4' >
                                    <Label>Cedula:</Label>
                                    <InputText name='cedularepresentante' value={this.state.cedularepresentante} type="string" className='form-control input-sm' placeholder='Cedula' onChange={this.changeValues} />
                                </Container>
                                <Container className='col-md-4' >
                                    <Label>Nombres:</Label>
                                    <InputText name='nombreRe' value={this.state.nombreRe} type="string" className='form-control input-sm' placeholder='Nombres' onChange={this.changeValues} />
                                </Container>
                                <Container className='col-md-4' >
                                    <Label>Apellidos:</Label>
                                    <InputText name='apellidoRe' value={this.state.apellidoRe} type="string" className='form-control input-sm' placeholder='Apellidos' onChange={this.changeValues} />
                                </Container> 
                            </Row>
                            <Row>
                                <Container className='col-md-8' pull-left >
                                    <Label>Direccion:</Label>
                                    <InputText name='direccion' value={this.state.direccion} type="string" className='form-control input-sm' placeholder='Direccion' onChange={this.changeValues} />
                                </Container>
                                <Container className='col-md-4' >
                                    <Label>Telefono:</Label>
                                    <InputText name='telefono' value={this.state.telefono} type="string" className='form-control input-sm' placeholder='Telefono' onChange={this.changeValues} />
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
                                <button type="submit" className='btn btn-primary btn-sm'>
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

export default visualizarBeneficiario;

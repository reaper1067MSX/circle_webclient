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
            nombre: "",
            fecha_creacion: moment(get_FechaLocalActual(),'DD/MM/YYYY'),
            telefono:"",
            direccion:"",
            Longitud:"",
            Latitud:"",
            Responsable:"",
            Capacidad:"",
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
                                        header: "Nombre",
                                        field: "Nombre",
                                        width: 150,
                                        type: "string"
                                    },
                                    {
                                        header: "Tipo",
                                        field: "Tipo",
                                        width: 50,
                                        type: "string",
                                    },
                                    {
                                        header: "Direccion",
                                        field: "Direccion",
                                        width: 200,
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

        //Modals
        this.showModal = this.showModal.bind(this); //SWITCH OPEN/CLOSE
        this.onClose = this.onClose.bind(this);     //CLOSE

        //GRID
        this.onGridReady = this.onGridReady.bind(this);


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
                    <TituloForm>Registro Punto Satelite</TituloForm>
                </HeaderModal>
                <CuerpoModal>
                <Row>
                    <Container className='col-md-4' >
                        <Label>Codigo:</Label>
                        <InputText name='codigo' value={this.state.codigo} type="number" className='form-control input-sm' placeholder='Codigo' onChange={this.changeValues} />
                    </Container>
                    <Container className='col-md-3' >
                        <Label>Estado:</Label>
                        <Selects name="options_estado_sel" value={this.state.options_estado_sel} onChange={(value) => { this.setState({ programa: value }) }} options={this.state.options_estado} />
                    </Container>
                    <Container className='col-md-5' >
                        <Label>Fecha:</Label>
                        <DayPicker disabled={true} fechaSeleccionada={this.state.fecha_creacion} func_onChange={(fechaEscogida)=>{this.setState({fecha_creacion: fechaEscogida})}} />
                    </Container>
                </Row>
                    <Row>
                        <Container className='col-md-7' > 
                            <Label>Nombre:</Label>
                            <InputText name='nombre' value={this.state.nombre} type="text" className='form-control input-sm' placeholder='Nombre' onChange={this.changeValues} />
                            <Row>
                                <Container className='col-md-7' > 
                                    <Label>Tipo:</Label>
                                    <Selects name="options_tipo_sel" value={this.state.options_tipo_sel} onChange={(value) => { this.setState({ options_tipo_sel: value }) }} options={this.state.options_tipo} />
                                </Container>
                                <Container className='col-md-5' > 
                                    <Label>Telf:</Label>
                                    <InputText name='telefono' value={this.state.latitud} type="text" className='form-control input-sm' placeholder='Telefono' onChange={this.changeValues} />
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
                                        <Label>Longitud:</Label>
                                        <InputText name='longitud' value={this.state.longitud} type="text" className='form-control input-sm' placeholder='Longitud' onChange={this.changeValues} />
                                    </Container>
                                    <Container className='col-md-6' > 
                                        <Label>Latitud:</Label>
                                        <InputText name='latitud' value={this.state.latitud} type="text" className='form-control input-sm' placeholder='Latitud' onChange={this.changeValues} />
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
                        </Container>
                        <Container className='col-md-5'>
                            <Content/>
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

}//End

export default visualizarPuntoSatelite;

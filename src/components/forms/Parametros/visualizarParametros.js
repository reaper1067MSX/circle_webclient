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
//import { getItemDatosSesion } from '../../../funciones_globales/manejosesion';

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
            fecha_creacion:"",
            descripcion: "",
            //SELECTS
            options_estado: [],
            options_estado_sel: '',
            options_depen: [],
            options_depen_sel: '',
            options_tipo:[  { value: "O", label: 'Objetivo Estratégico' },
                            { value: "P", label: 'Programa' },
                            { value: "L", label: 'Localidad' }],
            options_tipo_sel: '',

            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

            //Grid
            data: [],
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
                <TituloForm>Visualizar Parametros</TituloForm>
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
                    <TituloForm>Registro Parametros</TituloForm>
                </HeaderModal>
                <CuerpoModal>
                <Row>
                        <Container className='col-md-4 ' >
                                <Label>Codigo:</Label>
                                <InputText name='codigo' value={this.state.codigo} type="number" className='form-control input-sm' placeholder='Ej: 123' onChange={this.changeValues} />
                        </Container>
                        <Container className='col-md-4' >
                                <Label>Fecha:</Label>
                                <DayPicker id="fecha_creacion" selected={this.state.fecha_creacion} onChange={this.ChangeDateNacimiento} />
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
                                <Selects name="options_depen_sel" value={this.state.options_depen_sel} disabled={this.state.options_tipo_sel.value !== 'P'?true:false} onChange={(value) => { this.setState({ options_depen_sel: value }) }} options={this.state.options_depen} />
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
        var options = [{ value: 0, label: 'Programa' },
        { value: 1, label: 'Objetivo Estrategico' },
        { value: 2, label: 'Localidad' }]

        this.setState({ options_users: options })
        
        //Proceso Adquirir clave
        let config_request = {
            method: 'GET',
            url: '/parametros?estado=A'
        }
       
        global_axios(config_request)
        .then((response)=>{
            console.log("DATA respondida en request paramentros: ",response.data)
            this.setState({data: response.data})
        })
        
    }

}//End

export default visualizarParametros;




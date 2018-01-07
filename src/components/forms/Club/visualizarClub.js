import React from 'react';
import styled from 'styled-components'; //STYLES

//import DayPicker from '../../general_components/form_components/date-picker/date-piker';
import moment from 'moment';

import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, /*ContainerEdit,*/ Row, HeaderForm, Container, TituloForm, /*Topbar,*/ HeaderModal, /*CuerpoModal*/ } from '../../general_components/form_components/container';
import { Label, InputText,Fieldset,Legend ,TextArea } from '../../general_components/form_components/controles'; 

//GRID
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';
/* import { ColumnApi, GridApi } from "ag-grid";
import { GridOptions } from "ag-grid"; */

//Modal
import MyModal from '../../general_components/form_components/modal/modal';


const CuerpoModal = styled.div`
    padding-bottom: 10px;
    padding-top: 20px;    
    padding-left: 10px;
    padding-right: 10px;
    margin-left: 1%;
    margin-right: 20px;
    height: 400px;
    width: 730px;
`;

class visualizarClub extends React.Component{

    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            buscar: "",
            codigo: "",
            nombre: "",
            fecha_creacion: moment(),
            fecha_vigencia: moment(),
            punto_satelite: "",
            programa: "",
            estado: "",
            options_users: [],

            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

            //Grid
            data: [],
            columnDefs: [{
                            header: "Codigo",
                            field: "DescripcionPago",
                            width: 150,
                            type: "string"
                        },
                        {
                            header: "Programa",
                            field: "Banco",
                            width: 150,
                            type: "string"
                        },
                        {
                            header: "Punto Satelite",
                            field: "Cuenta",
                            width: 150,
                            type: "string"
                        },
                        {
                            header: "Horario.",
                            field: "Cheque",
                            width: 150,
                            type: "num_entero"
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

        //Modals
        this.showModal = this.showModal.bind(this); //SWITCH OPEN/CLOSE
        this.onClose = this.onClose.bind(this);     //CLOSE

        //GRID
        this.onGridReady = this.onGridReady.bind(this);

    }

    render() {

        return <div className="container">
            <HeaderForm>
                <TituloForm>Visualizar Clubs</TituloForm>
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
            
            <MyModal open={this.state.isShowingModal}  onClose={this.onClose}>
                <HeaderModal>
                    <TituloForm>Registro Club</TituloForm>
                </HeaderModal>
                <CuerpoModal>
                    <Row>
                        <Container className='col-md-8' >
                            <div className="btn-group pull-left">
                                <Label>Codigo:</Label>
                                <InputText name='codigo' value={this.state.codigo} type="number" className='form-control input-sm' placeholder='Ej: 123' onChange={this.changeValues} />
                            </div>
                        </Container>
                        <Container className='col-md-4' >
                            <Label>Fecha:</Label>
                            <InputText name='fecha' value={this.state.fecha} type="date" className='form-control input-sm'  onChange={this.changeValues} />
                        </Container>
                    </Row>
                    <Row>
                        <Container className='col-md-4'>
                            <Label>Nombre:</Label>
                            <InputText name='nombre' value={this.state.nombre} type="text" className='form-control input-sm' placeholder='Nombre' onChange={this.changeValues} />
                         </Container>
                         <Container className='col-md-4'>
                            <Label>Estratejia:</Label>
                            <Selects name="estratejia" value={this.state.estratejia} onChange={(value) => { this.setState({ programa: value }) }} options={this.state.options_users} />
                        </Container>
                         <Container className='col-md-4'>  
                            <Label>Programa:</Label>
                            <Selects name="programa" value={this.state.programa} onChange={(value) => { this.setState({ programa: value }) }} options={this.state.options_users} />
                        </Container>
                    </Row>
                    <Row>
                        <Fieldset className='col-md-12'>
                            <Legend>Horario</Legend>
                            <Container className='col-md-6' >
                                <Label>Dias:</Label>
                                <InputText name='dias' value={this.state.dias} type="text" className='form-control input-sm' placeholder='Lunes,Martes,Miercoles' onChange={this.changeValues} />
                            </Container>
                            <Container className='col-md-3' > 
                                <Label>Desde:</Label>
                                <InputText name='desde' value={this.state.desde} type="time" className='form-control input-sm' placeholder='09:00' onChange={this.changeValues} />
                            </Container>
                            <Container className='col-md-3' > 
                                <Label>Hasta:</Label>
                                <InputText name='hasta' value={this.state.hasta} type="time" className='form-control input-sm' placeholder='11:00' onChange={this.changeValues} />
                            </Container>
                        </Fieldset>
                    </Row>
                   <Row>
                        <Fieldset className='col-md-12'>
                            <Legend>Punto Satelite</Legend>
                            <AgGridRender altura='100px' data={this.state.data} columnas={this.state.columnDefs} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                        </Fieldset>
                   </Row>
                   <Row>
                        <Container className='col-md-12' >
                            <Label>Observacion:</Label>
                            <TextArea name='observacion' placeholder='Observacion'></TextArea>
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

    ChangeDateCreacion(day) {
        //SAVE
        this.setState({ fecha_creacion: day });

        //LEERLO
        //moment.locale('es');
        //alert(moment(this.state.fecha_creacion).format('L'));
    }

    ChangeDateVigencia(event) {
        console.log(event);
        this.setState({ fecha_vigencia: event });
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
    }

}//End

export default visualizarClub;

    

    
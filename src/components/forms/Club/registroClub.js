import React from 'react';
import styled from 'styled-components'; //STYLES

import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, /*ContainerEdit,*/ Row, HeaderForm, Container, TituloForm, /*Topbar*/ } from '../../general_components/form_components/container';
import { Label, InputText, Fieldset, Legend, TextArea, Fieldset1, Legend1 } from '../../general_components/form_components/controles';

import DayPicker from '../../general_components/form_components/date-picker/date-piker';
import moment from 'moment';

//GRID
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';


const ContenedorBotonAdd = styled.div`
padding-top: 20px;
@media (max-width: 991px) {
  padding: 0px;
}
`;


export default class registroClub extends React.Component{
    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            codigo:"",
            fecha:"",
            options_estado_sel: [],
            nombre: "",
            desde:"",
            hasta:"",
            observacion:"",
            options_estrategia_sel:[],
            options_programa_sel:[],
            options_dia:[{ value: 0, label: 'Lunes' },
                        { value: 1, label: 'Martes' },
                        { value: 2, label: 'Miercoles' },
                        { value: 3, label: 'Jueves' },
                        { value: 4, label: 'Viernes' },
                        { value: 5, label: 'Sabado' },
                        { value: 6, label: 'Domingo' }],
            


            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

              //Grid
            grid_Satelite: [],
            grid_Asignacion:[],
            columnDefs_Satelite: [{     header: "",
                                        width: 30,
                                        checkboxSelection: true,
                                        suppressSorting: true,
                                        suppressMenu: true,
                                        suppressFilter: true,
                                        pinned: true
                                    },
                                    {   header: "Codigo",
                                        field: "Codigo",
                                        width: 150,
                                        type: "string"
                                    },
                                    {
                                        header: "Nombre",
                                        field: "Nombre",
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
            columnDefs_Asignacion: [{  header: "N°",
                            field: "Secuencia",
                            width: 50,
                            type: "string"
                        },
                        {
                            header: "Club",
                            field: "Club",
                            width: 150,
                            type: "string"
                        },
                        {
                            header: "Punto Satélite",
                            field: "Punto Satélite",
                            width: 150,
                            type: "string",
                        },
                        {
                            header: "Dia",
                            field: "Dia",
                            width: 100,
                            type: "string"
                        },
                        {
                            header: "Desde",
                            field: "Desde",
                            width: 100,
                            type: "string"
                        },
                        {
                            header: "Hasta",
                            field: "Hasta",
                            width: 100,
                            type: "string"
                        },
            ]
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

        //GRID
        this.onGridReady = this.onGridReady.bind(this);

    }

    render() {

        return <div className="container">
            <HeaderForm>
                <TituloForm>Club</TituloForm>
            </HeaderForm>
            <CuerpoForm>
                    <Row>
                        <Container className='col-md-4' >
                            
                                <Label>Codigo:</Label>
                                <InputText name='codigo' value={this.state.codigo} type="number" className='form-control input-sm' placeholder='Ej: 123' onChange={this.changeValues} />
                        </Container>
                        <Container className='col-md-4' >
                            <Label>Fecha:</Label>
                            <InputText name='fecha' value={this.state.fecha} type="date" className='form-control input-sm'  onChange={this.changeValues} />
                        </Container>
                        <Container className='col-md-4' >
                            <Label>Estado:</Label>
                            <Selects name="options_estado_sel" value={this.state.options_estado_sel} onChange={(value) => { this.setState({ options_estado_sel: value }) }} options={this.state.options_estado} />
                         </Container> 
                    </Row>
                    <Row>
                        <Container className='col-md-4'>
                            <Label>Nombre:</Label>
                            <InputText name='nombre' value={this.state.nombre} type="text" className='form-control input-sm' placeholder='Nombre' onChange={this.changeValues} />
                         </Container>
                         <Container className='col-md-4'>
                            <Label>Estrategia:</Label>
                            <Selects name="options_estrategia_sel" value={this.state.options_estrategia_sel} onChange={(value) => { this.setState({ options_estrategia_sel: value }) }} options={this.state.options_estrategia} />
                        </Container>
                         <Container className='col-md-4'>  
                            <Label>Programa:</Label>
                            <Selects name="options_programa_sel" value={this.state.options_programa_sel} onChange={(value) => { this.setState({ options_programa_sel: value }) }} options={this.state.options_programa} />
                        </Container>
                    </Row>
                    <Row>
                        <Container className='col-md-12' >
                            <Fieldset className='col-md-12'>
                                <Legend>Punto Satélite</Legend>
                                <AgGridRender altura='100px' data={this.state.grid_Satelite} columnas={this.state.columnDefs_Satelite} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                            </Fieldset>
                        </Container>
                   </Row>

                    <Row>
                        <Container className='col-md-12' >
                            <Fieldset className='col-md-12'>
                                <Legend>Horario</Legend>
                                <Container className='col-md-5' >
                                    <Label>Día:</Label>
                                    <Selects name="options_dia_sel" value={this.state.options_dia_sel} onChange={(value) => { this.setState({ options_dia_sel: value }) }} options={this.state.options_dia} />
                                </Container>
                                <Container className='col-md-3' > 
                                    <Label>Desde:</Label>
                                    <InputText name='desde' value={this.state.desde} type="time" className='form-control input-sm' placeholder='09:00' onChange={this.changeValues} />
                                </Container>
                                <Container className='col-md-3' > 
                                    <Label>Hasta:</Label>
                                    <InputText name='hasta' value={this.state.hasta} type="time" className='form-control input-sm' placeholder='11:00' onChange={this.changeValues} />
                                </Container>
                                <Container className='col-md-1' > 
                                    <ContenedorBotonAdd>
                                        <button type="button" className='btn btn-success btn-sm'><i className="fa fa-plus" onClick={this.addHorario}/*8disabled={submitting}*/></i></button>
                                    </ContenedorBotonAdd>
                                </Container>
                            </Fieldset>
                        </Container>
                    </Row>
                   
                    <Row>
                        <Container className='col-md-12' > 
                            <Fieldset className='col-md-12'>
                                    <Legend>Asignación</Legend>
                                        <AgGridRender altura='100px' data={this.state.grid_Asignacion} columnas={this.state.columnDefs_Asignacion} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                            </Fieldset>
                    </Container>
                   </Row>

                   <Row>
                        <Container className='col-md-12' >
                            <Label>Observación:</Label>
                            <TextArea name='observacion'value={this.state.observacion} placeholder='Observacion' onChange={this.changeValues}></TextArea>
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
            </CuerpoForm>

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
        //var options = 

        //this.setState({ options_dia: options })
    }

    

}//End
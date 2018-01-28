import React from 'react';
//import styled from 'styled-components'; //STYLES
//import styled from 'styled-components'; //STYLES
import ReactSelectAsync from '../../general_components/form_components/select-asyn/react-select-async';
import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, /*ContainerEdit,*/ Row, HeaderForm, Container, TituloForm, /*Topbar*/ } from '../../general_components/form_components/container';
import { Label, InputText, Fieldset, Legend, TextArea, Fieldset1, Legend1 } from '../../general_components/form_components/controles';
import { cargarCatalogos, cargarCatalogosGenericoAsync} from '../../../funciones_globales/catalogos';
import  global_axios  from '../../../funciones_globales/interaccion_api';
import DayPicker from '../../general_components/form_components/date-picker/date-piker';
import moment from 'moment';


//GRID
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';



export default class asignarClub extends React.Component{
    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            fecha_creacion: moment(),
            //SELECTS
            options_estado: [],
            options_estado_sel: null,

            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

  //Grid
            grid_Club: [],
            grid_Asignacion:[],
            colDefs_Club: [{    header: "",
                                width: 30,
                                checkboxSelection: true,
                                suppressSorting: true,
                                suppressMenu: true,
                                suppressFilter: true,
                                pinned: true
                            },
                            {   header: "N°",
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
                                header: "Dia",
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
                            }],

    columnDefs_Asignacion: [{   header: "N°",
                                field: "secuencia",
                                width: 50,
                                type: "string"
                            },
                            {
                                header: "Co Facilitador",
                                field: "beneficiario",
                                
                                width: 150,
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
                                header: "Dia",
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
         this.gridOptionsClub = {
            context: {
                componentParent: this
            },
            enableFilter: true,      
            enableColResize: true,
            enableCellChangeFlash: true,
            onCellValueChanged: (event)=>{  }                                  
       };

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

        getOptionsCoFacilitador(input, callback){
            if(input.toString().length >= 3){
                let cadena_busq = '?cadena_busq=' + input;
                cargarCatalogosGenericoAsync('/cofacilitadores', cadena_busq, callback)  
            }
        }

    render() {

        return <div className="container">
            <HeaderForm>
                <TituloForm>Asignar Club a Co-Facilitador</TituloForm>
            </HeaderForm>
            <CuerpoForm>
                <Row>
                    <Container className='col-md-6' >
                        <Label>Co-Facilitador:</Label>
                            <ReactSelectAsync name="options_cofacilitador_sel" value={this.state.options_cofacilitador_sel} func_onChange={(value) => { this.setState({ options_cofacilitador_sel: value }) }} func_loadOptions={this.getOptionsCoFacilitador.bind(this)} />
                        </Container>
                    <Container className='col-md-3' >
                        <Label>Estado:</Label>
                        <Selects name="options_estado_sel" value={this.state.options_estado_sel}  onChange={(value) => { this.setState({ options_estado_sel: value }) }} options={this.state.options_estado} />
                    </Container>
                    <Container className='col-md-3' >
                        <Label>Fecha:</Label>
                        <DayPicker disabled={true} fechaSeleccionada={this.state.fecha_creacion} func_onChange={(fechaEscogida)=>{this.setState({fecha_creacion: fechaEscogida})}} />
                    </Container>
                </Row>
                <Row>
                    <Container className='col-md-12'>
                        <AgGridRender altura='250px' data={this.state.grid_Club} columnas={this.state.colDefs_Club} gridOptions={this.gridOptionsClub} onGridReady={this.onGridReady} />
                    </Container>
                </Row>
                <Row>
                    <Container className='col-md-12' > 
                        <Fieldset1 className='col-md-12'>
                            <Legend1>Asiganción de Club</Legend1>
                                 <AgGridRender altura='100px' data={this.state.grid_Asignacion} columnas={this.state.columnDefs_Asignacion} gridOptions={this.gridOptions} onGridReady={this.onGridReady} />
                        </Fieldset1>
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

  //Realiza todas estas operaciones al renderizar el form catalogos?tabla=DIASEMANA&estado=A
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
            this.cargarGridAsignacion();
        })
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
        this.setState({grid_Club: response.data})
    })
    .catch(err => {
        console.log(err);
    });
}

}//End
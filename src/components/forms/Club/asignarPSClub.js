import React from 'react';
import styled from 'styled-components'; //STYLES

import ReactSelectAsync from '../../general_components/form_components/select-asyn/react-select-async';
import Selects from '../../general_components/form_components/selects/select';
import { CuerpoForm, /*ContainerEdit,*/ Row, HeaderForm, Container, TituloForm, /*Topbar*/ } from '../../general_components/form_components/container';
import { Label, InputText, Fieldset, Legend } from '../../general_components/form_components/controles';
import { cargarCatalogos, cargarCatalogosGenericoAsync} from '../../../funciones_globales/catalogos';
import DayPicker from '../../general_components/form_components/date-picker/date-piker';
import moment from 'moment';
import  global_axios  from '../../../funciones_globales/interaccion_api';
import AgGridRender from '../../general_components/form_components/grid/ag_grid_render';
import { getItemDatosSesion } from '../../../funciones_globales/manejosesion';
import { fomatearFechaMoment_a_String } from '../../../funciones_globales/format';


const ContenedorBotonAdd = styled.div`
    padding-top: 20px;
    @media (max-width: 991px) {
    padding: 0px;
    }
`;


export default class asignarPSClub extends React.Component{
    constructor() { //Permite pasar valores al componente
        super();
        this.state = {
            codigo:"",
            fecha_creacion: moment(),
            desde:"",
            hasta:"",
            club_sel: null,

            //SELECTS
            options_estado: [],
            options_estado_sel: null,
            options_dia:[],
            options_dia_sel: null,

            catalogo_tipo:[],

            //Por cada modal un state para controlar su estado! 
            isShowingModal: false,

              //Grid
            grid_Satelite: [],
            grid_Asignacion:[],
            columnDefs_Satelite:[ {     header: "",
                                        width: 30,
                                        checkboxSelection: true,
                                        suppressSorting: true,
                                        suppressMenu: true,
                                        suppressFilter: true,
                                        pinned: true
                                    },
                                    {   header: "Cod.",
                                        field: "Codigo",
                                        width: 50,
                                        type: "string",
                                        filter: 'agNumberColumnFilter',
                                        filterParams: { cellHeight: 20, values: ['1','2','6'], newRowsAction: 'keep'}
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
                                    },
                                    {
                                        header: "Dirección",
                                        field: "Direccion",
                                        width: 250,
                                        type: "string",
                                    }
                                ],
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
        this.gridOptionsSatelite = {
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
        this.addHorario = this.addHorario.bind(this);
        //GRID
        this.onGridReadyST = this.onGridReadyST.bind(this);
        this.guardarClub = this.guardarClub.bind(this);

    }

    //Punto Satelite
    onGridReadyST(params) {
        this.apiST = params.api;
        this.columnApiST = params.columnApi;
    }

    //Asignacion
    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
    }

    immutablePush(array, newItem){
        return [ ...array, newItem ];  
    }

    immutableDelete (arr, index) {
        var i = parseInt(index, 10);
        return arr.slice(0,i).concat(arr.slice(i+1));
    }

    //ACTION PARA ELIMINAR
    methodFromParent(id ,datos_fila){
        var mensaje = window.confirm("¿Desea eliminar la asignación?"); 
        
        if (mensaje){
            this.eliminarAsignacion(id, datos_fila ) 
        }
    }

    eliminarAsignacion(id, datos_fila ){
        //ELIMINACION LOCAL
        this.setState(
            {grid_Asignacion: this.immutableDelete(this.state.grid_Asignacion, id)}
        )
    }

    addHorario(){
        var errors = "";
        var proceder = true;
        var rows = [];
        if(this.state.options_dia_sel === null){
            proceder = false;
            errors = errors+"- Seleccione un dia antes de añadir.\n"
        }

        if(this.state.desde === ""){
            proceder = false;
            errors = errors+"- Seleccione una hora de inicio.\n"
        }

        if(this.state.hasta === ""){
            proceder = false;
            errors = errors+"- Seleccione una hora de fin.\n"
        }

        if(this.state.club_sel === null){
            proceder = false;
            errors = errors+"- Seleccione un club a asignar.\n"
        }

        rows = this.apiST.getSelectedRows();
        console.log("FILAS SELECCIONADAS: ", rows)
        if(rows.length === 0){
            proceder = false;
            errors = errors+"- Seleccione un punto satelite a asignar.\n"
        }

        console.log("proceder: ",proceder)
        if(proceder === false){
            alert(errors)
        }else{
            //codClub, cod_PS, sec, nombre_PS, dia, desde, hasta, estado, fecha_creacion

            var item = {};
            var asignacion = [];
            let index_final = this.state.grid_Asignacion.length - 1;
            let nro_item = 0;

            if(index_final===-1){
                 nro_item = 1
            }else{
                
                nro_item = parseInt(this.state.grid_Asignacion[index_final].secuencia, 10)+1;
            }
            
            item.id = this.state.club_sel.value; //CLUB
            item.club = this.state.club_sel.label;
            item.punto_satelite_N = rows[0].Nombre;
            item.punto_satelite = rows[0].Codigo;
            item.secuencia = nro_item;
            item.dia = this.state.options_dia_sel.value;
            item.dia_D = this.state.options_dia_sel.label;
            item.desde = this.state.desde;
            item.hasta = this.state.hasta;
            item.estado = this.state.options_estado_sel.value;
            item.fecha_creacion = fomatearFechaMoment_a_String(this.state.fecha_creacion)

            this.setState(
                { grid_Asignacion: this.immutablePush(this.state.grid_Asignacion, item) }
            )
        }
    }

    guardarClub(){
        if(this.state.grid_Asignacion.length > 0){
            var data = {};
            data.detalle = this.state.grid_Asignacion;
            data.id = this.state.club_sel.value;

            let config_request = {
                method: 'POST',
                url: '/asignaciones',
                data
            }
        
            global_axios(config_request)
            .then((response)=>{
                alert(response.data.msg);
                //FUNC RECARGAR GRID
                this.clear();
                this.cargarGridPuntoSatelite();
            })
            .catch(err => {
                console.log(err);
            });
        }else{
            alert("Cree una asignacion antes de guardar la transaccion")
        }
    }

    getOptions_Club(input, callback){

        if (input.toString().length >= 3 ){
            let cadena_busq = '?cadena_busq=' + input;
            cargarCatalogosGenericoAsync('/club', cadena_busq, callback)  
        }
    }

    clear(){
        this.setState({grid_Satelite: []});
        this.setState({grid_Asignacion: []});
        this.setState({desde: ""});
        this.setState({hasta: ""});
        this.setState({club_sel: null})
    }

    render() {
        var year = '2013';
var month = '04';
var day = '18';

var hour = '12';
var min = '35';

var reserv = new Date(year,month,day,hour,min)

console.log(reserv);
        return <div className="container">
            <HeaderForm>
                <TituloForm>Asignación de Punto Satélite a Club</TituloForm>
            </HeaderForm>
            <CuerpoForm>
                <Row>
                    <Container className='col-md-4' >
                            <Label>Club:</Label>
                            <ReactSelectAsync  value={this.state.club_sel} func_onChange={(value)=>{this.setState({club_sel: value})}} func_loadOptions={this.getOptions_Club.bind(this)} />
                    </Container>
                    <Container className='col-md-4' >
                        <Label>Estado:</Label>
                        <Selects name="options_estado_sel" value={this.state.options_estado_sel}  onChange={(value) => { this.setState({ progoptions_estado_selrama: value }) }} options={this.state.options_estado} />
                    </Container>
                    <Container className='col-md-4' >
                        <Label>Fecha:</Label>
                        <DayPicker disabled={true} fechaSeleccionada={this.state.fecha_creacion} func_onChange={(fechaEscogida)=>{this.setState({fecha_creacion: fechaEscogida})}} />
                    </Container>
                </Row>
                <Row>
                    <Container className='col-md-12' >
                        <Fieldset className='col-md-12'>
                            <Legend>Punto Satélite</Legend>
                            <AgGridRender altura='100px' data={this.state.grid_Satelite} columnas={this.state.columnDefs_Satelite} gridOptions={this.gridOptionsSatelite} onGridReady={this.onGridReadyST} />
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
                                    <button type="button" className='btn btn-success btn-sm' onClick={this.addHorario}><i className="fa fa-plus"></i></button>
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
            </CuerpoForm>
        </div>;
    }



    ChangeDateNacimiento(day) {
        //SAVE
        this.setState({ fecha_nacimiento: day });

        //LEERLO
        //moment.locale('es');
        //alert(moment(this.state.fecha_creacion).format('L'));
    }

    //Functions
    changeValues(event) {

        //console.log("evento: ", event)
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
            cargarCatalogos('GENESTADO'), cargarCatalogos('DIASEMANA'), cargarCatalogos('TIPOSATELI')
        ])
        .then(([result_estado, result_dia, result_tipo]) => {
            this.setState(
                { options_estado: result_estado, options_dia: result_dia, catalogo_tipo: result_tipo }, ()=>{
                //DEFAULT VALUE DESPUES DE ASIGNAR
                this.state.options_estado.forEach((OP)=>{
                    if(OP.value === 'A'){
                        this.setState({options_estado_sel: OP});
                    }
                })
                this.cargarGridPuntoSatelite();
            })
        })
        .catch(err => {
          console.log(err);
        });
    }

    cargarGridPuntoSatelite(){
        //Proceso Adquirir Registros GRID
        let config_request = {
            method: 'GET',
            url: '/puntosatelite?estado=A'
        }
       
        global_axios(config_request)
        .then((response)=>{
            console.log("DATA respondida en request paramentros: ",response.data)
            var array, tipoPuntoSatelite = [];
            array = response.data;
            tipoPuntoSatelite = this.state.catalogo_tipo;

            array.forEach((DATA)=>{
                tipoPuntoSatelite.forEach((PAR)=>{
                    if(DATA.Tipo === PAR.value){
                        DATA.Tipo = PAR.label
                        DATA.Tipo_num = PAR.value
                    }
                })
            })

            this.setState({grid_Satelite: array})
        })
        .catch(err => {
            console.log(err);
        });

    }

}//End
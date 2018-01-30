import React from 'react';
import styled from 'styled-components';
import global_axios from '../funciones_globales/interaccion_api';
import Selects from '../components/general_components/form_components/selects/select';
import { setDatosSesion, borrarDatosSesion } from '../funciones_globales/manejosesion';
//import { Topbar } from '../components/general_components/form_components/container';
import background from './login.jpg';


const Body = styled.div`
    font-family: 'Roboto', sans-serif;
    background-image: url(${background}) ;
    background-size: cover;
    background-repeat: no-repeat 50% 100%;
    max-height: 100%;
    overflow: hidden
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    width: 100%;
`;

const LoginWrapper = styled.div`

    float: right;
    margin-top: 12.5%;
    margin-bottom: 11.5%;
    margin-right: 3%;
    position: relative;
    max-width: 100%;
`;

const Login1 = styled.div`
    border-radius: 6px;
    background-color: rgba(0,0, 0, 0.55)
`;

const Login2 = styled.div`
    border-radius: 6px;
    background-color: rgba(144, 31, 97, 0.55)
`;

const H3 = styled.h3`
    margin-bottom: 30px;
    color:white;
    text-align:center;
`;

const Input = styled.input`
    height: 33px;
    padding: 5px 10px;
    font-size: 15px;
    line-height: 1.5;
    border-radius: 5px;
    display: block;
    width: 100%;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
`;

const A1 = styled.a`
    text-decoration: none;
    font-size: 12px;
    float: left;
    margin-top: -5px;
    padding-bottom: 5px;
    color: #c5c5c5;
`;

const A2 = styled.a`
    text-decoration: none;
    font-size: 12px;
    float: right;
    margin-top: -5px;
    padding-bottom: 5px;
    color: #c5c5c5;
`;

const Footer = styled.div`
  border-radius: 6px;
  background-color: rgba(144, 31, 97, 0.85);
  text-decoration: none;
  border-color: rgba(0,0,0,0.55);
  cursor: pointer;

`;
const Label = styled.label` //LABEL STYLE
      display: inline-block;  
      font-size: 15px;
      color: white;
    `;

const A3 = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  margin-left: 33%;
`;

const Button = styled.button`
    border-radius: 6px;
    color: #fff;
    width: 100%;
    font-size:18px;
    border-color: #17c092;
    background-color: #28d1a3;
    height: 33px;
    text-decoration: none;

`;

export default class Login extends React.Component{  
    constructor(props){
        super(props);
        this.state = {
            usuario: '',
            contrasena: '',
            options_localidad:[{ value: 'OC', label: 'Oficina central' },
                        { value: 'OCC0', label: 'Centro Comunitario 0 - Durán' },
                        { value: 'OCC2', label: 'Centro Comunitario 2 - Phelan' },
                        { value: 'OCC3', label: 'Centro Comunitario 3 - BUDS' },
                        { value: 'OCC5', label: 'Centro Comunitario 5 - Flor de Bastión' },
                        { value: 'OCC6', label: 'Centro Comunitario 6 - Estrella de Belén' },
                        { value: 'HEE', label: 'Centro Hacia El Empleo' }],
            options_localidad_sel:undefined
            
        }
        //Funciones binds
        this.changeValues = this.changeValues.bind(this);
        this.login = this.login.bind(this);
    }

    changeValues(event) {

        console.log("evento: ", event)
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    login(e){
        e.preventDefault()
        var data = {};

        data.username = this.state.usuario;
        data.clave = this.state.contrasena;

        console.log("Sesion:",data)

        let config_request = {
            method: 'POST',
            url: '/login',
            data
        }

        global_axios(config_request)
        .then((response)=> {
            console.log(response.data)

            const sesion_data = response.data;           
            //this.setState({msg_error: '', visible_perfiles: true, perfiles: sesion_data.perfiles, perfil_actual: sesion_data.perfiles[0].PerfilId});
            const tiempoSesion = parseInt(sesion_data.tiempoSesion, 10) * 1000;

            setDatosSesion('usuario', sesion_data.usuario);            
            setDatosSesion('token', sesion_data.token);
            setDatosSesion('cargo', sesion_data.cargo);
            setDatosSesion('tiempoSesion', tiempoSesion); 
            setDatosSesion('localidad', this.state.options_localidad_sel.value); 
 
            //let token = getItemDatosSesion('token');
            //global_axios.defaults.headers.common['x-access-token'] = token;
            
            setTimeout(()=>{
                alert('Su sesión caducará en 1 minuto, asegurese de guardar sus cambios.');
            }, tiempoSesion - 60000);
    
            
            setTimeout(()=>{
                borrarDatosSesion();
                this.props.history.push('/');
            }, tiempoSesion);
            
            this.props.history.push("/");
            window.location.reload(true);
            
        })
        .catch(
            (error)=>{                
            alert(error.response?error.response.data.msg:error.message);      
        });
    }

    render(){
        return(   
            <Body className="page-dashboard">
                <div className="container">
                    <LoginWrapper>
                        <Login1 className="panel">
                            <Login2 className="panel-body">
                               
                               <form>
                                    <H3>Autenticación - TheCircle</H3>
                                    <div className="form-group">
                                        <div className="browser-default">
                                            <Input name="usuario" type="text" title="Ingrese un numero de cedula valido" required class="form-control rounded" placeholder="Digite su número de cédula" onChange={this.changeValues} autocomplete={false}/>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="browser-default">
                                            <Input name="contrasena" type="password" required class="form-control rounded" placeholder="Digite su contraseña" onChange={this.changeValues} autocomplete={false}/>
                                        </div>
                                    </div>


                                    <div className="form-group">
                                        <Label>Centro Comunitario:</Label>
                                        <Selects name="options_localidad_sel" value={this.state.options_localidad_sel} onChange={(value) => { this.setState({ options_localidad_sel: value }) }} options={this.state.options_localidad} />
                                    </div>

                                </form>
                            </Login2>
                            <Footer className="panel-footer">
                                    <Button  data-ripple type="submit" onClick={this.login}>
                                        Acceder                                       
                                    </Button>
                            </Footer>
                        </Login1>          
                    </LoginWrapper>  
                </div>     
            </Body>       
        );
    }
} 


import React from 'react';
import './TopBar.css';
import { borrarDatosSesion, getItemDatosSesion } from '../../../../funciones_globales/manejosesion';
import { Link } from 'react-router-dom';

class TopBar extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            controlSesion:true
        };

        this.cerrarSesion = this.cerrarSesion.bind(this);
    }

    cerrarSesion(){
        let salir = window.confirm('¿Está seguro de cerrar sesión?');
        if (salir){
            borrarDatosSesion();
            this.setState({controlSesion: false});
        }
    }

    

    render() {
        return      <div className="navbar navbar-default nav-menu">
                        
                        
                            {/*--------------------------cerrar sesion --------------------------*/}
                            <ul className="nav navbar-nav navbar-right">
                                    <li className="dropdown">
                                        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                            <span className="fa fa-user-circle-o"></span> 
                                            <strong>Bienvenido </strong>
                                            <span className="fa fa-chevron-down"> </span>
                                        </a>
                                        
                                        <ul className="dropdown-menu">
                                            <li>
                                                <div className="navbar-login">
                                                    <div className="row">
                                                        <div className="col-lg-4">
                                                            <p className="text-center">
                                                                <span className="fa fa-user icon-size"></span>
                                                            </p>
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <p className="text-left"><strong>{getItemDatosSesion('usuario').toString().toUpperCase()}</strong></p>
                                                            <p className="text-left"><strong>{getItemDatosSesion('cargo').toString().toUpperCase()}</strong></p>
                                                            <p className="text-left">
                                                                <button type="button" className='btn btn-primary btn-sm' onClick={this.cerrarSesion}>
                                                                    <Link to={this.state.controlSesion===false?'/login':'/'}>
                                                                        <p className="label">Cerrar Sesión</p>
                                                                     </Link>
                                                                </button>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>

                                    </li>
                                </ul>
            </div>
    }
   
}
export default TopBar;


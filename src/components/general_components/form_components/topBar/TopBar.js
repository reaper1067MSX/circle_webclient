import React from 'react';
import './TopBar.css';
import { Link } from 'react-router-dom';

class TopBar extends React.Component{
    render() {
        return      <div className="navbar navbar-default nav-menu">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">The Circle</a>
                        </div>
                        
                            {/*--------------------------cerrar sesion --------------------------*/}
                            <ul className="nav navbar-nav navbar-right">
                                    <li className="dropdown">
                                        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                            <span className="glyphicon glyphicon-user"></span> 
                                            <strong>Bienvenido </strong>
                                            <span className="glyphicon glyphicon-chevron-down"> </span>
                                        </a>
                                        
                                        <ul className="dropdown-menu">
                                            <li>
                                                <div className="navbar-login">
                                                    <div className="row">
                                                        <div className="col-lg-4">
                                                            <p className="text-center">
                                                                <span className="glyphicon glyphicon-user icon-size"></span>
                                                            </p>
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <p className="text-left"><strong>Mahesh</strong></p>
                                                            <p className="text-left">
                                                                <a href="#" className="btn btn-primary btn-block btn-sm">Cerrar Sesión</a>
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
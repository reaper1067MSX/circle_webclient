import React from 'react';
import './menu.css';
import { Link } from 'react-router-dom';

class NavBar extends React.Component{
    render() {
        return  <div className="nav-side-menu">
                   <div className="brand">The Circle</div>
                      <i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"></i>
                        <div className="menu-list">
                            <ul id="menu-content" className="menu-content collapse out">
                                {/*-----------Opcion  Home*---------*/}
                                <li>
                                    <Link to={'/home'}><i className='fa fa-home'></i>Home </Link>                                      
                                </li>
                                {/*--------------Opcion  Beneficiario*----------*/}
                                <li data-toggle="collapse" data-target="#new" className="collapsed">
                                    <div className="espace">
                                        <i className='fa fa-user-circle-o'></i>{' '}
                                        Beneficiario
                                        {/* <span className='glyphicon glyphicon-chevron-down'></span> */}
                                        <span className="arrow"></span>    
                                    </div>
                                </li>
                                <ul className="sub-menu collapse" id="new">                                    
                                    <li>
                                         <Link to={'/visualizarBeneficiario'}>
                                            <span className="glyphicon glyphicon-chevron-right"></span> Visualizar
                                         </Link>
                                    </li> 
                                    <li>
                                         <Link to={'/inscribirBeneficiario'}>
                                            <span className="glyphicon glyphicon-chevron-right"></span> Inscribir 
                                         </Link>
                                    </li>      
                                </ul>
                                {/*--------------Opcion  Co-Facilitador*----------*/}
                                <li data-toggle="collapse" data-target="#new1" className="collapsed">
                                    <div className="espace">
                                         <i className='fa fa-handshake-o' ></i>{' '}
                                         Co-Facilitador
                                         <span className="arrow"></span>  
                                    </div>
                                </li>
                                <ul className="sub-menu collapse" id="new1">
                                    <li>
                                        <Link to={'/visualizarCoFacilitador'}> 
                                            <span className="glyphicon glyphicon-chevron-right"></span> Visualizar
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/asignarclub'}>
                                            <span className="glyphicon glyphicon-chevron-right"></span> Asignar Club a Co-Facilitador
                                    </Link>
                                    </li>
                                </ul>
                                {/*--------------Opcion  Club*----------*/}
                                <li data-toggle="collapse" data-target="#new2" className="collapsed">
                                    <div className="espace">
                                        <i className='fa fa-futbol-o'></i>{' '}
                                        Club
                                        <span className="arrow"></span>  
                                    </div>
                                </li>
                                <ul className="sub-menu collapse" id="new2">
                                    <li>
                                        <Link to={'/visualizarClub'}> 
                                            <span className="glyphicon glyphicon-chevron-right"></span> Visualizar
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/registroClub'}> 
                                            <span className="glyphicon glyphicon-chevron-right"></span> Registrar
                                        </Link>
                                    </li>
                                    <li>
                                        <span className="glyphicon glyphicon-chevron-right"></span> Asignar Co-Facilitadores a Club
                                    </li>
                                </ul>
                                {/*--------------Opcion  Punto Satelite*----------*/}
                                <li data-toggle="collapse" data-target="#new3" className="collapsed">
                                    <div className="espace">
                                        <i className='fa fa-podcast'></i>{' '}Punto Satelite
                                        <span className="arrow"></span>  
                                    </div>
                                </li>
                                <ul className="sub-menu collapse" id="new3">
                                    <li>
                                        <Link to={'/visualizarPuntoSatelite'} >
                                            <span className="glyphicon glyphicon-chevron-right"></span> Visualizar
                                        </Link>
                                    </li>
                                </ul>
                                {/*--------------Opcion  Parametros*----------*/}
                                <li data-toggle="collapse" data-target="#new4" className="collapsed">
                                    <div className="espace">
                                        <i className='fa fa-book'></i>{' '}Parametros
                                        <span className="arrow"></span>  
                                    </div>
                                </li>
                                <ul className="sub-menu collapse" id="new4">
                                    <li>
                                        <Link to={'/visualizarParametros'}> 
                                            <span className="glyphicon glyphicon-chevron-right"></span> Visualizar
                                        </Link>
                                    </li>
                                </ul>
                           </ul>       
                      </div>
                </div>;
    }
}

export default NavBar;
import React, { Component } from 'react';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';

//Formularios
//import Home from './forms/Home/Home'; <Route exact path='/' component={Home} />

import visualizarClub from './forms/Club/visualizarClub';
import asignarPSClub from './forms/Club/asignarPSClub';
import visualizarPuntoSatelite from './forms/Punto_Satelite/visualizarPuntoSatelite';
import visualizarCoFacilitador from './forms/CoFacilitador/visualizarCoFacilitador';
import asignarClub from './forms/CoFacilitador/asignarClub';
import visualizarBeneficiario from './forms/Beneficiario/visualizarBeneficiario';
import inscribirBeneficiario from './forms/Beneficiario/inscribirBeneficiario';
import visualizarParametros from './forms/Parametros/visualizarParametros';
import login from '../components/login';
import RegistroFaltas from './forms/Faltas/RegistroFaltas';
import VisualizarFaltas from './forms/Faltas/VisualizarFaltas';

import NavBar from './general_components/form_components/menu/NavBar';
//import Menu from './menu';
import TopBar from './general_components/form_components/topBar/TopBar';
import { Row } from './general_components/form_components/container/index';

const ContenedorApp = styled.div`
  max-width: 100%;    
  font-family: Verdana, Geneva, sans-serif;
  margin-rigth:0%;
`;

const ContenedorCuerpoApp = styled.div`        
  margin-top: 30px;
  margin-left: 22%;
  margin-rigth:0%;
  position: absolute;
  width: 75%;
  z-index:1;
    
`;  

class App extends Component {
  render() {
    return (
     

      <ContenedorApp >
        <Row>
          <TopBar/>
        </Row>
        <Row>
          <NavBar/>
          <ContenedorCuerpoApp>                                
              <Switch>

                
                <Route path='/login' component={login} />
                <Route path='/visualizarclub' component={visualizarClub} />
                <Route path='/asignarpsclub' component={asignarPSClub} />
                <Route path='/visualizarpuntosatelite' component={visualizarPuntoSatelite} />   
                <Route path='/visualizarcofacilitador' component={visualizarCoFacilitador} />  
                <Route path='/asignarclub' component={asignarClub} />            
                <Route path='/visualizarbeneficiario' component={visualizarBeneficiario} />  
                <Route path='/inscribirbeneficiario' component={inscribirBeneficiario} />            
                <Route path='/visualizarparametros' component={visualizarParametros} />               
                <Route path='/registrofaltas' component={RegistroFaltas} /> 
                <Route path='/visualizarfaltas' component={VisualizarFaltas} /> 
                visualizarfaltas
                                                
              </Switch>    
          </ContenedorCuerpoApp>
        </Row>
      </ContenedorApp>
      
    );
  }
  
}

export default App;

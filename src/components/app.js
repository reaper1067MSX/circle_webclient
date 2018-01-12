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

import NavBar from './general_components/form_components/menu/NavBar';
//import Menu from './menu';

const ContenedorApp = styled.div`
  max-width: 100%;    
  font-family: Verdana, Geneva, sans-serif;
`;

const ContenedorCuerpoApp = styled.div`        
  margin-top: 40px;
  margin-left: 25%;
    
`;  

class App extends Component {
  render() {
    return (
      <ContenedorApp>
        <NavBar/>
        <ContenedorCuerpoApp>                                
            <Switch>
              
              <Route path='/visualizarclub' component={visualizarClub} />
              <Route path='/asignarpsclub' component={asignarPSClub} />
              <Route path='/visualizarpuntosatelite' component={visualizarPuntoSatelite} />   
              <Route path='/visualizarcofacilitador' component={visualizarCoFacilitador} />  
              <Route path='/asignarclub' component={asignarClub} />            
              <Route path='/visualizarbeneficiario' component={visualizarBeneficiario} />  
              <Route path='/inscribirbeneficiario' component={inscribirBeneficiario} />            
              <Route path='/visualizarparametros' component={visualizarParametros} />               
              
                                              
            </Switch>    
        </ContenedorCuerpoApp>
      </ContenedorApp>
    );
  }
}

export default App;

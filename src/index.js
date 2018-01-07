import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import App from './components/app';
import Login from './components/login';

 const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (        
        sessionStorage.getItem("usuario") ? (
        <Component {...props}/>
        ) : (
        <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
        }}/>
        )
    )}/>
) 

ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route exact path="/login" name="Inicio de Sesion" component={Login}/>                        
            <PrivateRoute path="/" component={App}/>
        </Switch>
    </BrowserRouter>
), document.getElementById('root'));


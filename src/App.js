import React,{Component} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom'

import Navigation from './components/navigationComp';
import Formulario from './components/formularioComp';
import Inicio from './components/inicioComp';
import Ventas from './components/ventasComp';
import VentaPrenda from './components/ventaPrendasComp';
import VenderPrendas from './components/venderPrendasComp';
import AgregarMonto from './components/agregarMontoComp';


class App extends Component{
  render(){
    return(
      <Router>
        <Navigation titulo="MIMADOS"/>
        
        <Route exact path="/" component={Inicio}/>
        <Route exact path="/clientes" component={Formulario}/>
        <Route exact path="/ventas" component={Ventas}/>
        <Route exact path="/ventaPrendas/:id" component={VentaPrenda}/>
        <Route exact path="/venderPrendas/:id" component={VenderPrendas}/>
        <Route exact path="/agregarMonto/:id" component={AgregarMonto}/>
      </Router>
    );
  }
};


export default App;

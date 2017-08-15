import React, { Component } from 'react';
import {
  View
} from 'react-native';

import { Stack } from './Router';
import KiareApp from './KiareApp';

class AppIndex extends Component{
  constructor(){
    super();
    this.state = {
      estadoSeleccionado: null,
      datosComer: null,
      datosDiversion: null,
      datosPistear: null,
      datosEventos: null,
      hide: false,
    }
  }

  _retornoDeDatos(datos){
    console.log('funcion llamada');
    setTimeout(()=> {
      // here goes the datos selection by Comer, Diversion, Pistear & Eventos
      this.setState({
        estadoSeleccionado: 'leon',
        datosComer: datos,
        datosDiversion: datos,
        datosPistear: datos,
        datosEventos: datos,
        hide: true,
      });
    }, 1000)
  }

  render(){
    if (this.state.hide && (this.state.datos !== null && this.state.datosComer !== null && this.state.datosDiversion !== null && this.state.datosPistear !== null && this.state.datosEventos !== null)){
      return(
        <Stack screenProps={{estadoSeleccionado: this.state.estadoSeleccionado, dataComer: this.state.datosComer, dataPistear: this.state.datosPistear, dataDiversion: this.state.datosDiversion, dataEventos: this.state.datosEventos}}/>
      );
    } else {
      return(
        <KiareApp retornoDeDatos={this._retornoDeDatos.bind(this)}/>
      );
    }
  }
}

export default AppIndex;

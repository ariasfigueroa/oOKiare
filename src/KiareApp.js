import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  StatusBar,
  AppRegistry,
  TouchableOpacity
} from 'react-native';

import Firebase from '../lib/Firebase';
import { TabNavigator, StackNavigator, TabBarBottom } from 'react-navigation';
import SubcategoriaComer from './SubcategoriaComer';
import SubcategoriaDiversion from './SubcategoriaDiversion';
import SubcategoriaEventos from './SubcategoriaEventos';
import SubcategoriaPistear from './SubcategoriaPistear';
import SubcategoriaEspecial from './SubcategoriaEspecial';
import NegociosPorCategoria from './NegociosPorCategoria';
import NegociosDetalle from './NegociosDetalle';
import WebBrowser from './WebBrowser';
import Icon from 'react-native-vector-icons/FontAwesome';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { NavigationActions } from 'react-navigation'

class KiareApp extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {
      hideIndicator: false,
      dataComer: null,
      dataDiversion: null,
      dataEventos: null,
      dataPistear: null,
      latitude: null,
      longitude: null,
      error: null,
      estadoSeleccionado: null,
      estadoNombre: null,
    }
    console.log = ()=>{};
    console.info = ()=>{};
    console.error = ()=>{};
    console.warn = ()=>{};
    console.debug = ()=>{};
  }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
        Firebase.obtenerArbol('/estados', this._obtenerEstados.bind(this));
      },
      (error) => {
        console.log("No Geolocalization");
        this.setState({ error: error.message, hideIndicator: true });
      },

    );
  }

  _obtenerEstados(snapshot){
    if (snapshot) {
      currentDistance = 0;
      closeEstado = null;
      closeEstadoNombre = null;
      var index = 0;
      snapshot.forEach((snapshotChild)=>{
        index++;

        let key = snapshotChild.key;
        let latitude= snapshotChild.child('latitud').val();
        let longitude= snapshotChild.child('longitud').val();

        let pointDelta = {
          latitude,
          longitude
        };

        let distanciaFunc = this._getDistance.bind(this);
        let distancia = distanciaFunc(pointDelta);
        if (currentDistance > 0){
            if (distancia < currentDistance){
              currentDistance = distancia;
              closeEstado = key;
              closeEstadoNombre = snapshotChild.child('nombre').val();
            }
        } else {
          currentDistance = distancia;
          closeEstado = key;
          closeEstadoNombre = snapshotChild.child('nombre').val();
        }

        if (closeEstado && (index === snapshot.numChildren())){
          this.setState({estadoSeleccionado: closeEstado, estadoNombre: closeEstadoNombre})
          Firebase.subcategoriasPorEstado(closeEstado, '/negocios', this._obtenerDatosDeSnapshot.bind(this));
        } else {
          console.log('No se obtubo ciudad...');
        }
      });
     } else {
      console.log('snapshot es nulo');
    }

  }

  _getDistance(pointDelta){
      let R = 6371; // Radius of the earth in km
      let dLatLongFunc = this._deg2rad.bind(this);  // deg2rad below
      let dLat = dLatLongFunc(pointDelta.latitude-this.state.latitude);
      let dLon = dLatLongFunc(pointDelta.longitude-this.state.longitude);
      let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(dLatLongFunc(this.state.latitude)) * Math.cos(dLatLongFunc(pointDelta.latitude)) * Math.sin(dLon/2) * Math.sin(dLon/2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      let d = R * c; // Distance in km
      return d;
  }

  _deg2rad(deg) {
  return deg * (Math.PI/180)
  }

  _obtenerDatosDeSnapshot(snapshot){
    if (snapshot){
      var dataComer = new Map();
      var dataDiversion = new Map();
      var dataEventos = new Map();
      var dataPistear = new Map();
      var numCall = 0;
      var indexCall = 0;
      var parentIndex = 0;
      snapshot.forEach((snapshotChild)=>{
        parentIndex += 1;
        let subcategoriasSnapshot = snapshotChild.child('subcategorias');
        numCall += subcategoriasSnapshot.numChildren();
        subcategoriasSnapshot.forEach((snapshotSubcategoriaDesdeNegocio)=>{
          Firebase.obtenerArbol('/subcategorias/'+snapshotSubcategoriaDesdeNegocio.key, (snapshotSubcategoria) =>{
              indexCall += 1;
              let subcategoria = {
                nombre: snapshotSubcategoria.child('nombre').val(),
                imagenUrl: snapshotSubcategoria.child('imagenUrl').val(),
                categorias: snapshotSubcategoria.child('categorias').val(),
                negocios: snapshotSubcategoria.child('negocios').val(),
                key: snapshotSubcategoria.key,
                imagenBannerUrl: snapshotSubcategoria.child('imagenBannerUrl').val(),
              }
              if (snapshotSubcategoria.child('categorias/comer').exists()){
                if (!dataComer.has(snapshotSubcategoria.key)){
                  dataComer.set(snapshotSubcategoria.key, subcategoria);
                }
              }
              if (snapshotSubcategoria.child('categorias/diversion').exists()){
                if (!dataDiversion.has(snapshotSubcategoria.key)){
                  dataDiversion.set(snapshotSubcategoria.key, subcategoria);
                }
              }
              if (snapshotSubcategoria.child('categorias/eventos').exists()){
                if (!dataEventos.has(snapshotSubcategoria.key)){
                  dataEventos.set(snapshotSubcategoria.key, subcategoria);
                }
              }
              if (snapshotSubcategoria.child('categorias/pistear').exists()){
                if (!dataPistear.has(snapshotSubcategoria.key)){
                  dataPistear.set(snapshotSubcategoria.key, subcategoria);
                }
              }

              if (numCall === indexCall && (parentIndex === snapshot.numChildren())){
                this._retornoDatos(dataComer, dataDiversion, dataEventos, dataPistear);
              }
          });
        });
      });
    }else {
      console.log('snapshot es nulo');
    }
  }

  _retornoDatos(dataComer, dataDiversion, dataEventos, dataPistear){
      const { navigate } = this.props.navigation;
      navigate('Menu', {dataComer, dataDiversion, dataEventos, dataPistear, estadoSeleccionado: this.state.estadoSeleccionado, estadoNombre: this.state.estadoNombre, mostrarCambioEstadoManual: this._mostrarCambioEstadoManual.bind(this), latitude: this.state.latitude, longitude: this.state.longitude});
      this.setState({hideIndicator: true, dataComer, dataDiversion, dataEventos, dataPistear});
      console.log(this.state);
  }

  _mostrarCambioEstadoManual(){
    this.setState({estadoNombre: null, estadoSeleccionado: null, dataComer: null, dataDiversion: null, dataEventos: null, dataPistear: null});
  }


  render() {
    if (this.state.hideIndicator === false ){
      return (
        <View style={styles.container}>
          <StatusBar
             barStyle="light-content"
          />
          <Image source={require('../resources/images/fondo_nuevo.png')}/>
          <View style={styles.containerLogoAndSpinner}>
            <Image style={styles.logoCenter} source={require('../resources/images/img_central_nueva.png')}/>
            <View style={styles.centeredComponents}>
              <ActivityIndicator
                animating={!this.state.hideIndicator}
                style={{height: 80}}
                size="large"
              />
              <Text style={styles.spinnerText}>ESTAMOS BUSCANDO ALGO</Text>
              <Text style={styles.spinnerTextBigger}>PARA TI</Text>

            </View>
          </View>
        </View>
      );
    } else if (this.state.dataComer && this.state.dataDiversion && this.state.dataEventos && this.state.dataPistear){
      return (
        <View style={styles.container}>
          <StatusBar
             barStyle="light-content"
          />
          <Image source={require('../resources/images/fondo_nuevo.png')}/>
          <View style={styles.containerLogoAndSpinner}>
            <Image style={styles.logoCenter} source={require('../resources/images/img_central_nueva.png')}/>
            <View style={styles.centeredComponents}>
              <ActivityIndicator
                animating={!this.state.hideIndicator}
                style={{height: 80}}
                size="large"
              />
              <Text style={styles.spinnerText}>ESTAMOS BUSCANDO ALGO</Text>
              <Text style={styles.spinnerTextBigger}>PARA TI</Text>

            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar
             barStyle="light-content"
          />
          <Image source={require('../resources/images/fondo_nuevo.png')}/>
          <View style={styles.centeredComponentsListState}>
            <View style={styles.centeredComponents}>
              <Text style={styles.textHeaderSelectedStateStyle}>
                ENCONTRAMOS PARA TI
              </Text>
              <TouchableOpacity
                onPress={()=>{
                  this.setState({estadoSeleccionado: 'juarez', hideIndicator: false, estadoNombre: 'Ciudad Juárez'})
                  Firebase.subcategoriasPorEstado('juarez', '/negocios', this._obtenerDatosDeSnapshot.bind(this));
                }}
              >
                <View>
                  <Text style={styles.textCiudadSelectedStateStyle}>
                    Ciudad Juárez
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={()=>{
                  this.setState({estadoSeleccionado: 'leon', hideIndicator: false, estadoNombre: 'León'})
                  Firebase.subcategoriasPorEstado('leon', '/negocios', this._obtenerDatosDeSnapshot.bind(this));
                }}
              >
                <View>
                  <Text style={styles.textCiudadSelectedStateStyle}>
                    León
                  </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.textSmallCommentStateStyle}>
                SELECCIONA TÚ CIUDAD PARA CONTINUAR
              </Text>
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  containerLogoAndSpinner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  logoCenter: {
    width: 150,
    height: 195,
  },
  spinnerText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 10,
    fontWeight: '100',
  },
  spinnerTextBigger: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 24,
    fontWeight: '100',
  },
  centeredComponents: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredComponentsListState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 12,
    width: 260,
    height: 300,
    backgroundColor:"rgba(255,255,255,0.15)",
    paddingVertical: 10,
  },
  textHeaderSelectedStateStyle: {
    backgroundColor: 'transparent',
    color: 'rgba(207, 187, 164, 1.0)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
  },
  textSmallCommentStateStyle: {
    backgroundColor: 'transparent',
    color: 'rgba(207, 187, 164, 1.0)',
    fontSize: 12,
    fontWeight: '300',
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  textCiudadSelectedButtonStateStyle: {
    backgroundColor: 'transparent',
    color: 'rgba(207, 187, 164, 1.0)',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textCiudadSelectedStateStyle:{
    backgroundColor: 'transparent',
    color: 'rgba(207, 187, 164, 1.0)',
    fontSize: 26,
    fontWeight: '200',
    marginBottom: 10 ,
  }
});

export default KiareApp;


const Tabs = TabNavigator({
  Comer: {
    screen: SubcategoriaComer,
  },
  Diversión: {
    screen: SubcategoriaDiversion,
  },
  Pistear: {
    screen: SubcategoriaEventos,
  },
  Eventos: {
    screen: SubcategoriaPistear,
  },
  Especial: {
    screen: SubcategoriaEspecial,
  }
},
{
  tabBarComponent: TabBarBottom,
  tabBarPosition: "bottom",
  tabBarOptions: {
    style: {
      backgroundColor: 'rgba(70, 34, 72, 1.0)'
    },
    labelStyle: {
      fontSize: 12,
      marginBottom: 6,
  },
    activeTintColor: 'rgba(207, 187, 164, 1.0)',
    activeBackgroundColor: '#272238',
  }
}
);

export const Stack = StackNavigator({
  Principal: {
    screen: KiareApp,
  },
  Menu: {
    screen: Tabs,
  },
  NegociosPorCategoria: {
    screen: NegociosPorCategoria,
  },
  NegociosDetalle: {
    screen: NegociosDetalle,
  },
  WebBrowser: {
    screen: WebBrowser,
  }
},
{
  navigationOptions: {
    headerStyle: {
      backgroundColor: "#272238",
    },
    headerTitleStyle: {
      backgroundColor: 'transparent',
      color: 'rgba(207, 187, 164, 1.0)',
      fontSize: 24,
      fontWeight: '100',
    },
  }
}
);

AppRegistry.registerComponent('kiare', () => Stack);

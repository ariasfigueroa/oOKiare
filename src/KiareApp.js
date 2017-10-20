import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  StatusBar,
  AppRegistry,
  TouchableOpacity,
  Alert
} from 'react-native';

import Firebase from '../lib/Firebase';
import { StackNavigator, NavigationActions } from 'react-navigation';

import NegociosDetalle from './NegociosDetalle';
import KiareAppMenu from './KiareAppMenu';
import WebBrowser from './WebBrowser';
import Subcategories from './Subcategories';
import BusinessBySubcategory from './BusinessBySubcategory';
import Radar from './Radar';
import KiareLogIn from './KiareLogIn';
import ResetPassword from './ResetPassword';
import RequestAccount from './RequestAccount';

import Icon from 'react-native-vector-icons/FontAwesome';


class KiareApp extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {
      hideIndicator: false,
      latitude: null,
      longitude: null,
      error: null,
      estadoSeleccionado: null,
      estadoNombre: null,
      dataCategories: null,
    }
    //console.log = ()=>{};
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
        Firebase.obtenerArbol('/ciudades', this._obtenerEstados.bind(this));
      },
      (error) => {
        console.log("No Geolocalization");
        this.setState({ error: error.message, hideIndicator: true });
      },

    );
  }

  _obtenerEstados(snapshot){
    if (snapshot) {
      var currentDistance = 0;
      var closeEstado = null;
      var closeEstadoNombre = null;
      var categorias = null;
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
              categorias = snapshotChild.child('categorias').val();
            }
            } else {
              currentDistance = distancia;
              closeEstado = key;
              closeEstadoNombre = snapshotChild.child('nombre').val();
              categorias = snapshotChild.child('categorias').val();
            }

        if (closeEstado && (index === snapshot.numChildren())){
          //Firebase.subcategoriasPorEstado(closeEstado, '/negocios', this._getSnapshotData.bind(this));
          var dataCategories = Firebase.jsonToArray(categorias);
          dataCategories.sort((a, b) =>{
            var ordenA = a.orden;
            var ordenB = b.orden;
            if(ordenA < ordenB){
              return -1;
            }
            if(ordenA > ordenB){
              return 1;
            }
            return 0;
          });
          const { navigate } = this.props.navigation;
          navigate('KiareAppMenu', {dataCategories , estadoSeleccionado: closeEstado, estadoNombre: closeEstadoNombre, mostrarCambioEstadoManual: this._mostrarCambioEstadoManual.bind(this), latitude: this.state.latitude, longitude: this.state.longitude});
          this.setState({hideIndicator: true, estadoSeleccionado: closeEstado, estadoNombre: closeEstadoNombre});

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


  _getSnapshotData(snapshot){
    try {
      if (snapshot){
        var dataSubcategories = [];
        var dataBusiness = Firebase.snapshotToMap(snapshot);
        var businessSubcategories = Firebase.getSubcategoriesFrom(dataBusiness);
        Firebase.obtenerArbol('/subcategorias/', (snapshotSubcategories) =>{
          snapshotSubcategories.forEach((childSnapshot)=>{
            if (businessSubcategories.has(childSnapshot.key)){
              let subcategoria = {
                nombre: childSnapshot.child('nombre').val(),
                imagenUrl: childSnapshot.child('imagenUrl').val(),
                categorias: childSnapshot.child('categorias').val(),
                negocios: childSnapshot.child('negocios').val(),
                key: childSnapshot.key,
                imagenBannerUrl: childSnapshot.child('imagenBannerUrl').val(),
              }
              dataSubcategories.push(subcategoria);
            }
          });
          this._retornoDatos(dataSubcategories, dataBusiness);
        });
      }else {
        console.log('snapshot es nulo');
      }
    }catch (error){
      console.log(error);
    }

  }

  _retornoDatos(dataSubcategories, dataBusiness){
      const { navigate } = this.props.navigation;
      navigate('Menu', {dataSubcategories, dataBusiness, estadoSeleccionado: this.state.estadoSeleccionado, estadoNombre: this.state.estadoNombre, mostrarCambioEstadoManual: this._mostrarCambioEstadoManual.bind(this), latitude: this.state.latitude, longitude: this.state.longitude});
      this.setState({hideIndicator: true, dataSubcategories, dataBusiness});
  }

  _mostrarCambioEstadoManual(){
    this.setState({hideIndicator: false, estadoNombre: null, estadoSeleccionado: null});
  }

  render() {
    if (this.state.hideIndicator === false && this.state.estadoSeleccionado === null && this.state.estadoNombre === null){
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
                  let ciudad = 'juarez';
                  let ciudadNombre = 'Ciudad Juarez';
                  let hideIndicator = false;
                  try {
                    Firebase.obtenerArbol('/ciudades/'+ciudad, (ciudad)=>{
                      if (ciudad){
                        if (ciudad.child('activo').val()){
                          const { navigate } = this.props.navigation;
                          var dataCategories = Firebase.jsonToArray(ciudad.child('categorias').val());
                          navigate('KiareAppMenu', {dataCategories , estadoSeleccionado: ciudad.key, estadoNombre: ciudadNombre, mostrarCambioEstadoManual: this._mostrarCambioEstadoManual.bind(this)});
                          this.setState({hideIndicator, estadoSeleccionado: ciudad, estadoNombre: ciudadNombre});
                        } else {
                          Alert.alert('Oops...', 'La ciudad seleccionada no se encuentra activa.',  [ {text: 'OK', onPress: () => console.log('OK Pressed')},],  { cancelable: false });
                        }
                      }else {
                        Alert.alert('Oops...', 'La ciudad seleccionada no se encuentra activa.',  [ {text: 'OK', onPress: () => console.log('OK Pressed')},],  { cancelable: false });
                      }
                    });
                        } catch(error){
                    console.log(error);
                  }
                }}
              >
                <View>
                  <Text style={styles.textCiudadSelectedStateStyle}>
                    CIUDAD JUÁREZ
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={()=>{
                  let ciudad = 'chihuahua';
                  let ciudadNombre = 'Chihuahua';
                  let hideIndicator = false;
                  try {
                    Firebase.obtenerArbol('/ciudades/'+ciudad, (ciudad)=>{
                      if (ciudad){
                        if (ciudad.child('activo').val()){
                          const { navigate } = this.props.navigation;
                          var dataCategories = Firebase.jsonToArray(ciudad.child('categorias').val());
                          navigate('KiareAppMenu', {dataCategories , estadoSeleccionado: ciudad.key, estadoNombre: ciudadNombre, mostrarCambioEstadoManual: this._mostrarCambioEstadoManual.bind(this)});
                          this.setState({hideIndicator, estadoSeleccionado: ciudad, estadoNombre: ciudadNombre});
                        } else {
                          Alert.alert('Oops...', 'La ciudad seleccionada no se encuentra activa.',  [ {text: 'OK', onPress: () => console.log('OK Pressed')},],  { cancelable: false });
                        }
                      }else {
                        Alert.alert('Oops...', 'La ciudad seleccionada no se encuentra activa.',  [ {text: 'OK', onPress: () => console.log('OK Pressed')},],  { cancelable: false });
                      }
                    });
                  } catch(error){
                    console.log(error);
                  }
                }
              }
              >
              </TouchableOpacity>

              <TouchableOpacity
                onPress={()=>{
                  let ciudad = 'leon';
                  let ciudadNombre = 'Leon';
                  let hideIndicator = false;
                  try {
                    Firebase.obtenerArbol('/ciudades/'+ciudad, (ciudad)=>{
                      if (ciudad){
                        if (ciudad.child('activo').val()){
                          const { navigate } = this.props.navigation;
                          var dataCategories = Firebase.jsonToArray(ciudad.child('categorias').val());
                          navigate('KiareAppMenu', {dataCategories , estadoSeleccionado: ciudad.key, estadoNombre: ciudadNombre, mostrarCambioEstadoManual: this._mostrarCambioEstadoManual.bind(this)});
                          this.setState({hideIndicator, estadoSeleccionado: ciudad, estadoNombre: ciudadNombre});
                        } else {
                          Alert.alert('Oops...', 'La ciudad seleccionada no se encuentra activa.',  [ {text: 'OK', onPress: () => console.log('OK Pressed')},],  { cancelable: false });
                        }
                      }else {
                        Alert.alert('Oops...', 'La ciudad seleccionada no se encuentra activa.',  [ {text: 'OK', onPress: () => console.log('OK Pressed')},],  { cancelable: false });
                      }
                    });
                  } catch(error){
                    console.log(error);
                  }
                }
              }
              >
                <View>
                  <Text style={styles.textCiudadSelectedStateStyle}>
                    LEÓN
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

export const Stack = StackNavigator({
  Principal: {
    screen: KiareApp,
  },
  KiareAppMenu: {
    screen: KiareAppMenu,
  },
  NegociosDetalle: {
    screen: NegociosDetalle,
  },
  WebBrowser: {
    screen: WebBrowser,
  },
  Subcategories: {
    screen: Subcategories,
  },
  BusinessBySubcategory: {
    screen: BusinessBySubcategory
  },
  Radar: {
    screen: Radar
  },
  KiareLogIn:{
    screen: KiareLogIn
  },
  ResetPassword:{
    screen: ResetPassword
  },
  RequestAccount:{
    screen: RequestAccount
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

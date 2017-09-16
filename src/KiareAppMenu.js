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
  ScrollView,
  Dimensions,
} from 'react-native';

import Firebase from '../lib/Firebase';
import { StackNavigator } from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CachedImage from 'react-native-cached-image';

const {width, height} = Dimensions.get('window');

class KiareAppMenu extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
    // headerTitle: navigation.state.params.estadoNombre.toUpperCase(),
    // headerLeft: (<View/>),
    // headerRight: navigation.state.params.latitude && navigation.state.params.longitude ? (
    //     <TouchableOpacity
    //       style={styles.radarStyle}
    //       onPress={()=>{
    //         navigation.navigate('Radar', {estadoSeleccionado: navigation.state.params.estadoSeleccionado, latitude: navigation.state.params.latitude, longitude: navigation.state.params.longitude});
    //       }}
    //     >
    //       <View>
    //         <MaterialCommunityIcons
    //           name="radar"
    //           size={20}
    //           color="rgba(207, 187, 164, 1.0)"
    //         />
    //       </View>
    //     </TouchableOpacity>
    // ) :
    // (<View/>),
  });

  constructor(props){
    super(props);
  }

  _mostrarCambioEstadoManual(){
    this.setState({estadoNombre: null, estadoSeleccionado: null, dataComer: null, dataDiversion: null, dataEventos: null, dataPistear: null});
  }


  render() {
    const categoriasList = this.props.navigation.state.params.dataCategories
    .map((item)=>{
      if (item.activo)
        return(
          <View style={styles.categoryOptionStyle}>
            <TouchableOpacity
              style={styles.categoryOptionTouchableStyle}
              onPress={()=>{
                this.props.navigation.navigate('Subcategories', {estadoSeleccionado: this.props.navigation.state.params.estadoSeleccionado, subcategories: item.subcategorias, categoryName: item.nombre.toUpperCase(), latitude: this.props.navigation.state.params.latitude, longitude: this.props.navigation.state.params.longitude});
              }}
              >
              <CachedImage resizeMode={'cover'} style={styles.categoryOptionImageStyle} source={{uri: item.imagenUrl}}/>
              <View style={styles.categoryOptionRowDirectionStyle}>
                <View style={styles.categoryOptionIconViewStyle}>
                  <CachedImage resizeMode={'contain'} style={styles.categoryOptionIconStyle} source={{uri: item.imagenIcon}}/>
                </View>
                <Text style={styles.categoryOptionTextStyle}>{item.nombre.toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
    });
      return (
        <View style={styles.containerBackground}>
          <StatusBar
             barStyle="light-content"
          />
          <Image source={require('../resources/images/fondo_nuevo.png')}/>
          <ScrollView style={styles.container}>
            {categoriasList}
          </ScrollView>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  containerBackground: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    top:0,
    bottom: 0,
  },
  categoryOptionStyle:{
    height: height/3,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryOptionTextStyle:{
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
  },
  categoryOptionRowDirectionStyle:{
      alignItems:'center',
      justifyContent: 'center',
      position: 'absolute',
      width,
      height: height/3,
      backgroundColor: "rgba(0,0,0,0.6)"
    },
  categoryOptionIconViewStyle:{
    alignItems:'center',
    justifyContent:'center',
  },
  categoryOptionIconStyle:{
    height: 60,
    width: 60,
    marginBottom: 10,
  },
  categoryOptionImageStyle:{
    height: height/3,
    width,
  },
  categoryOptionTouchableStyle:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radarStyle:{
    flexDirection: 'row',
    marginRight: 20,
    alignItems: 'flex-end'
  }
});

export default KiareAppMenu;

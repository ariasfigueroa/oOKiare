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
  PixelRatio,
  AsyncStorage,
  Alert,
} from 'react-native';

import Firebase from '../lib/Firebase';
import { StackNavigator } from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CachedImage from 'react-native-cached-image';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-circular-action-menu';
import Ionicons from 'react-native-vector-icons/Ionicons';


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
    this.state = {
      userUid: null,
    }

  }

  _mostrarCambioEstadoManual(){
    this.setState({estadoNombre: null, estadoSeleccionado: null, dataComer: null, dataDiversion: null, dataEventos: null, dataPistear: null, fromFavorites: null});
  }

  componentWillMount(){
    AsyncStorage.getItem('user')
    .then((result)=>{
      if (result){
        var user = JSON.parse(result);
        this.setState({userUid: user.uid});
      } else {
        console.log("userUid is null, means the user is no logged");
      }
    })
    .catch((error)=>{
      console.log(error);
    });

  }


  render() {
    var dataCategories = this.props.navigation.state.params.dataCategories;
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

    const categoriasList = dataCategories
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
          <View style={styles.headerContainer}>
            <Image resizeMode={'contain'} style={styles.headerImageContainer} source={require('../resources/images/kiare_logo_vertical.png')}/>
          </View>
          <ScrollView>
            {categoriasList}
          </ScrollView>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={()=>{
                console.log("Likes");
                if (this.state.userUid){
                 this.props.navigation.navigate('BusinessBySubcategory', {fromFavorites: true, estadoSeleccionado: this.props.navigation.state.params.estadoSeleccionado, latitude: this.props.navigation.state.params.latitude, longitude: this.props.navigation.state.params.longitude});
                } else {
                   Alert.alert('Favoritos', 'Necesitas estar loggeado para ver tus negocios favoritos.');
                }
              }}
            >
              <Ionicons name="md-heart" size={40} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={()=>{

              }}
            >
              <Ionicons name="md-home" size={40} color="#CE267A" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={()=>{
                AsyncStorage.getItem('user')
                .then((result)=>{
                  if (result){
                    var user = JSON.parse(result);
                    this.props.navigation.navigate('KiareLogOut');
                  } else {
                    this.props.navigation.navigate('KiareLogIn');
                  }
                })
                .catch((error)=>{
                  console.log(error);
                });
              }}
            >
              <Ionicons name="md-person" size={40} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  containerBackground: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#272338'
  },
  container: {
    position: 'relative',
    width,
    bottom: 50,
  },
  categoryOptionStyle:{
    height: (height - 100)/3,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#000',
    borderBottomWidth: 3 / PixelRatio.get(),
  },
  categoryOptionTextStyle:{
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  categoryOptionRowDirectionStyle:{
      alignItems:'center',
      justifyContent: 'center',
      position: 'absolute',
      width,
      height: (height-50)/3,
      backgroundColor: "rgba(0,0,0,0.4)"
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
    height: (height-50)/3,
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
  },
  actionButtonIcon: {
  fontSize: 20,
  height: 22,
  color: 'white',
},
headerContainer: {
  width,
  height: 60,
  alignItems: 'center',
  justifyContent: 'center'
},
headerImageContainer: {
  height: 30,
  marginTop: 20,
},
tabContainer:{
  width: width,
  height: 50,
  backgroundColor: "#272338",
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 30,
}

});

export default KiareAppMenu;

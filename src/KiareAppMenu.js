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
import Icon from 'react-native-vector-icons/FontAwesome';
import hoistNonReactStatic from 'hoist-non-react-statics';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CachedImage from 'react-native-cached-image';

const {width, height} = Dimensions.get('window');

class KiareAppMenu extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.estadoNombre.toUpperCase(),
    headerRight:
    (<View style={{marginRight: 20,}}>
      <TouchableOpacity
        onPress={
          ()=>{
            navigation.state.params.mostrarCambioEstadoManual();
            const backAction = NavigationActions.back();
            navigation.dispatch(backAction)
          }
        }
      >
      <View>
        <Icon
          name="exchange"
          size={25}
          color="rgba(207, 187, 164, 1.0)"
        />
      </View>

      </TouchableOpacity>
    </View>),
    headerLeft: (<View/>),
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
      return(
        <View style={styles.categoryOptionStyle}>
          <TouchableOpacity
            style={styles.categoryOptionTouchableStyle}
            onPress={()=>{
              this.props.navigation.navigate('Subcategories', {subcategories: item.subcategorias, categoryName: item.nombre.toUpperCase()});
            }}
            >
            <CachedImage resizeMode={'contain'} style={styles.categoryOptionImageStyle} source={{uri: item.imagenUrl}}/>
            <View style={styles.categoryOptionRowDirectionStyle}>
              <View style={styles.categoryOptionIconStyle}>
                <MaterialCommunityIcons
                  name="food-fork-drink"
                  size={18}
                  color="rgba(255,255,255,0.6)"
                />
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
    bottom:0,
  },
  categoryOptionStyle:{
    height: 140,
    width,
    justifyContent: 'center',
  },
  categoryOptionTextStyle:{
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 25,
    fontWeight: '100',
  },
  categoryOptionRowDirectionStyle:{
    flexDirection:'row',
    alignItems:'center',
    paddingLeft: width/6,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    width,
  },
  categoryOptionIconStyle:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'transparent',
    height: 25,
    width: 25,
    borderRadius: 5,
    borderWidth: 0.5,
    marginRight: 10,
    borderColor: 'white',
  },
  categoryOptionImageStyle:{
    height: 140,
    width,
  },
  categoryOptionTouchableStyle:{
    justifyContent: 'flex-end'
  }
});

export default KiareAppMenu;

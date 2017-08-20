import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { StackNavigator, NavigationActions } from 'react-navigation';
import CachedImage from 'react-native-cached-image';
import Firebase from '../lib/Firebase';

class SubcategoriaDiversion extends Component{

  static navigationOptions = ({ navigation}) => ({
      headerTitle: navigation.state.params.estadoNombre,
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
          <IconFontAwesome
            name="exchange"
            size={20}
            color="rgba(207, 187, 164, 1.0)"
          />
        </TouchableOpacity>
      </View>),
      headerLeft: (<View/>),
      tabBarLabel: 'Diversión',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="bullhorn"
          size={20}
          color="#CFBBA4"
        />
      ),
    });


    constructor(props){
      super(props);
      this.state = {
        data: [],
      }
    }

    componentWillMount(){
      var data = [...this.props.navigation.state.params.dataDiversion.values()];
      data.sort((a, b) =>{
        var nombreA = a.nombre.toUpperCase();
        var nombreB = b.nombre.toUpperCase();
        if(nombreA < nombreB){
          return -1;
        }
        if(nombreA > nombreB){
          return 1;
        }
        return 0;
      });
      this.setState({data});
    }

    _obtenerNegociosPorSubcategoria(negocios, subcategoriaNombre, imagenBannerUrl){
      this.setState({hideIndicator: false});
      Firebase.subcategoriasPorEstado(this.props.navigation.state.params.estadoSeleccionado, '/negocios', (snapshot)=>{
        if (snapshot){
          var data = new Map();
          for (var value in negocios){
            if (snapshot.hasChild(value)){
              var snapshotLocal = snapshot.child(value).val();
              snapshotLocal['key'] = snapshot.child(value).key;
              // calculate schedule start
              if ( Object.keys(snapshotLocal.horarios).length > 0){
                var date = new Date();
                if ((snapshotLocal.horarios[date.getDay()].abi && snapshotLocal.horarios[date.getDay()].cer) && (!(snapshotLocal.horarios[date.getDay()].abi === 0 && snapshotLocal.horarios[date.getDay()].cer === 0) && (snapshotLocal.horarios[date.getDay()].abi !== snapshotLocal.horarios[date.getDay()].cer))){
                  if (snapshotLocal.horarios[date.getDay()].abi < date.getHours() && snapshotLocal.horarios[date.getDay()].cer > date.getHours()){
                    snapshotLocal['isBusinessOpen'] = 'open';
                  } else {
                   snapshotLocal['isBusinessOpen'] = 'closed';
                  }
                } else {
                  snapshotLocal['isBusinessOpen'] = '';
                }
              } else {
                snapshotLocal['isBusinessOpen'] = '';
              }
              // calculate schedule end
              data.set(snapshotLocal.key, snapshotLocal);
            }
          }
          this.props.navigation.navigate('NegociosPorCategoria', {dataNegocios: data, subcategoriaNombre, imagenBannerUrl});
          this.setState({hideIndicator: true});
        } else {
          console.log('snapshot es nulo en _obtenerNegociosPorSubcategoria');
        }
      });
    }



  render(){
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
    } else {
      return(
        <View style={styles.container}>
          <StatusBar
             barStyle="light-content"
          />
          <Image source={require('../resources/images/fondo_nuevo.png')}/>
            <View style={styles.containerList}>
              <ScrollView>
                <FlatList
                  horizontal={false}
                  numColumns={3}
                  data={this.state.data}
                  renderItem={({item}) =>
                    <View style={{alignItems:"center", marginBottom: 10}}>
                      <View style={{backgroundColor:"rgba(255,255,255,0.3)", width: 70, height: 70, marginLeft: 20, marginRight: 20, marginBottom: 10,  borderRadius: 12, padding: 10}}>
                        <TouchableOpacity
                          style={{flex: 1, alignItems: "center", justifyContent: "center"}}
                          onPress={() => {this._obtenerNegociosPorSubcategoria(item.negocios, item.nombre, item.imagenBannerUrl)}}
                          >
                          {item.imagenUrl !== null ? <CachedImage resizeMode={'contain'} style={styles.imageStyle} source={{uri: item.imagenUrl}}/> : null }
                        </TouchableOpacity>
                      </View>
                      <View style={{width: 85}}>
                        <Text numberOfLines={2} style={{flex:1, backgroundColor: 'transparent', color: "#CFBBA4", fontSize: 12, fontWeight: '100', textAlign: 'center'}}> {item.nombre} </Text>
                      </View>
                    </View>
                  }
                />
            </ScrollView>
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
  containerList: {
    flex: 1,
    position: "absolute",
    top: 20,
    bottom: 20
  },
  imageStyle:{
    flex: 1,
    width: 60,
    height: 60,
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
});

export default SubcategoriaDiversion;

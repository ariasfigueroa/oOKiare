import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  AsyncStorage,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import { NavigationActions } from 'react-navigation';
import CachedImage from 'react-native-cached-image';
import Swiper from 'react-native-swiper';
import Firebase from '../lib/Firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-circular-action-menu';

const {width} = Dimensions.get('window');

class BusinessBySubcategory extends Component{

    static navigationOptions = ({ navigation }) => ({
      header: null,
    });

    constructor(props){
      super(props);
      this.state = {
        data: null,
        imagenBannerUrl: null,
      }
    }

    _getBusiness(snapshotSubcategory){
      try {
        if (snapshotSubcategory){
          if (snapshotSubcategory.child('activo').val()){
            let json = snapshotSubcategory.child('negocios').val();
            var data = [];
            var index = 0;
            if (json && Object.keys(json).length > 0){
              for (var item in json){
                index++;
                Firebase.obtenerArbol('/negocios/'+item,(snapshot)=>{
                  if (snapshot && snapshot.child('estado').val() === this.props.navigation.state.params.estadoSeleccionado && snapshot.child('activo').val()){
                    var item = snapshot.val();
                    item['key'] = snapshot.key;
                    if ( Object.keys(item.horarios).length > 0){
                      var date = new Date();
                      if ((item.horarios[date.getDay()].abi && item.horarios[date.getDay()].cer) && (!(item.horarios[date.getDay()].abi === 0 && item.horarios[date.getDay()].cer === 0) && (item.horarios[date.getDay()].abi !== item.horarios[date.getDay()].cer))){
                        if (item.horarios[date.getDay()].abi < date.getHours() && item.horarios[date.getDay()].cer > date.getHours()){
                          item['isBusinessOpen'] = 'open';
                        } else {
                         item['isBusinessOpen'] = 'closed';
                        }
                      } else {
                        item['isBusinessOpen'] = 'closed';
                      }
                    } else {
                      item['isBusinessOpen'] = 'closed';
                    }

                    if (this.props.navigation.state.params.latitude && this.props.navigation.state.params.longitude){
                      let pointDelta = {
                        latitude: item.latitud,
                        longitude: item.longitud,
                      };

                      let currentPoint= {
                        latitude: this.props.navigation.state.params.latitude,
                        longitude: this.props.navigation.state.params.longitude,
                      }

                      let distanciaFunc = this._getDistance.bind(this);
                      let distancia = Math.round(distanciaFunc(currentPoint, pointDelta));

                      item['distancia'] = distancia;
                    }

                    data.push(item);
                  }
                  if (index === Object.keys(json).length){
                    if (this.props.navigation.state.params.latitude && this.props.navigation.state.params.longitude){
                      data.sort((a, b) =>{
                        var distanciaA = a.distancia;
                        var distanciaB = b.distancia;
                        if(distanciaA < distanciaB){
                          return -1;
                        }
                        if(distanciaA > distanciaB){
                          return 1;
                        }
                        return 0;
                      });
                    } else {
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
                   }
                   this.setState({data, imagenBannerUrl: snapshotSubcategory.child('imagenBannerUrl').val()});
                  }
                });
              }
            } else {
              this.setState({data: [], imagenBannerUrl: snapshotSubcategory.child('imagenBannerUrl').val()});
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    _getBusinessFavorites(snapshotFavoritos){
      try {
        if (snapshotFavoritos){
            let json = snapshotFavoritos.val();
            var data = [];
            var index = 0;
            if (json && Object.keys(json).length > 0){
              for (var item in json){
                index++;
                Firebase.obtenerArbol('/negocios/'+item,(snapshot)=>{
                  if (snapshot && snapshot.child('estado').val() === this.props.navigation.state.params.estadoSeleccionado && snapshot.child('activo').val()){
                    var item = snapshot.val();
                    item['key'] = snapshot.key;
                    if ( Object.keys(item.horarios).length > 0){
                      var date = new Date();
                      if ((item.horarios[date.getDay()].abi && item.horarios[date.getDay()].cer) && (!(item.horarios[date.getDay()].abi === 0 && item.horarios[date.getDay()].cer === 0) && (item.horarios[date.getDay()].abi !== item.horarios[date.getDay()].cer))){
                        if (item.horarios[date.getDay()].abi < date.getHours() && item.horarios[date.getDay()].cer > date.getHours()){
                          item['isBusinessOpen'] = 'open';
                        } else {
                         item['isBusinessOpen'] = 'closed';
                        }
                      } else {
                        item['isBusinessOpen'] = 'closed';
                      }
                    } else {
                      item['isBusinessOpen'] = 'closed';
                    }

                    if (this.props.navigation.state.params.latitude && this.props.navigation.state.params.longitude){
                      let pointDelta = {
                        latitude: item.latitud,
                        longitude: item.longitud,
                      };

                      let currentPoint= {
                        latitude: this.props.navigation.state.params.latitude,
                        longitude: this.props.navigation.state.params.longitude,
                      }

                      let distanciaFunc = this._getDistance.bind(this);
                      let distancia = Math.round(distanciaFunc(currentPoint, pointDelta));

                      item['distancia'] = distancia;
                    }

                    data.push(item);
                  }// end snapshot
                  if (index === Object.keys(json).length){
                    if (this.props.navigation.state.params.latitude && this.props.navigation.state.params.longitude){
                      data.sort((a, b) =>{
                        var distanciaA = a.distancia;
                        var distanciaB = b.distancia;
                        if(distanciaA < distanciaB){
                          return -1;
                        }
                        if(distanciaA > distanciaB){
                          return 1;
                        }
                        return 0;
                      });
                    } else {
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
                   }//end sort
                   this.setState({data, imagenBannerUrl: snapshot.child('imagenBannerUrl').val()});
                  }
                });
              }
            } else {
              this.setState({data: [], imagenBannerUrl: snapshot.child('imagenBannerUrl').val()});
            }
        } else {
            this.setState({data: [], imagenBannerUrl: null});
        }
      } catch (error) {
        console.log(error);
      }
    }

    componentWillMount(){
      AsyncStorage.getItem('user')
      .then((result)=>{
        var user = null;
        if (result){
          user = JSON.parse(result);
          this.setState({userUid: user.uid});
        } else {
          console.log("userUid is null, means the user is no logged");
        }
        //console.log('BBS.componentWillMount()-> uid: '+user.uid+ ' favorites: '+ this.props.navigation.state.params.fromFavorites);
        if (user !== null && user.uid && this.props.navigation.state.params.fromFavorites) {
          Firebase.obtenerArbol('/users/'+user.uid+'/negocios/favoritos', this._getBusinessFavorites.bind(this));
        } else {
          Firebase.obtenerArbol('/subcategorias/'+this.props.navigation.state.params.subcategory, this._getBusiness.bind(this));
        }
      })
      .catch((error)=>{
        console.log(error);
      });

    }

    _getDistance(currentPoint, pointDelta){
        let R = 6371; // Radius of the earth in km
        let dLatLongFunc = this._deg2rad.bind(this);  // deg2rad below
        let dLat = dLatLongFunc(pointDelta.latitude-currentPoint.latitude);
        let dLon = dLatLongFunc(pointDelta.longitude-currentPoint.longitude);
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(dLatLongFunc(currentPoint.latitude)) * Math.cos(dLatLongFunc(pointDelta.latitude)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = R * c; // Distance in km
        return d;
    }

    _deg2rad(deg) {
    return deg * (Math.PI/180)
    }


  render(){
    if (this.state.data && this.state.imagenBannerUrl){
    //if (this.state.data){
      return(
        <View style={styles.container}>
          <StatusBar
             barStyle="light-content"
          />
          <Image source={require('../resources/images/fondo_nuevo.png')}/>
          <View style={styles.containerList}>
            <View style={styles.headerContainer}>
              <Image resizeMode={'contain'} style={styles.headerImageContainer} source={require('../resources/images/kiare_logo_vertical.png')}/>
            </View>
            <View style={styles.sliderStyle}>
              <Swiper
                removeClippedSubviews={false}
                autoplay={true}
                height= {160}
                width={width - 20}
                style={{backgroundColor: "transparent"}}
                >
                  {this.state.imagenBannerUrl.map((item, i) => <Slider
                    imagenUrl={item.imagenUrl}
                    key={i}
                    url={item.url}
                    navigation={this.props.navigation}
                    />
                  )
                  }
              </Swiper>
            </View>
          {this.state.data.length > 0
          ? (<FlatList
            horizontal={false}
            data={this.state.data}
            renderItem={({item}) =>
              <View style={styles.businessContainer}>
                <View style={styles.businessLogoStyle}>
                  <TouchableOpacity
                    style={{flex: 1, alignItems: "center", justifyContent: "center"}}
                    onPress={() => {
                        if (this.props.navigation.state.params.latitude && this.props.navigation.state.params.longitude){
                          this.props.navigation.navigate('NegociosDetalle', {data: item, distancia: item.distancia});
                        } else {
                          this.props.navigation.navigate('NegociosDetalle', {data: item});
                        }
                      }
                    }
                    >
                    {item.imagenUrl !== null ? <CachedImage resizeMode={'contain'} style={styles.imageStyle} source={{uri: item.imagenUrl}}/> : null }
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                      if (this.props.navigation.state.params.latitude && this.props.navigation.state.params.longitude){
                        this.props.navigation.navigate('NegociosDetalle', {data: item, distancia: item.distancia});
                      } else {
                        this.props.navigation.navigate('NegociosDetalle', {data: item});
                      }
                    }
                  }
                  >
                  <View style={styles.textContainer}>
                    <Text numberOfLines={2} style={styles.textTitle}>{item.nombre.toUpperCase()}</Text>
                    <Text numberOfLines={1} style={styles.textTitleSmall}>Distancia: {item.distancia} KM</Text>
                  </View>
                </TouchableOpacity>
                { item.isBusinessOpen === 'open' ? (<View style={styles.openBusinessStyle}><Text style={styles.smallText}>ABIERTO</Text></View>)
                 :
                 (<View style={styles.closedBusinessStyle}><Text style={styles.smallText}>CERRADO</Text></View>)
                }

              </View>
            }
          />)
          : (<View style={styles.centeredComponents}>
              <Text style={styles.spinnerText}>LO SENTIMOS, NO HAY REGISTROS PARA LA CATEGORÍA</Text>
              <Text style={styles.spinnerTextBigger}> {this.props.navigation.state.params.subcategoryName}</Text>
            </View>)
        }
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
      </View>
      );
    } else {
      return (

        <View style={styles.container}>
          <StatusBar
             barStyle="light-content"
          />
          <Image source={require('../resources/images/fondo_nuevo.png')}/>
          <View style={styles.containerList}>
            <View style={styles.headerContainer}>
              <Image resizeMode={'contain'} style={styles.headerImageContainer} source={require('../resources/images/kiare_logo_vertical.png')}/>
            </View>
            <View style={styles.centeredComponents}>
              <ActivityIndicator
                animating={!(this.state.data && this.state.imagenBannerUrl)}
                style={{height: 80}}
                size="large"
              />
             <Text style={styles.spinnerText}>LO SENTIMOS, NO EXISTEN REGISTROS.</Text>
           </View>
          </View>
        </View>
      );
    }

  }
}

const Slider = props => (
    <TouchableOpacity
    style={styles.touchableOpacitySliderStyle}
    onPress={()=>{
      props.navigation.navigate('WebBrowser', {url: props.url});
    }}
    >
      <View style={styles.sliderViewContainer}>
        <CachedImage resizeMode={'contain'} style={styles.imageSliderStyle} source={{uri: props.imagenUrl}}/>
      </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#272338",
  },
  containerRelative: {
    position: 'relative',
    width,
    bottom: 20,
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
    position: "absolute",
    top: 0,
    bottom: 0,
    alignItems: 'center',
  },
  sliderStyle: {
    backgroundColor:"transparent",
    height: 160,
    width: width - 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle:{
    flex: 1,
    width: 60,
    height: 60,
    //borderRadius: 6,
  },
  touchableOpacitySliderStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:"transparent",
  },
  imageSliderStyle: {
    flex: 1,
    width: width - 20,
    //borderRadius: 10,
  },
  sliderViewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  closedBusinessStyle: {
    position:'absolute',
    top: 10,
    left:20,
    width: 60,
    height: 15,
    borderRadius: 4,
    backgroundColor: 'red',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openBusinessStyle: {
    position:'absolute',
    top: 10,
    left:20,
    width: 60,
    height: 15,
    borderRadius: 4,
    backgroundColor: 'green',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLogoAndSpinner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  centeredComponents: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  businessContainer:{
    flexDirection: 'row',
    alignItems:"center",
    width: width - 20,
    height: 120
  },
  businessLogoStyle:{
    backgroundColor:"rgba(255,255,255,0.3)",
    width: 80,
    height: 80,
    borderRadius: 12,
  },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      height: 80,
      width: width - 100,
      paddingLeft: 10,
    },
    textTitle:{
      flexWrap: 'wrap',
      color: "white",
      fontSize: 20,
      fontWeight: '500',
      textAlign: 'left',
      backgroundColor: 'transparent',
    },
    textTitleSmall:{
      flexWrap: 'wrap',
      color: "white",
      fontSize: 14,
      fontWeight: '300',
      textAlign: 'left',
      backgroundColor: 'transparent',
      marginTop: 5,
    },
    smallText:{
      color:"white",
      fontSize: 11,
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
    justifyContent: 'center',
    backgroundColor: '#272338'
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
    bottom: 0,
  }
});

export default BusinessBySubcategory;

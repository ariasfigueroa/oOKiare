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
  ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import { NavigationActions } from 'react-navigation';
import CachedImage from 'react-native-cached-image';
import Swiper from 'react-native-swiper';
import Firebase from '../lib/Firebase';

const {width} = Dimensions.get('window');

class BusinessBySubcategory extends Component{

    static navigationOptions = ({ navigation }) => ({
      headerTitle: navigation.state.params.subcategoryName,
      headerRight: null,
      headerLeft: (<TouchableOpacity
        onPress={()=>{
                      const backAction = NavigationActions.back();
                      navigation.dispatch(backAction);
                    }
                }>
                <View style={{paddingLeft: 20}}>
                  <Icon
                    name= "back"
                    color= "#CFBBA4"
                    size={20}
                  />
                </View>
              </TouchableOpacity>),
    });

    constructor(props){
      super(props);
      this.state = {
        data: [],
        imagenBannerUrl: null,
      }
    }

    _getBusiness(snapshotSubcategory){
      try {
        if (snapshotSubcategory){
          let json = snapshotSubcategory.child('negocios').val();
          var data = [];
          var index = 0;
          for (var item in json){
            Firebase.obtenerArbol('/negocios/'+item,(snapshot)=>{
              index++;
              if (snapshot){
                var item = snapshot.val();
                item['key'] = snapshot.key;
                data.push(item);
                if (index === Object.keys(json).length){
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
                  this.setState({data, imagenBannerUrl: snapshotSubcategory.child('imagenBannerUrl').val()});
                }
              }
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    componentWillMount(){
        Firebase.obtenerArbol('/subcategorias/'+this.props.navigation.state.params.subcategory, this._getBusiness.bind(this));
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
    if (this.state.data && this.state.data.length > 0 && this.state.imagenBannerUrl){
      return(
        <View style={styles.container}>
          <StatusBar
             barStyle="light-content"
          />
          <Image source={require('../resources/images/fondo_nuevo.png')}/>
          <View style={styles.containerList}>
            <View style={styles.sliderStyle}>
              <Swiper
                removeClippedSubviews={false}
                autoplay={true}
                height= {160}
                style={{backgroundColor: "transparent"}}
                >
                  {this.state.imagenBannerUrl.map((item, i) => <Slider
                    imagenUrl={item.imagenUrl}
                    key={i}
                    url='http://kiare.com.mx'
                    navigation={this.props.navigation}
                    />
                  )
                  }
              </Swiper>
            </View>
          <FlatList
            horizontal={false}
            numColumns={3}
            data={this.state.data}
            style={{paddingTop: 10}}
            renderItem={({item}) =>
              <View style={{alignItems:"center", marginBottom: 10}}>
                <View style={{backgroundColor:"rgba(255,255,255,0.3)", width: 70, height: 70, marginLeft: 20, marginRight: 20, marginBottom: 10,  borderRadius: 12, padding: 10}}>
                  <TouchableOpacity
                    style={{flex: 1, alignItems: "center", justifyContent: "center"}}
                    onPress={() => {
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

                        this.props.navigation.navigate('NegociosDetalle', {data: item, distancia});
                      } else {
                        this.props.navigation.navigate('NegociosDetalle', {data: item});
                      }
                      }}
                    >
                    {item.imagenUrl !== null ? <CachedImage resizeMode={'contain'} style={styles.imageStyle} source={{uri: item.imagenUrl}}/> : null }
                  </TouchableOpacity>
                </View>
                <View style={{width: 85}}>
                  <Text numberOfLines={2} style={{flex:1, backgroundColor: 'transparent', color: "#CFBBA4", fontSize: 12, fontWeight: '100', textAlign: 'center'}}> {item.nombre} </Text>
                </View>

                { item.isBusinessOpen === 'open' ? (<View style={styles.openBusinessStyle}>
                  <Icon
                    name= "lock-open"
                    color= "white"
                    size={14}
                  />
                </View>)
                 : item.isBusinessOpen === 'closed' ?
                 (<View style={styles.closedBusinessStyle}>
                   <Icon
                     name= "lock"
                     color= "white"
                     size={14}
                   />
                 </View>) : null
                }

              </View>
            }
          />
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
          <View style={styles.containerLogoAndSpinner}>
            <View style={styles.centeredComponents}>
              <ActivityIndicator
                animating={!(this.state.data && this.state.data.length > 0 && this.state.imagenBannerUrl)}
                style={{height: 80}}
                size="large"
              />
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
    top: 0,
    bottom: 0,
    alignItems: 'center',
  },
  sliderStyle: {
    backgroundColor:"transparent",
    height: 145,
    width,
    marginBottom: 20,
  },
  imageStyle:{
    flex: 1,
    width: 60,
    height: 60,
  },
  touchableOpacitySliderStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:"transparent",
  },
  imageSliderStyle: {
    flex: 1,
    width,
  },
  sliderViewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  closedBusinessStyle: {
    position:'absolute',
    top: - 10,
    left:70,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openBusinessStyle: {
    position:'absolute',
    top: - 10,
    left:70,
    width: 20,
    height: 20,
    borderRadius: 10,
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
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default BusinessBySubcategory;

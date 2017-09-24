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
  ScrollView,
  Platform,
  Linking,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from 'react-navigation';
import Swiper from 'react-native-swiper';
import CachedImage from 'react-native-cached-image';
import Communications from 'react-native-communications';
const {width, height} = Dimensions.get('window');


class NegociosDetalle extends Component{

  static navigationOptions = ({ navigation }) => ({
    header: null,
    // headerTitle: navigation.state.params.data.nombre,
    // headerRight: (
    //   <View style={{flexDirection: 'row', marginRight: 20, alignItems: 'flex-end'}}>
    //   {navigation.state.params.data.telefono ? (
    //     <TouchableOpacity
    //       onPress={() => {
    //         Alert.alert('Enlazar llamada', 'Te comunicaremos al: ' + navigation.state.params.data.telefono,  [ {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}, {text: 'Si', onPress: () => {
    //           // Here goes to code to call
    //           Communications.phonecall(navigation.state.params.data.telefono, false);
    //         }},],  { cancelable: false });
    //         }
    //       }
    //     >
    //     <View>
    //       <Ionicons
    //         name="ios-call"
    //         size={20}
    //         color="rgba(207, 187, 164, 1.0)"
    //       />
    //     </View>
    //     </TouchableOpacity>
    //   ) : null}
    //
    //   {navigation.state.params.distancia ? (
    //     <TouchableOpacity
    //     style={{marginLeft: 20}}
    //       onPress={()=>{
    //         Alert.alert('¡Oye!', 'Te enviaremos a una app externa de Mapas. ¿Estás de acuerdo?',  [ {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}, {text: 'Si', onPress: () => {
    //           var url = null;
    //           let coordenates = navigation.state.params.data.latitud + ','+ navigation.state.params.data.longitud;
    //           let dirflg = '&dirflg=d'
    //           if (Platform.OS === 'android'){
    //             // here goes the call to open the google maps
    //             url = 'geo:';
    //           } else {
    //             // her goes the call to open Apple maps
    //             url = 'http://maps.apple.com/?daddr=';
    //           }
    //           Linking.openURL(url+coordenates+dirflg);
    //         }},],  { cancelable: false });
    //       }
    //     }
    //     >
    //       <View>
    //         <Icon
    //           name="location"
    //           size={20}
    //           color="rgba(207, 187, 164, 1.0)"
    //         />
    //       </View>
    //     </TouchableOpacity>
    //   ) : null}
    //
    //   {navigation.state.params.data.web ? (
    //     <TouchableOpacity
    //       style={{marginLeft: 20}}
    //       onPress={null}
    //     >
    //       <MaterialCommunityIcons
    //         name="web"
    //         size={20}
    //         color="rgba(207, 187, 164, 1.0)"
    //       />
    //     </TouchableOpacity>
    //   ) : null}
    // </View>),
    // headerLeft: (<TouchableOpacity
    //   onPress={()=>{
    //                 const backAction = NavigationActions.back();
    //                 navigation.dispatch(backAction);
    //               }
    //           }>
    //           <View style={{paddingLeft: 20}}>
    //             <Icon
    //               name= "back"
    //               color= "#CFBBA4"
    //               size={20}
    //             />
    //           </View>
    // </TouchableOpacity>),

  });


    constructor(props){
      super(props);
      this.state = {
        masInformacionData: [],
      }
      console.log(this.props.navigation.state.params);
    }

    _sendMeToMaps(latitudeDelta, longitudeDelta){
      Alert.alert('¡Oye!', 'Te enviaremos a una app externa de Mapas. ¿Estás de acuerdo?',  [ {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}, {text: 'Si', onPress: () => {
        var url = null;
        let coordenates = latitudeDelta + ','+ longitudeDelta
        if (Platform.OS === 'android'){
          // here goes the call to open the google maps
          url = 'geo:';
        } else {
          // her goes the call to open Apple maps
          url = 'http://maps.apple.com/?ll=';
        }
        Linking.openURL(url+coordenates);
      }},],  { cancelable: false });
    }

  render(){
    return(
      <View style={styles.container}>
        <StatusBar
           barStyle="light-content"
        />
        <Image source={require('../resources/images/fondo_nuevo.png')}/>
        <View style={styles.containerAbsolute}>
          <ScrollView>
            <View style={{marginLeft: 20,}}>
            <View>
            <View style={styles.verticalAligning}>
              <View style={styles.logoImageStyle}>

              </View>
              <View style={styles.buttonsBusinessContainer}>
                <TouchableOpacity>
                  <View style={styles.buttonBusinessStyle}>

                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.buttonBusinessStyle}>

                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.buttonBusinessStyle}>

                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.horizontalBar}>

            </View>

            <View style={styles.horizontalBarLarge}>

            </View>

            <View style={styles.horizontalBarMedium}>

            </View>

            <View style={styles.horizontalBarLarge}>

            </View>

            <View style={styles.horizontalBar}>

            </View>

            <View style={styles.horizontalBar}>

            </View>

              {this.props.navigation.state.params.data.direccion ?
                (
                  <View>
                  <Text style={[styles.horarioTextStyle, {fontWeight: 'bold'}]}>
                    Dirección
                  </Text>
                  <Text style={[styles.horarioTextStyle, {marginBottom: 20}]}>
                    {this.props.navigation.state.params.data.direccion}
                  </Text>
                  </View>
                ): null}

                {this.props.navigation.state.params.distancia ?
                  (<View>
                    <Text style={[styles.horarioTextStyle, {fontWeight: 'bold'}]}>
                      Distancia
                    </Text>
                    <Text style={[styles.horarioTextStyle, {marginBottom: 20}]}>
                      {this.props.navigation.state.params.distancia} KM
                    </Text>
                  </View>
                  ): null}

            </View>

              {(Object.keys(this.props.navigation.state.params.data.horarios).length > 0) ?
              (
                <View>
                <Text style={[styles.horarioTextStyle, {fontWeight: 'bold'}]}>
                  Horario
                </Text>
                <Text style={styles.horarioTextStyle}>
                  Domingo: {(this.props.navigation.state.params.data.horarios[0].abi === 0 && this.props.navigation.state.params.data.horarios[0].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[0].abi +' - '+ this.props.navigation.state.params.data.horarios[0].cer}
                </Text>
                <Text style={styles.horarioTextStyle}>
                  Lunes: {(this.props.navigation.state.params.data.horarios[1].abi === 0 && this.props.navigation.state.params.data.horarios[1].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[1].abi +' - '+ this.props.navigation.state.params.data.horarios[1].cer}
                </Text>
                <Text style={styles.horarioTextStyle}>
                  Martes: {(this.props.navigation.state.params.data.horarios[2].abi === 0 && this.props.navigation.state.params.data.horarios[2].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[2].abi +' - '+ this.props.navigation.state.params.data.horarios[2].cer}
                </Text>
                <Text style={styles.horarioTextStyle}>
                  Miércoles: {(this.props.navigation.state.params.data.horarios[3].abi === 0 && this.props.navigation.state.params.data.horarios[3].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[3].abi +' - '+ this.props.navigation.state.params.data.horarios[3].cer}
                </Text>
                <Text style={styles.horarioTextStyle}>
                  Jueves: {(this.props.navigation.state.params.data.horarios[5].abi === 0 && this.props.navigation.state.params.data.horarios[4].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[4].abi +' - '+ this.props.navigation.state.params.data.horarios[4].cer}
                </Text>
                <Text style={styles.horarioTextStyle}>
                  Viernes: {(this.props.navigation.state.params.data.horarios[5].abi === 0 && this.props.navigation.state.params.data.horarios[5].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[5].abi +' - '+ this.props.navigation.state.params.data.horarios[5].cer}
                </Text>
                <Text style={styles.horarioTextStyle}>
                  Sábado: {(this.props.navigation.state.params.data.horarios[6].abi === 0 && this.props.navigation.state.params.data.horarios[6].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[6].abi +' - '+ this.props.navigation.state.params.data.horarios[6].cer}
                </Text>
                </View>
              ) : null}

            </View>
         </ScrollView>
        </View>
      </View>
    );
  }
}

const Slider = props => (
    <TouchableOpacity
    onPress={()=>{
      props.navigation.navigate('WebBrowser', {url: props.url});
    }}
    style={styles.touchableOpacitySliderStyle}
    >
      <View style={styles.sliderViewContainer}>
        <CachedImage resizeMode={'contain'} style={styles.imageSliderStyle} source={{uri: props.imagenUrl}}/>
      </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  containerAbsolute: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 10,
    marginTop: 20,
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
  imageBusinessStyle:{
    flex: 1,
    width: 120,
    height: 160,
    borderRadius: 12,
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
  horarioTextStyle: {
    backgroundColor: 'transparent',
    color: 'rgba(207, 187, 164, 1.0)',
    fontSize: 16,
    fontWeight: '100',
  },
  nombreNegocioStyle: {
    backgroundColor: 'transparent',
    color: 'rgba(207, 187, 164, 1.0)',
    fontSize: 24,
    fontWeight: '100',
    marginBottom: 20,
    alignItems: 'center',
  },
  masInformacionStyle: {
    backgroundColor: 'transparent',
    color: 'rgba(207, 187, 164, 1.0)',
    fontSize: 16,
    fontWeight: '100',
    marginBottom: 10,
  },
  logoImageStyle:{
    marginVertical: 10,
    width: ((width/3) * 2) - 10,
    height: (height/2) - 60,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10
  },
  buttonsBusinessContainer:{
    marginVertical: 10,
    marginLeft: 10,
    width: ((width/3) * 1) - 30,
    height: (height/2) - 60,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  buttonBusinessStyle:{
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  verticalAligning: {
    flexDirection: 'row',
  },
  horizontalBar:{
    width: width - 40,
    height: 60,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 10,
  },
  horizontalBarLarge:{
    width: width - 40,
    height: (height/2) - 60,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 10,
  },
  horizontalBarMedium:{
    width: width - 40,
    height: (height/6) * 1,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 10,
  },
});

export default NegociosDetalle;

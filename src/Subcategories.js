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
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import { NavigationActions } from 'react-navigation';
const {width, height} = Dimensions.get('window');
import CachedImage from 'react-native-cached-image';
import Swiper from 'react-native-swiper';
import Firebase from '../lib/Firebase';

import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-circular-action-menu';

class Subcategories extends Component{

    static navigationOptions = ({ navigation }) => ({
      header: null,
      // headerTitle: navigation.state.params.categoryName,
      // headerRight: null,
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
      //         </TouchableOpacity>),
    });

    constructor(props){
      super(props);
      this.state = {
        data: [],
      }
  }

    componentWillMount(){
      try {
        var data =[];
        var subcategoriesMap = Firebase.jsonToMap(this.props.navigation.state.params.subcategories);
        var subcategoriesNestedMap = Firebase.jsonToMapNested(this.props.navigation.state.params.subcategories);

        Firebase.obtenerArbol('/subcategorias/', (snapshotSubcategories) =>{
          snapshotSubcategories.forEach((childSnapshot)=>{
            if (childSnapshot.child('activo').val() === true){
              if (subcategoriesMap.has(childSnapshot.key)){
                let subcategoria = {
                  nombre: childSnapshot.child('nombre').val(),
                  imagenUrl: childSnapshot.child('imagenUrl').val(),
                  imagenIcon: childSnapshot.child('imagenIcon').val(),
                  categorias: childSnapshot.child('categorias').val(),
                  negocios: childSnapshot.child('negocios').val(),
                  key: childSnapshot.key,
                  imagenBannerUrl: childSnapshot.child('imagenBannerUrl').val(),
                  orden: childSnapshot.child('orden').val(),
                }
                if (subcategoriesNestedMap.has(childSnapshot.key)){
                  subcategoria['isNested'] = true;
                  subcategoria['subcategories'] = subcategoriesNestedMap.get(childSnapshot.key);
                }
                data.push(subcategoria);
                data.sort((a, b) =>{
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
              }
            }
          });

          this.setState({data});
        });
      } catch (error){
        console.log(error);
      }
    }


  render(){
    if (this.state.data && this.state.data.length > 0 ){
      return(
        <View style={styles.container}>
          <StatusBar
             barStyle="light-content"
          />

            <ScrollView>
              <FlatList
                horizontal={false}
                data={this.state.data}
                renderItem={({item}) => {
                  var icon = item.imagenIcon;
                  var imagenUrl = item.imagenUrl;
                  return (
                    <View style={styles.categoryOptionStyle}>
                      <TouchableOpacity
                        style={styles.categoryOptionTouchableStyle}
                        onPress={()=>{
                          if (item.isNested){
                              this.props.navigation.navigate('Subcategories', {estadoSeleccionado: this.props.navigation.state.params.estadoSeleccionado, subcategories: item.subcategories, categoryName: item.nombre.toUpperCase(), latitude: this.props.navigation.state.params.latitude, longitude: this.props.navigation.state.params.longitude});
                          } else {
                              this.props.navigation.navigate('BusinessBySubcategory', {estadoSeleccionado: this.props.navigation.state.params.estadoSeleccionado, subcategory: item.key, subcategoryName: item.nombre.toUpperCase(), latitude: this.props.navigation.state.params.latitude, longitude: this.props.navigation.state.params.longitude, });
                          }
                        }}
                        >
                        <CachedImage resizeMode={'cover'} style={styles.categoryOptionImageStyle} source={{uri: imagenUrl}}/>
                        <View style={styles.categoryOptionRowDirectionStyle}>
                          <View style={styles.categoryOptionIconViewStyle}>
                            <CachedImage resizeMode={'contain'} style={styles.categoryOptionIconStyle} source={{uri: icon}}/>
                          </View>
                          <Text numberOfLines={2} style={styles.categoryOptionTextStyle}>{item.nombre.toUpperCase()}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                );
                  }
                }
              />
            </ScrollView>
            <View style={styles.containerRelative}>
              <ActionButton
              position="right"
              buttonColor="rgba(213,85,60,1)">
                <ActionButton.Item buttonColor='#F8C029' title="Likes" onPress={() => console.log("notes tapped!")}>
                  <Ionicons name="md-heart" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#88A451' title="Home" onPress={() => {}}>
                  <Ionicons name="md-home" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#EC573B' title="Profile" onPress={() => {}}>
                  <Ionicons name="md-person" style={styles.actionButtonIcon} />
                </ActionButton.Item>
              </ActionButton>
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
                animating={!(this.state.data && this.state.data.length > 0)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  containerList: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    alignItems: 'center',
  },
  containerRelative: {
    position: 'absolute',
    width,
    bottom: 20,
  },
  flatListSubcategoryContainerStyle: {
    alignItems:"center",
    marginBottom: 10,
  },
  flatListSubcategorySquareStyle: {
    backgroundColor:"rgba(255,255,255,0.3)",
    width: 70,
    height: 70,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 10
  },
  flatListSubcategoryTouchableStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  flatListSubcategoryImageStyle:{
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
  centeredComponents: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryOptionStyle:{
    height: height/3,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryOptionTouchableStyle:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryOptionImageStyle:{
    height: height/3,
    width,
  },
  categoryOptionRowDirectionStyle:{
      flexDirection: 'row',
      alignItems:'center',
      justifyContent: 'center',
      position: 'absolute',
      width,
      height: height/3,
      backgroundColor: "rgba(0,0,0,0.4)"
    },
  categoryOptionIconViewStyle:{
    alignItems:'center',
    justifyContent:'center',
  },
  categoryOptionIconStyle:{
    height: 60,
    width: 60,
    marginRight: 10,
  },
  categoryOptionTextStyle:{
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'left',
    flexWrap: 'wrap',
    width: (width/2 + 70),
    justifyContent: 'center'
  },
  actionButtonIcon: {
  fontSize: 20,
  height: 22,
  color: 'white',
},
});

export default Subcategories;

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
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import { NavigationActions } from 'react-navigation';
const {width} = Dimensions.get('window');
import CachedImage from 'react-native-cached-image';
import Swiper from 'react-native-swiper';
import Firebase from '../lib/Firebase';

class Subcategories extends Component{

    static navigationOptions = ({ navigation }) => ({
      headerTitle: navigation.state.params.categoryName,
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
      }
    }

    componentWillMount(){
      try {
        var data =[];
        var subcategoriesMap = Firebase.jsonToMap(this.props.navigation.state.params.subcategories);
        Firebase.obtenerArbol('/subcategorias/', (snapshotSubcategories) =>{
          snapshotSubcategories.forEach((childSnapshot)=>{
            if (subcategoriesMap.has(childSnapshot.key)){
              let subcategoria = {
                nombre: childSnapshot.child('nombre').val(),
                imagenUrl: childSnapshot.child('imagenUrl').val(),
                categorias: childSnapshot.child('categorias').val(),
                negocios: childSnapshot.child('negocios').val(),
                key: childSnapshot.key,
                imagenBannerUrl: childSnapshot.child('imagenBannerUrl').val(),
              }
              data.push(subcategoria);
            }
          });
          this.setState({data});
        });
      } catch (error){
        console.log(error);
      }
    }


  render(){
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
                <View style={styles.flatListSubcategoryContainerStyle}>
                  <View style={styles.flatListSubcategorySquareStyle}>
                    <TouchableOpacity
                      style={styles.flatListSubcategoryTouchableStyle}
                      onPress={() => {
                        console.log('get business by Category');
                      }}
                      >
                      {item.imagenUrl !== null ?
                        <CachedImage
                          resizeMode={'contain'}
                          style={styles.flatListSubcategoryImageStyle}
                          source={{uri: item.imagenUrl}}/> :
                          null
                        }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerList: {
    flex: 1,
    position: "absolute",
    top: 10,
    bottom: 0,
    alignItems: 'center',
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
  }

});

export default Subcategories;

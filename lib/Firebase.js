import * as firebase from 'firebase';

// Initialize Firebase
const config = {
    apiKey: "AIzaSyD-Kwsm_locYkjIfVwc5vCtr_VBjAjli5c",
    authDomain: "kiare-e91da.firebaseapp.com",
    databaseURL: "https://kiare-e91da.firebaseio.com",
    projectId: "kiare-e91da",
    storageBucket: "kiare-e91da.appspot.com",
    messagingSenderId: "894423191176"
  };

const firebaseApp = firebase.initializeApp(config);

class Firebase {

  static subcategoriasPorEstado(estado, rama, funcionRetorno){
    try {
      if ((estado && estado.length > 0) && (rama && rama.length > 0) && (funcionRetorno)){
        // instance de firebase
        var fbReference = firebaseApp.database().ref(rama);
        //filtro por estado usando orderByChild() y equalTo()
        fbReference.orderByChild('estado').equalTo(estado).once('value', (snapshot)=>{
          if (snapshot.val()){
            funcionRetorno(snapshot);
          } else {
            console.log('snapshot esta vacio');
          }
        });
      } else {
        console.log('estado, rama o funcionRetorno pueden no pueden ser nulos');
      }
    }
    catch(error) {
      console.log(error);
    }
  }

  static _subCategoriasPorEstado(estado, rama, retorno){
    if ((estado && estado.length > 0) && (rama && rama.length > 0)){
      // create a firebase reference
      try {
        var fbReference = firebaseApp.database().ref(rama);
        fbReference.on('value', (snapshot) => {
          if (snapshot.val()) {
            retorno(snapshot);
          }else {
            console.log('snapshot does not have a value');
          }
        });
        console.log('after fbReference.once');
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('no state');
      return null;
    }
    console.log('at the bottom of categoriesByState');
  }

  static obtenerArbol(rama, retorno){
    if ((rama && rama.length > 0)){
      // create a firebase reference
      try {
        var fbReference = firebaseApp.database().ref(rama);
        fbReference.on('value', (snapshot) => {
          if (snapshot.val()) {
            retorno(snapshot);
          }else {
            console.log('snapshot does not have a value');
          }
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('no state');
      return null;
    }
  }
}

module.exports = Firebase;

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
            console.log('antes de retornar la funcion');
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

  static obtenerArbol(rama, retorno, ordenPorHijoColumna, ordenPorHijoValor){
    if ((rama && rama.length > 0)){
      // create a firebase reference
      try {
        var fbReference = firebaseApp.database().ref(rama);
        if (ordenPorHijoColumna && ordenPorHijoValor){
          fbReference.orderByChild(ordenPorHijoColumna).equalTo(ordenPorHijoValor).once('value', (snapshot) => {
            if (snapshot.val()) {
              retorno(snapshot);
            }else {
              console.log('snapshot does not have a value');
            }
          });

        } else {
          fbReference.once('value', (snapshot) => {
            if (snapshot.val()) {
              retorno(snapshot);
            }else {
              console.log('snapshot does not have a value');
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('no state');
      return null;
    }
  }

  static getBusinessByCity(city, path, callback){
    try {
      if ((city && city.length > 0) && (path && path.length > 0) && (callback)){
        var fbReference = firebaseApp.database().ref(path);
        fbReference.orderByChild('estado').equalTo(city).once('value', (snapshot)=>{
          if (snapshot.val()){
            callback(snapshot);
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

  static setBussinessFavorites(path, business){
    try {
      var object = {};
      object[business] = true;
      firebaseApp.database().ref(path).update(object);
    }
    catch(error) {
      console.log('setBussinessFavorites(): '+ error);
    }
  }

  static isBusinessFavorite(path, business, retorno){
    try {
      var fbReference = firebaseApp.database().ref(path+'/'+business)
      fbReference.once('value', (snapshot)=>{
        if (snapshot.val()){
          retorno();
        } else {
          console.log('isBusinessFavorite() -> Business '+business+' not found.');
        }
      });
    } catch(error) {
      console.log(error);
    }
  }

  static snapshotToArray(snapshot) {
    var returnArr = [];
    snapshot.forEach((childSnapshot) => {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

static snapshotToMap(snapshot) {
  var returnMap = new Map();
  snapshot.forEach((childSnapshot) => {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;

      returnMap.set(item.key, item);
  });

  return returnMap;
};

static jsonToArray(json) {
  var returnArr = [];
  for (var item in json){
    returnArr.push(json[item]);
  }
  return returnArr;
};

static jsonToMap(json) {
  var map = new Map();
  for (var item in json){
    map.set(item, json[item]);
  }
  return map;
};

static jsonToMapNested(json) {
  var map = new Map();
  for (var item in json){
    if(typeof json[item] == "object") {
      map.set(item, json[item]);
    }
  }
  return map;
};

static getSubcategoriesFrom(businessSpanshot) {
  var map = new Map();
  businessSpanshot.forEach((childSnapshot) => {
      var subcategorias = childSnapshot.subcategorias;
      for (var item in subcategorias){
        if (!map.has(item)){
          map.set(item, subcategorias[item]);
        }
      }
  });
return map;
}

static loginWithEmail(email, password, callbackSuccess, callbackError){
  try {
    firebaseApp.auth().signInWithEmailAndPassword(email, password)
    .then((onResolveUser) => {
      callbackSuccess(onResolveUser);
    })
    .catch((errorLogin)=>{
      callbackError(errorLogin);
    });
  } catch(error) {
    console.log(error);
  }
}

static resetPassword(email, callbackSuccess, callbackError){
  try {
    firebaseApp.auth().sendPasswordResetEmail(email)
    .then(() => {
      callbackSuccess();
    })
    .catch((errorLogin)=>{
      callbackError(errorLogin);
    });
  } catch(error) {
    console.log(error);
  }
}

static createUser(object, callbackSuccess, callbackError){
  try{
    firebaseApp.auth().createUserWithEmailAndPassword(object.email, object.password)
    .then((user)=>{
      callbackSuccess(user);
    })
    .catch((error)=>{
      callbackError(error);
    });
  } catch(error){
    callbackError(error);
  }
}

static setUser(object, callbackSuccess, callbackError){
  try {
    if (object){
      let ref = firebaseApp.database().ref('users/'+object.uid);
      var newUser = {email:object.email};
      ref.set(newUser)
      .then(() => {
        callbackSuccess();
      })
      .catch((error) => {
        callbackError(error);
      });
    }else {
      callbackError('invalid object/null');
    }
  } catch (error) {
    console.log(error);
  }
}

static logOut(callbackSuccess){
  try {
    firebaseApp.auth().signOut()
    .then((onResolve) => {
      callbackSuccess();
    }, (onReject) => {
      console.log(onReject)
    });
  } catch (error) {
    console.log(error)
  }
}

static signInWithCredential(facebookAccessToken, callbackSuccess, callbackError){
  try {
    var cred = firebase.auth.FacebookAuthProvider.credential(facebookAccessToken);
    console.log(cred);
    firebaseApp.auth().signInWithCredential(cred)
      .then((user) => {
        callbackSuccess(user);
      })
      .catch((error) => {
        console.log(error);
        callbackError(error);
      });
  } catch(error){
    console.log(error);
    callbackError(error);
  }
}

static setUserFromFacebook(object, callbackSuccess, callbackError){
  try {
    if (object){
      let ref = firebaseApp.database().ref('users/'+object.uid);
      var newUser = {email:object.providerData[0].email};
      ref.update(newUser)
      .then(() => {
        callbackSuccess();
      })
      .catch((error) => {
        callbackError(error);
      });
    }else {
      callbackError('invalid object/null');
    }
  } catch (error) {
    console.log(error);
  }
}


}

module.exports = Firebase;

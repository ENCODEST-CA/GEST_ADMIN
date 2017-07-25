import * as firebase from "firebase"
const config = {
    apiKey: "AIzaSyAtdB7NdUOAQgRQ7wcw8WIfIa9bB-yct2c",
    authDomain: "gest-76d70.firebaseapp.com",
    databaseURL: "https://gest-76d70.firebaseio.com",
    projectId: "gest-76d70",
    storageBucket: "gest-76d70.appspot.com",
    messagingSenderId: "451718974469"
};

if (!firebase.apps.length) { firebase.initializeApp(config) }
    
export const auth = firebase.auth()

export const check = auth.onAuthStateChanged((user) => { 
    if (user) {
        return true
    } 
    else { 
        return false
    } 
})
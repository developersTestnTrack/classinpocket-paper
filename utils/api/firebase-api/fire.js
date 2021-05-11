import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAVFCUdcM7Ta9muRJDy7DticO0TkuTcHbE",
    authDomain: "classinpocket-f5907.firebaseapp.com",
    projectId: "classinpocket-f5907",
    storageBucket: "classinpocket-f5907.appspot.com",
    messagingSenderId: "940663640616",
    appId: "1:940663640616:web:0a2d2fede815259a415b1d",
    measurementId: "G-74Q44H083Q",
};

if (firebase.apps.length === 0) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

export const firestoreDB = firebase.firestore();
export const firebaseStorage = firebase.storage();
export const firestoreTimeStamp = firebase.firestore.Timestamp;

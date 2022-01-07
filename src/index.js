import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//importing firebase elements
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

//firebase config data
var firebaseConfig = {
  apiKey: "AIzaSyCH4LgA_CcFBETDjRxZaGk-gv5boG2k5F8",
  authDomain: "pipestream-cd151.firebaseapp.com",
  projectId: "pipestream-cd151",
  storageBucket: "pipestream-cd151.appspot.com",
  messagingSenderId: "235097428538",
  appId: "1:235097428538:web:5c73f9c83c2281d8231b03",
  measurementId: "G-2CR5VR92WX"
};


firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();

export{firebase, db};
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

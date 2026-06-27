// ========================================
// Pendrive Forum
// firebase-config.js
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// Configuração do Firebase

const firebaseConfig = {

    apiKey: "AIzaSyApcBYsgbD8loBMqVWQmC2OJL9vhuCROB4",

    authDomain: "pendrive-forum.firebaseapp.com",

    projectId: "pendrive-forum",

    storageBucket: "pendrive-forum.firebasestorage.app",

    messagingSenderId: "120545798044",

    appId: "1:120545798044:web:72c7fa0f0932b974348a59"

};

// Inicialização

const app = initializeApp(firebaseConfig);

// Serviços

const auth = getAuth(app);

const db = getFirestore(app);

// Exportações

export {

    app,

    auth,

    db

};

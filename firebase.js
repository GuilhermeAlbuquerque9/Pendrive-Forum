// ========================================
// Pendrive Forum
// firebase.js
// ========================================

import { auth, db } from "./firebase-config.js";

import {

    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {

    doc,
    setDoc,
    getDoc

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/* ============================
   Cadastro
============================ */

export async function cadastrar(nome,email,senha){

    const credencial = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
    );

    await updateProfile(credencial.user,{
        displayName:nome
    });

    await setDoc(doc(db,"usuarios",credencial.user.uid),{

        nome:nome,

        email:email,

        cargo:"👤 Membro",

        gostos:0,

        entrada:new Date(),

        online:true,

        foto:""

    });

}

/* ============================
   Login
============================ */

export async function login(email,senha){

    await signInWithEmailAndPassword(
        auth,
        email,
        senha
    );

}

/* ============================
   Logout
============================ */

export async function logout(){

    await signOut(auth);

}

/* ============================
   Sessão
============================ */

export function verificarSessao(callback){

    onAuthStateChanged(auth,callback);

}

/* ============================
   Usuário
============================ */

export async function obterUsuario(){

    if(!auth.currentUser){

        return null;

    }

    const ref = doc(db,"usuarios",auth.currentUser.uid);

    const dados = await getDoc(ref);

    return dados.data();

}
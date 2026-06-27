// ========================================
// Pendrive Forum
// auth.js
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
    getDoc,
    updateDoc,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/* ========================================
   Cadastro
======================================== */

export async function cadastrar(nome,email,senha){

    const credencial = await createUserWithEmailAndPassword(

        auth,

        email,

        senha

    );

    await updateProfile(

        credencial.user,

        {

            displayName:nome

        }

    );

    await setDoc(

        doc(db,"usuarios",credencial.user.uid),

        {

            nome,

            email,

            cargo:"👤 Membro",

            gostos:0,

            foto:"",

            assinatura:"",

            entrada:serverTimestamp(),

            online:true,

            ultimoLogin:serverTimestamp()

        }

    );

}

/* ========================================
   Login
======================================== */

export async function login(email,senha){

    const credencial = await signInWithEmailAndPassword(

        auth,

        email,

        senha

    );

    await updateDoc(

        doc(db,"usuarios",credencial.user.uid),

        {

            online:true,

            ultimoLogin:serverTimestamp()

        }

    );

}

/* ========================================
   Logout
======================================== */

export async function logout(){

    if(auth.currentUser){

        await updateDoc(

            doc(db,"usuarios",auth.currentUser.uid),

            {

                online:false

            }

        );

    }

    await signOut(auth);

}

/* ========================================
   Sessão
======================================== */

export function verificarSessao(callback){

    onAuthStateChanged(auth,callback);

}

/* ========================================
   Usuário logado
======================================== */

export function usuarioAtual(){

    return auth.currentUser;

}

/* ========================================
   Dados do usuário
======================================== */

export async function obterUsuario(){

    if(!auth.currentUser){

        return null;

    }

    const documento = await getDoc(

        doc(db,"usuarios",auth.currentUser.uid)

    );

    if(!documento.exists()){

        return null;

    }

    return documento.data();

}

/* ========================================
   Atualizar Perfil
======================================== */

export async function atualizarPerfil(dados){

    if(!auth.currentUser){

        throw new Error("Usuário não autenticado.");

    }

    await updateDoc(

        doc(db,"usuarios",auth.currentUser.uid),

        dados

    );

}

/* ========================================
   Alterar Foto
======================================== */

export async function alterarFoto(url){

    if(!auth.currentUser){

        return;

    }

    await updateDoc(

        doc(db,"usuarios",auth.currentUser.uid),

        {

            foto:url

        }

    );

}

/* ========================================
   Alterar Assinatura
======================================== */

export async function alterarAssinatura(texto){

    if(!auth.currentUser){

        return;

    }

    await updateDoc(

        doc(db,"usuarios",auth.currentUser.uid),

        {

            assinatura:texto

        }

    );

}

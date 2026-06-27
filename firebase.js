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

import {

    collection,
    addDoc,
    serverTimestamp

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

/* ============================
   Criar Tópico
============================ */

export async function criarTopico(titulo,categoria,mensagem){

    if(!auth.currentUser){

        throw new Error("Usuário não autenticado.");

    }

    const usuario = await obterUsuario();

    await addDoc(collection(db,"topicos"),{

        titulo:titulo.trim(),

        categoria:categoria,

        mensagem:mensagem.trim(),

        autor:usuario.nome,

        autorUID:auth.currentUser.uid,

        cargo:usuario.cargo,

        data:serverTimestamp(),

        respostas:0,

        visualizacoes:0,

        reacoes:{

            curtir:0,

            gostei:0,

            engraçado:0,

            impressionante:0,

            util:0

        }

    });

}

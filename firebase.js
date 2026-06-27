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

import {

    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    increment,
    query,
    where,
    orderBy,
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

    if(!auth.currentUser) throw new Error("Usuário não autenticado.");

    const usuario = await obterUsuario();

    await addDoc(collection(db,"topicos"),{

        titulo,
        categoria,
        mensagem,

        autor:usuario.nome,
        autorUID:auth.currentUser.uid,
        cargo:usuario.cargo,

        data:serverTimestamp(),

        respostas:0,

        visualizacoes:0,

        gostos:usuario.gostos ?? 0,

        reacoes:{
            curtir:0,
            gostei:0,
            engraçado:0,
            impressionante:0,
            util:0
        }

    });

}

/* =======================
  Carregar tópico
======================== */

export async function carregarTopico(id){

    const documento = await getDoc(
        doc(db,"topicos",id)
    );

    return documento.data();

}

/* =====================
  Visualização
======================= */

export async function adicionarVisualizacao(id){

    await updateDoc(

        doc(db,"topicos",id),

        {

            visualizacoes:increment(1)

        }

    );

}

/* =======================
  Responder tópico
========================= */

export async function responderTopico(id,mensagem){

    if(!auth.currentUser){

        throw new Error("Faça login.");

    }

    const usuario = await obterUsuario();

    await addDoc(collection(db,"respostas"),{

        topico:id,

        mensagem,

        autor:usuario.nome,

        autorUID:auth.currentUser.uid,

        cargo:usuario.cargo,

        data:serverTimestamp()

    });

    await updateDoc(

        doc(db,"topicos",id),

        {

            respostas:increment(1)

        }

    );

}

/* ======================
   Carregar respostas
======================= */

export async function carregarRespostas(id){

    const consulta=query(

        collection(db,"respostas"),

        where("topico","==",id),

        orderBy("data")

    );

    const snapshot=await getDocs(consulta);

    const respostas=[];

    snapshot.forEach((doc)=>{

        respostas.push({

            id:doc.id,

            ...doc.data()

        });

    });

    return respostas;

}

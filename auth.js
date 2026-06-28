// ========================================
// Pendrive Forum
// auth.js
// Parte 1
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

    const ref = doc(

        db,

        "usuarios",

        credencial.user.uid

    );

    await setDoc(

        ref,

        {

            nome,

            email,

            cargo:"👤 Membro",

            foto:"",

            assinatura:"",

            gostos:0,

            entrada:serverTimestamp(),

            ultimoLogin:serverTimestamp(),

            online:true

        }

    );

    return credencial.user;

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

    const ref = doc(

        db,

        "usuarios",

        credencial.user.uid

    );

    const documento = await getDoc(ref);

    if(documento.exists()){

        await updateDoc(

            ref,

            {

                online:true,

                ultimoLogin:serverTimestamp()

            }

        );

    }else{

        await setDoc(

            ref,

            {

                nome:credencial.user.displayName ?? "Usuário",

                email:credencial.user.email,

                cargo:"👤 Membro",

                foto:"",

                assinatura:"",

                gostos:0,

                entrada:serverTimestamp(),

                ultimoLogin:serverTimestamp(),

                online:true

            }

        );

    }

    return credencial.user;

}

/* ========================================
   Logout
======================================== */

export async function logout(){

    if(auth.currentUser){

        const ref = doc(

            db,

            "usuarios",

            auth.currentUser.uid

        );

        const documento = await getDoc(ref);

        if(documento.exists()){

            await updateDoc(

                ref,

                {

                    online:false

                }

            );

        }

    }

    await signOut(auth);

}

/* ========================================
   Sessão
======================================== */

export function verificarSessao(callback){

    return onAuthStateChanged(

        auth,

        callback

    );

}

/* ========================================
   Usuário atual
======================================== */

export function usuarioAtual(){

    return auth.currentUser;

}

/* ========================================
   Obter dados do usuário
======================================== */

export async function obterUsuario(){

    if(!auth.currentUser){

        return null;

    }

    const ref = doc(

        db,

        "usuarios",

        auth.currentUser.uid

    );

    const documento = await getDoc(ref);

    if(!documento.exists()){

        return null;

    }

    return documento.data();

}

/* ========================================
   Atualizar perfil
======================================== */

export async function atualizarPerfil(dados){

    if(!auth.currentUser){

        throw new Error("Usuário não autenticado.");

    }

    await updateDoc(

        doc(

            db,

            "usuarios",

            auth.currentUser.uid

        ),

        dados

    );

}

/* ========================================
   Alterar foto
======================================== */

export async function alterarFoto(url){

    await atualizarPerfil({

        foto:url

    });

}

/* ========================================
   Alterar assinatura
======================================== */

export async function alterarAssinatura(texto){

    await atualizarPerfil({

        assinatura:texto

    });

}

/* ========================================
   Nome do usuário logado
======================================== */

export async function nomeUsuarioLogado(){

    const usuario = await obterUsuario();

    if(!usuario){

        return null;

    }

    return usuario.nome;

}

/* ========================================
   Está logado?
======================================== */

export function estaLogado(){

    return auth.currentUser !== null;

}

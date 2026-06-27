// ========================================
// Pendrive Forum
// forum.js
// ========================================

import { auth, db } from "./firebase-config.js";
import { obterUsuario } from "./auth.js";

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

/* ========================================
   Criar tópico
======================================== */

export async function criarTopico(titulo,categoria,mensagem){

    if(!auth.currentUser){

        throw new Error("Faça login.");

    }

    const usuario = await obterUsuario();

    const documento = await addDoc(

        collection(db,"topicos"),

        {

            titulo:titulo.trim(),

            categoria,

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

                engracado:0,

                impressionante:0,

                util:0

            }

        }

    );

    return documento.id;

}

/* ========================================
   Carregar tópico
======================================== */

export async function carregarTopico(id){

    const documento = await getDoc(

        doc(db,"topicos",id)

    );

    if(!documento.exists()){

        return null;

    }

    return{

        id:documento.id,

        ...documento.data()

    };

}

/* ========================================
   Visualização
======================================== */

export async function adicionarVisualizacao(id){

    await updateDoc(

        doc(db,"topicos",id),

        {

            visualizacoes:increment(1)

        }

    );

}

/* ========================================
   Responder tópico
======================================== */

export async function responderTopico(id,mensagem){

    if(!auth.currentUser){

        throw new Error("Faça login.");

    }

    const usuario = await obterUsuario();

    await addDoc(

        collection(db,"respostas"),

        {

            topico:id,

            mensagem:mensagem.trim(),

            autor:usuario.nome,

            autorUID:auth.currentUser.uid,

            cargo:usuario.cargo,

            data:serverTimestamp()

        }

    );

    await updateDoc(

        doc(db,"topicos",id),

        {

            respostas:increment(1)

        }

    );

}

/* ========================================
   Carregar respostas
======================================== */

export async function carregarRespostas(id){

    const consulta=query(

        collection(db,"respostas"),

        where("topico","==",id),

        orderBy("data")

    );

    const snapshot=await getDocs(consulta);

    const lista=[];

    snapshot.forEach((documento)=>{

        lista.push({

            id:documento.id,

            ...documento.data()

        });

    });

    return lista;

}

/* ========================================
   Reações
======================================== */

export async function reagir(id,reacao){

    const campo=`reacoes.${reacao}`;

    await updateDoc(

        doc(db,"topicos",id),

        {

            [campo]:increment(1)

        }

    );

}

/* ========================================
   Listar tópicos
======================================== */

export async function listarTopicos(){

    const consulta=query(

        collection(db,"topicos"),

        orderBy("data","desc")

    );

    const snapshot=await getDocs(consulta);

    const lista=[];

    snapshot.forEach((documento)=>{

        lista.push({

            id:documento.id,

            ...documento.data()

        });

    });

    return lista;

}

/* ========================================
   Listar tópicos por categoria
======================================== */

export async function listarCategoria(categoria){

    const consulta=query(

        collection(db,"topicos"),

        where("categoria","==",categoria),

        orderBy("data","desc")

    );

    const snapshot=await getDocs(consulta);

    const lista=[];

    snapshot.forEach((documento)=>{

        lista.push({

            id:documento.id,

            ...documento.data()

        });

    });

    return lista;

}

/* ========================================
   Pesquisar
======================================== */

export async function pesquisarTopicos(){

    return await listarTopicos();

}

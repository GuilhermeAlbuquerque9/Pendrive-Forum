// ========================================
// Pendrive Forum
// forum.js
// Parte 1
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

            ultimaResposta:null,

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
   Listar categoria
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
   Visualizações
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

            respostas:increment(1),

            ultimaResposta:serverTimestamp()

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

    const respostas=[];

    snapshot.forEach((documento)=>{

        respostas.push({

            id:documento.id,

            ...documento.data()

        });

    });

    return respostas;

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
   Total de tópicos
======================================== */

export async function totalTopicos(){

    const snapshot = await getDocs(

        collection(db,"topicos")

    );

    return snapshot.size;

}

/* ========================================
   Total de respostas
======================================== */

export async function totalRespostas(){

    const snapshot = await getDocs(

        collection(db,"respostas")

    );

    return snapshot.size;

}

/* ========================================
   Total de membros
======================================== */

export async function totalMembros(){

    const snapshot = await getDocs(

        collection(db,"usuarios")

    );

    return snapshot.size;

}

/* ========================================
   Membros online
======================================== */

export async function membrosOnline(){

    const consulta = query(

        collection(db,"usuarios"),

        where("online","==",true)

    );

    const snapshot = await getDocs(consulta);

    const lista = [];

    snapshot.forEach((documento)=>{

        lista.push({

            id:documento.id,

            ...documento.data()

        });

    });

    return lista;

}

/* ========================================
   Total online
======================================== */

export async function totalOnline(){

    const lista = await membrosOnline();

    return lista.length;

}

/* ========================================
   Pesquisar tópicos
======================================== */

export async function pesquisarTopicos(texto){

    const lista = await listarTopicos();

    if(!texto){

        return lista;

    }

    const pesquisa = texto.toLowerCase();

    return lista.filter((topico)=>{

        return(

            topico.titulo

                .toLowerCase()

                .includes(pesquisa)

            ||

            topico.mensagem

                .toLowerCase()

                .includes(pesquisa)

            ||

            topico.autor

                .toLowerCase()

                .includes(pesquisa)

            ||

            topico.categoria

                .toLowerCase()

                .includes(pesquisa)

        );

    });

}

/* ========================================
   Estatísticas completas
======================================== */

export async function obterEstatisticas(){

    return{

        topicos:await totalTopicos(),

        respostas:await totalRespostas(),

        membros:await totalMembros(),

        online:await totalOnline()

    };

}

/* ========================================
   Atualizar presença
======================================== */

export async function definirOnline(status){

    if(!auth.currentUser){

        return;

    }

    await updateDoc(

        doc(

            db,

            "usuarios",

            auth.currentUser.uid

        ),

        {

            online:status

        }

    );

}

/* ========================================
   Registrar saída automática
======================================== */

window.addEventListener(

    "beforeunload",

    async ()=>{

        try{

            await definirOnline(false);

        }

        catch(e){}

    }

);

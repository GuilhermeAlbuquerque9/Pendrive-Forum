/* ==========================================
   Pendrive Forum
   script.js
   Parte 1
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    iniciarForum();

});

function iniciarForum(){

    iniciarNavbar();
    iniciarCategorias();
    iniciarBotoes();
    iniciarAnimacoes();

}

/* ==========================================
   Navbar
========================================== */

function iniciarNavbar(){

    const links = document.querySelectorAll(".navbar a");

    links.forEach(link=>{

        link.addEventListener("click",()=>{

            links.forEach(item=>item.classList.remove("active"));

            link.classList.add("active");

        });

    });

}

/* ==========================================
   Categorias
========================================== */

function iniciarCategorias(){

    const categorias = document.querySelectorAll(".category-card");

    categorias.forEach(card=>{

        card.addEventListener("click",()=>{

            console.log(
                "Categoria:",
                card.querySelector("h3").textContent
            );

        });

    });

}

/* ==========================================
   Botões
========================================== */

function iniciarBotoes(){

    document.querySelectorAll(".glass-button").forEach(botao=>{

        botao.addEventListener("mouseenter",()=>{

            botao.style.transform="translateY(-3px) scale(1.02)";

        });

        botao.addEventListener("mouseleave",()=>{

            botao.style.transform="";

        });

    });

}

/* ==========================================
   Animações
========================================== */

function iniciarAnimacoes(){

    aparecer(".panel");
    aparecer(".topic-card");
    aparecer(".category-card");

}

function aparecer(seletor){

    const elementos=document.querySelectorAll(seletor);

    elementos.forEach((item,index)=>{

        item.style.opacity="0";
        item.style.transform="translateY(20px)";

        setTimeout(()=>{

            item.style.transition=".45s";

            item.style.opacity="1";
            item.style.transform="translateY(0)";

        },index*80);

    });

}

/* ==========================================
   Utilidades
========================================== */

function mostrarMensagem(texto){

    console.log(texto);

}

function abrirPagina(url){

    window.location.href=url;

}

/* ==========================================
   Futuras funções Firebase
========================================== */

// Login

function login(){

}

// Cadastro

function cadastro(){

}

// Logout

function logout(){

}

// Carregar categorias

function carregarCategorias(){

}

// Carregar tópicos

function carregarTopicos(){

}

// Criar tópico

function criarTopico(){

}

// Responder tópico

function responderTopico(){

}

// Carregar perfil

function carregarPerfil(){

}

// Atualizar perfil

function atualizarPerfil(){

}

// Pesquisa

function pesquisar(){

}

// Reações

function reagir(){

}

// Administração

function carregarPainelAdmin(){

}

/* ==========================================
   Fim do arquivo
========================================== */
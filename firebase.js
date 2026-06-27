// ========================================
// Pendrive Forum
// firebase.js
// Arquivo central
// ========================================

// Configuração do Firebase

export {

    app,

    auth,

    db

} from "./firebase-config.js";

// Autenticação

export {

    cadastrar,

    login,

    logout,

    verificarSessao,

    usuarioAtual,

    obterUsuario,

    atualizarPerfil,

    alterarFoto,

    alterarAssinatura

} from "./auth.js";

// Fórum

export {

    criarTopico,

    carregarTopico,

    adicionarVisualizacao,

    responderTopico,

    carregarRespostas,

    reagir,

    listarTopicos,

    listarCategoria,

    pesquisarTopicos

} from "./forum.js";

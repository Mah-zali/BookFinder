// Conexão com o banco de dados Supabase
const SUPABASE_URL = "https://zdqhwmzltbjqplnqfmhc.supabase.co";
const SUPABASE_KEY = "sb_publishable_DPaETczGhlP-Th0JhnD7Ww_PCnrCCbo";

const banco = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// Testa a conexão com a tabela de favoritos
async function testarConexao() {
    const { data, error } = await banco
        .from("favoritos")
        .select("id, titulo");

    if (error) {
        console.error("Erro ao conectar ao Supabase:", error);
    } else {
        console.log("Conexão com Supabase funcionando!", data);
    }
}

testarConexao();


// Salva um livro favorito no Supabase
async function salvarFavorito(livro) {
    try {
        const { error } = await banco
            .from("favoritos")
            .insert({
                titulo: livro.titulo,
                autor: livro.autor,
                ano_publicacao: livro.ano_publicacao,
                capa_id: livro.capa_id,
                openlibrary_key: livro.openlibrary_key
            });

        if (error) {
            throw error;
        }

        mostrarNotificacao(
            "Livro salvo nos favoritos!",
            "Mais uma história para sua estante. ♡"
        );
        await listarFavoritos();

    } catch (erro) {
        console.error("Erro ao salvar favorito:", erro);
        mostrarNotificacao(
            "Não foi possível salvar",
            "Verifique sua conexão e tente novamente.",
            "erro"
        );
    }
}

async function buscarLivros(termo) {

    const areaResultado = document.getElementById("resultado");

    areaResultado.innerHTML = "<p>Procurando livros...</p>";

    try {

        const resposta = await fetch(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}&lang=pt`
        );

        if (!resposta.ok) {
            throw new Error("A API apresentou um erro.");
        }

        const dados = await resposta.json();

        if (!dados.docs || dados.docs.length === 0) {

            areaResultado.innerHTML = `
                <p>Nenhum livro encontrado.</p>
                <p>Tente pesquisar por outro título ou autor.</p>
            `;

            return;
        }

        areaResultado.innerHTML = "";

        const livros = dados.docs.slice(0, 10);

        livros.forEach((livro, indice) => {

            const titulo = livro.title || "Título não informado";

            const autor = livro.author_name
                ? livro.author_name[0]
                : "Autor não informado";

            const ano = livro.first_publish_year || "Ano não informado";

            const edicoes = livro.edition_count || "Não informado";

            let capa = "";

            if (livro.cover_i) {

                capa = `
                    <img
                        src="https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg"
                        alt="Capa do livro ${titulo}"
                    >
                `;

            } else {

                capa = `
                    <div class="sem-capa">
                        📕
                        <br>
                        Capa não disponível
                    </div>
                `;
            }

            areaResultado.innerHTML += `
                <article class="livro">

                    ${capa}

                    <div class="informacoes-livro">

                        <h2>${titulo}</h2>

                        <p>
                            <strong>Autor:</strong> ${autor}
                        </p>

                        <p>
                            <strong>Primeira publicação:</strong> ${ano}
                        </p>

                        <p>
                            <strong>Edições:</strong> ${edicoes}
                        </p>
                        <button class="botao-favoritar" data-indice="${indice}" type="button">
                            ♡ Favoritar
                        </button>
                    </div>

                </article>
            `;
        });
        // Conecta os botões de favoritos aos livros encontrados
        document.querySelectorAll(".botao-favoritar").forEach(botao => {
            botao.addEventListener("click", async () => {
                const indice = Number(botao.dataset.indice);
                const livro = livros[indice];

                botao.disabled = true;
                botao.textContent = "Salvando...";

                await salvarFavorito({
                    titulo: livro.title || "Título não informado",
                    autor: livro.author_name?.[0] || "Autor não informado",
                    ano_publicacao: livro.first_publish_year || null,
                    capa_id: livro.cover_i || null,
                    openlibrary_key: livro.key || null
                });

                botao.disabled = false;
                botao.textContent = "♡ Favoritar";
            });
        });
    } catch (erro) {

        console.error("Erro:", erro);

        areaResultado.innerHTML = `
            <p>😕 Não foi possível buscar os livros.</p>
            <p>
                Verifique sua conexão com a internet
                e tente novamente.
            </p>
        `;
    }
}


document.getElementById("botao-buscar").addEventListener("click", () => {

    const campo = document.getElementById("campo-busca");

    const termo = campo.value.trim();

    if (termo === "") {

        document.getElementById("resultado").innerHTML = `
            <p>Digite um título ou nome de autor para pesquisar.</p>
        `;

        return;
    }

    buscarLivros(termo);
});

document.getElementById("campo-busca").addEventListener("keydown", (evento) => {

    if (evento.key === "Enter") {
        document.getElementById("botao-buscar").click();
    }

});

window.addEventListener("load", () => {
    document.getElementById("campo-busca").value = "";
});


/* ========================================
   NOTIFICAÇÕES PERSONALIZADAS
======================================== */

let temporizadorNotificacao;

function mostrarNotificacao(titulo, mensagem, tipo = "sucesso") {
    const notificacao = document.getElementById("notificacao");

    clearTimeout(temporizadorNotificacao);

    notificacao.replaceChildren();

    const icone = document.createElement("span");
    icone.className = "notificacao-icone";
    icone.textContent = tipo === "sucesso" ? "♡" : "!";

    const conteudo = document.createElement("div");

    const tituloElemento = document.createElement("strong");
    tituloElemento.textContent = titulo;

    const mensagemElemento = document.createElement("p");
    mensagemElemento.textContent = mensagem;

    conteudo.append(tituloElemento, mensagemElemento);
    notificacao.append(icone, conteudo);

    notificacao.className = `notificacao notificacao-${tipo} visivel`;

    temporizadorNotificacao = setTimeout(() => {
        notificacao.classList.remove("visivel");
    }, 3500);
}


/* ========================================
   LISTAGEM DE LIVROS FAVORITOS
======================================== */

async function listarFavoritos() {

    const area = document.getElementById("lista-favoritos");

    area.textContent = "Carregando favoritos...";

    try {

        const { data, error } = await banco
            .from("favoritos")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            throw error;
        }

        area.innerHTML = "";

        if (!data || data.length === 0) {
            area.textContent = "Você ainda não possui livros favoritos.";
            return;
        }

        data.forEach(livro => {

            const cartao = document.createElement("article");
            cartao.className = "livro livro-favorito";

            if (livro.capa_id) {
                const imagem = document.createElement("img");
                imagem.src = `https://covers.openlibrary.org/b/id/${livro.capa_id}-M.jpg`;
                imagem.alt = `Capa do livro ${livro.titulo}`;
                cartao.appendChild(imagem);
            } else {
                const semCapa = document.createElement("div");
                semCapa.className = "sem-capa";
                semCapa.textContent = "📕 Capa não disponível";
                cartao.appendChild(semCapa);
            }

            const informacoes = document.createElement("div");
            informacoes.className = "informacoes-livro";


            const titulo = document.createElement("h2");
            titulo.textContent = livro.titulo;

            const autor = document.createElement("p");
            const rotuloAutor = document.createElement("strong");
            rotuloAutor.textContent = "Autor: ";
            autor.append(rotuloAutor, document.createTextNode(livro.autor || "Não informado"));

            const ano = document.createElement("p");
            const rotuloAno = document.createElement("strong");
            rotuloAno.textContent = "Primeira publicação: ";
            ano.append(rotuloAno, document.createTextNode(livro.ano_publicacao || "Não informado"));


            const botao = document.createElement("button");
            botao.className = "botao-excluir";
            botao.type = "button";
            botao.textContent = "Remover favorito";

            botao.addEventListener("click", async () => {
                botao.disabled = true;
                botao.textContent = "Removendo...";

                const removido = await excluirFavorito(livro.id);

                if (!removido) {
                    botao.disabled = false;
                    botao.textContent = "Remover favorito";
                }
            });

            informacoes.appendChild(titulo);
            informacoes.appendChild(autor);
            informacoes.appendChild(ano);
            informacoes.appendChild(botao);

            cartao.appendChild(informacoes);
            area.appendChild(cartao);
        });

    } catch (erro) {

        console.error("Erro ao listar favoritos:", erro);

        area.textContent =
            "Não foi possível carregar seus favoritos. Tente novamente.";
    }
}


function confirmarExclusao() {
    return new Promise(resolve => {
        const dialogo = document.getElementById("dialogo-exclusao");
        const cancelar = document.getElementById("cancelar-exclusao");
        const confirmar = document.getElementById("confirmar-exclusao");

        function finalizar(confirmado) {
            dialogo.removeEventListener("close", aoFechar);
            cancelar.removeEventListener("click", aoCancelar);
            confirmar.removeEventListener("click", aoConfirmar);

            if (dialogo.open) {
                dialogo.close();
            }

            resolve(confirmado);
        }

        function aoFechar() {
            finalizar(false);
        }

        function aoCancelar() {
            finalizar(false);
        }

        function aoConfirmar() {
            finalizar(true);
        }

        dialogo.addEventListener("close", aoFechar);
        cancelar.addEventListener("click", aoCancelar);
        confirmar.addEventListener("click", aoConfirmar);

        dialogo.showModal();
    });
}

/* ========================================
   EXCLUSÃO DE LIVROS FAVORITOS
======================================== */

async function excluirFavorito(id) {

    const confirmar = await confirmarExclusao();

    if (!confirmar) {
        return false;
    }

    try {

        const { data, error } = await banco
            .from("favoritos")
            .delete()
            .eq("id", id)
            .select("id");

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            throw new Error("O livro não foi removido.");
        }

        await listarFavoritos();

        mostrarNotificacao(
            "Livro removido dos favoritos",
            "Sua estante foi atualizada."
        );

        return true;

    } catch (erro) {

        console.error("Erro ao excluir favorito:", erro);
        mostrarNotificacao(
            "Não foi possível remover",
            "Tente novamente em alguns instantes.",
            "erro"
        );

        return false;
    }
}


/* ========================================
   CARREGAR FAVORITOS AO ABRIR A PÁGINA
======================================== */

listarFavoritos();
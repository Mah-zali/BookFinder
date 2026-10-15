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

        alert("Livro adicionado aos favoritos! ❤️");

    } catch (erro) {
        console.error("Erro ao salvar favorito:", erro);
        alert("Não foi possível salvar o livro. Tente novamente.");
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

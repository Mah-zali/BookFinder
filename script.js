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
                <p>😕 Nenhum livro encontrado.</p>
                <p>Tente pesquisar por outro título ou autor.</p>
            `;

            return;
        }

        areaResultado.innerHTML = "";

        const livros = dados.docs.slice(0, 10);

        livros.forEach(livro => {

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

                    </div>

                </article>
            `;
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
            <p>⚠️ Digite o nome de um livro para pesquisar.</p>
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
# BookFinder — Explorador de Livros

**Autora:** Mariana Oliveira Mazali  
**RA:** 22552647

## Descrição

O BookFinder é uma aplicação web desenvolvida para facilitar a busca e consulta de informações sobre livros.

O projeto utiliza a API pública Open Library para realizar pesquisas e apresentar informações relevantes sobre os livros encontrados de forma organizada e amigável para o usuário.

## Objetivo

Criar uma aplicação frontend capaz de consumir uma API pública, processar seus dados e apresentar as informações de forma organizada e amigável para o usuário.

## Funcionalidades

- Pesquisa de livros por título ou autor;
- Pesquisa utilizando o botão "Buscar";
- Pesquisa pressionando a tecla Enter;
- Exibição do título do livro;
- Exibição do autor;
- Exibição do ano da primeira publicação;
- Exibição da quantidade de edições;
- Exibição da capa do livro quando disponível;
- Mensagem quando nenhum livro é encontrado;
- Mensagem para pesquisa vazia;
- Tratamento de erros de conexão ou da API;
- Exibição dos resultados de forma organizada.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Fetch API
- Open Library API

## API utilizada

O projeto utiliza a **Open Library API** para realizar as pesquisas de livros.

A aplicação consulta a API de forma assíncrona utilizando `fetch`, processa os dados retornados em formato JSON e apresenta até 10 resultados por pesquisa.

Entre as informações exibidas estão o título, autor, ano da primeira publicação, quantidade de edições e capa do livro, quando disponível.

## Instruções para execução local

1. Baixe ou clone o projeto para o computador.
2. Abra a pasta do projeto.
3. Abra o arquivo `index.html` em um navegador.
4. Digite o nome de um livro ou autor no campo de pesquisa.
5. Clique no botão **Buscar** ou pressione a tecla **Enter**.
6. Os livros encontrados serão apresentados na tela.

## Estrutura do projeto

BookFinder/
│
├── index.html
├── style.css
├── script.js
├── ramo-bookfinder.png
└── README.md

### Documentação

https://openlibrary.org/developers/api

### Endpoint utilizado

```text
https://openlibrary.org/search.json

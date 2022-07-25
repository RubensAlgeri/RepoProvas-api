# <p align = "center"> RepoProvas</p>

<p align="center">
   <img width="300"src="https://user-images.githubusercontent.com/24623425/36042969-f87531d4-0d8a-11e8-9dee-e87ab8c6a9e3.png"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-Rubens_Algeri-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/Rubens_Algeri/projeto20-repoProvas?color=4dae71&style=flat-square" />
</p>


##  :clipboard: Descrição

No RepoProvas qualquer pessoa pode procurar provas antigas de suas disciplinas e professores ou enviar provas antigas para ajudar os calouros :)

***

## :computer:	 Tecnologias e Conceitos

- REST APIs
- JWTs & refresh tokens
- Node.js
- TypeScript
- Postgresql with prisma

***

## :rocket: Rotas

```yml
POST /sign-up
    - Rota para cadastrar um novo usuário
    - headers: {}
    - body: {
        "email": "lorem@gmail.com",
        "password": "loremipsum"(min:6 char),
        "confirmedPassword": "loremipsum",
    }
```
    
```yml 
POST /sign-in
    - Rota para fazer login
    - headers: {}
    - body: {
    "email": "lorem@gmail.com",
    "password": "loremipsum"
    }
```
```yml
POST /test (autenticada)
    - Rota para cadastrar uma prova
    - headers: { "Authorization": "Bearer $token" }
    - body: {
        "nome": "Lorem ipsum2",
        "pdfUrl": "https://www.lorem.com",
        "categoryId": (id de uma categoria cadastrada),
        "disciplineId": (id de uma disciplina cadastrada),
        "teacherId": (id de um professor cadastrado),
    }
```
    
```yml 
GET /test/discipline (autenticada)
    - Rota para listar todos as provas agrupadas pelas disciplinas
    - headers: { "Authorization": "Bearer $token" }
    - body: {}
```

```yml 
GET /test/teacher (autenticada)
    - Rota para listar todos as provas agrupadas pelos professores
    - headers: { "Authorization": "Bearer $token" }
    - body: {}
```
 
***

## 🏁 Rodando a aplicação

Certifique-se que voce tem a ultima versão estável do [Node.js](https://nodejs.org/en/download/) e [npm](https://www.npmjs.com/) rodando localmente.

Primeiro, faça o clone desse repositório na sua maquina:

```
git clone https://github.com/RubensAlgeri/projeto20-repoProvas
```

Depois, dentro da pasta, rode o seguinte comando para instalar as dependencias.

```
npm install
```

Finalizado o processo, é só inicializar o servidor
```
npm start
```
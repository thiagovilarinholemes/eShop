# Projeto e-Shp Back-end em NodeJS

![](/assets/images/background.png)

[![NPM](https://img.shields.io/github/license/thiagovilarinholemes/project-vuttr-back-end)](https://github.com/thiagovilarinholemes/project-vuttr-back-end/blob/main/LICENSE)

<b>OBS.: </b> <i>Devido o projeto ser construído com o banco de dados NoSQL MongoDB não foi possível disponibilizar a URL para uma Demo.</i>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Indície</summary>
  <ol>
    <li>
      <a href="#sobre-o-projeto">Sobre o projeto</a>
      <ul>
        <li><a href="#frameworks-e-bibliotecas-utilizadas">Frameworks e bibliotecas utilizadas</a></li>
      </ul>
    </li>
    <li>
      <a href="#iniciando-o-projeto">Iniciando o projeto</a>
      <ul>
        <li><a href="#pré-requisitos">Pré requisitos</a></li>
      </ul>
    </li>
    <li>
      <a href="#url">URL</a>
      <ul>
        <li><a href="#autenticação">Autenticação</a></li>
        <li><a href="#categorias">Categorias</a></li>
        <li><a href="#produtos">Produtos</a></li>
        <li><a href="#usuários">Usuários</a></li>
        <li><a href="#ordem-de-compra">Ordem de Compra</a></li>
      </ul>
    </li>
    <li><a href="#licença">Licença</a></li>
    <li><a href="#considerações">Considerações</a></li>
    <li><a href="#contatos">Contatos</a></li>
  </ol>
</details>


<!-- Sobre o projeto -->
## Sobre o projeto

<p>Este projeto tem por finalidade criar um Back-end em NodeJS, com banco de dados NoSQL Mongodb,
para um ecommerce. Suas funcionalidades são: </p>

* Cadastro, listagem, exclusão e autenticação de usuários;

* Cadastro, listagem e exclusão de produtos e categorias;

* Cadastro, listagem e exclusão de Pedidos de compra.

<p>A autenticação foi implementada utilizando token JWT, contendo usuário Administrador do Sistema com acesso completo ao ecommerce, e o usuário Cliente com acesso a listagem de produtos e realização de ordens de compras.</p>

### Frameworks e bibliotecas utilizadas

* [NodeJS](https://nodejs.org/en/)
  * [bcryptjs](https://www.npmjs.com/package/bcryptjs)
  * [body-parser](https://www.npmjs.com/package/body-parser)
  * [cors](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS)
  * [dotenv](https://www.npmjs.com/package/dotenv)
  * [express](https://expressjs.com/pt-br/)
  * [express-jwt](https://www.npmjs.com/package/express-jwt)
  * [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
  * [mongoose](https://mongoosejs.com/)
  * [morgan](https://www.npmjs.com/package/morgan)
  * [multer](https://www.npmjs.com/package/multer)
  * [nodemon](https://www.npmjs.com/package/nodemon)
* [Mongodb](https://www.mongodb.com/cloud/atlas)


<!-- Iniciando o projeto -->
## Iniciando o projeto

Para iniciar o projeto é necessário baixar o repositório e importar para IDE(Eclipse, Intellij, VS Code...) de preferência. 

### Pré requisitos

* [NodeJS](https://nodejs.org/en/)

* Ter uma conta no Mongodb para armanezamento dos dados. Acesse este link para criar uma conta [Mongodb](https://www.mongodb.com/cloud/atlas)

<!-- URL -->
## URL

URL's para acesso a API.

O acesso a listagem de produtos e login no sistema não se faz necessário estar logado:

* GET `/api/v1/products`
* GET `/api/v1/products?categories=categoria1,categoria2,categoria3`


<!-- Autenticação -->
### Autenticação
* POST `/users/login`

  JSON enviado pelo body:
  ```
  {
    "email": "email",
    "password": "senha"
  }
  ```

<b>OBS.: </b> O Token é retornado no body

Para os demais acesso as URL's abaixo é necessário estar logado como Administrador, com a exceção das citadas acima.

<!-- Categorias -->
### Categorias

* GET `/api/v1/categories`
* GET `/api/v1/categories/:id`
* POST `/api/v1/categories`
* PUT `/api/v1/categories/:id`
* DELETE `/api/v1/categories/:id`

  JSON enviado por POST e PUT:
  ```
  {
    "name": "nome",
    "icon": "fa fa-heart",
    "color": "#060606"
  }
  ```
 
<!-- Produtos -->
### Produtos

* GET `/api/v1/products`
* GET `/api/v1/products?categories=categoria1,categoria2,categoria3`
* GET `/api/v1/products/:id`
* POST `/api/v1/products`
* PUT `/api/v1/products/:id`
* DELETE `/api/v1/products/:id`

 <b>OBS.: </b> Para inserir e atualizar um produto se faz necessário usar o `form-data` para envio dos dados devido a upload de imagens


<!-- Usuários -->
### Usuários

* GET `/api/v1/users`
* GET `/api/v1/users/:id`
* POST `/api/v1/users/register`
* PUT `/api/v1/users/:id`
* POST `/api/v1/users/`

  JSON enviado por POST:
  ```
  {
    "name": "nome",
    "email": "email",
    "passwordHash": "password", // Criptografando a senha
    "phone": "telefone",
    "isAdmin": true/false,
    "street": "endereço",
    "vapartment": "número_apartamento_se_for_o_caso,
    "zip": "CEP",
    "city": "cidade",
    "country": "país",
  }
  ```
  
  JSON enviado por PUT, atualização de senha:
  ```
  {
    "newPassword" = "nova_senha";
  }
  ```
 <!-- Ordem de compra -->
### Ordem de compra

* GET `/api/v1/orders`
* GET `/api/v1/orders/:id`
* POST `/api/v1/orders`
* PUT `/api/v1/orders/:id`
* DELETE `/api/v1/orders/:id`
 
  JSON enviado por POST:
  ```
   {
     "orderItems": [
        {
            "quantity": 3,
            "product": "codigo_produto"
        },
        {
            "quantity": 3,
            "product": "codigo_produto"
        }
     ],
        "shippingAddress1": "endereço_entrega_1",
        "shippingAddress2": "endereço_entrega_2",
        "city": "cidade",
        "zip": "CEP",
        "country": "país",
        "phone": "telefone",
        "user": "código_do_usuário"
  }
  ```
  
  JSON enviado por PUT, atualização do status do pedido:
  ```
  {
    "status": "status_pedido",
  }
  ```  
 
<!-- Licença -->
## Licença

Distribuído sob a licença MIT License. Veja a `LICENSE` para mais informações.

<!-- Considerações -->
## Considerações

Além das funcionalidade básicas de um CRUD foram implementadas mais algumas funções que podem ser vistas no códgio fonte. 

Funções como: total de vendas, total de vendas por usuário e total de produtos.

<!-- Contatos -->
## Contatos

Autor: <i>`Thiago Vilarinho Lemes`</i>

Site: [<i>`https://thiagolemes.tech`/</i>](https://thiagolemes.tech/)

Email: <i>`lemes_vilarinho@yahoo.com.br`</i>

Likedin: [<i>`Thiago Vilarinho Lemes`</i>](https://www.linkedin.com/in/thiago-vilarinho-lemes-b1232727/)

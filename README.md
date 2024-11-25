<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CommerceX API</title>
</head>
<body>
  <h1>CommerceX API</h1>
  <p>
    Bem-vindo à <strong>CommerceX</strong>, uma API RESTful desenvolvida para gerenciar um sistema de vendas.
    Esta aplicação foi criada utilizando <a href="https://adonisjs.com/">Adonis.js</a> e fornece funcionalidades
    para gerenciar usuários, clientes, produtos e vendas.
  </p>

  <hr>

  <h2>Índice</h2>
  <ul>
    <li><a href="#funcionalidades">Funcionalidades</a></li>
    <li><a href="#tecnologias">Tecnologias Utilizadas</a></li>
    <li><a href="#execucao">Como Executar o Projeto</a></li>
    <li><a href="#estrutura">Estrutura do Projeto</a></li>
    <li><a href="#documentacao">Documentação da API</a></li>
  </ul>

  <hr>

  <h2 id="funcionalidades">Funcionalidades</h2>
  <p>A API oferece as seguintes funcionalidades:</p>
  <ul>
    <li><strong>Usuários:</strong> Cadastro, autenticação e login.</li>
    <li><strong>Clientes:</strong> CRUD completo e filtro de vendas associadas.</li>
    <li><strong>Produtos:</strong> CRUD completo com suporte a exclusão lógica.</li>
    <li><strong>Vendas:</strong> Cadastro de vendas e associação com clientes e produtos.</li>
  </ul>

  <hr>

  <h2 id="tecnologias">Tecnologias Utilizadas</h2>
  <ul>
    <li><a href="https://adonisjs.com/">Adonis.js</a> (v6)</li>
    <li><a href="https://nodejs.org/">Node.js</a></li>
    <li><a href="https://www.typescriptlang.org/">TypeScript</a></li>
    <li><a href="https://www.mysql.com/">MySQL</a></li>
  </ul>

  <hr>

  <h2 id="execucao">Como Executar o Projeto</h2>
  <h3>Pré-requisitos</h3>
  <ul>
    <li><a href="https://nodejs.org/">Node.js</a> instalado (versão 18 ou superior).</li>
    <li><a href="https://www.mysql.com/">MySQL</a> configurado e em execução.</li>
    <li>Gerenciador de pacotes <strong>npm</strong> ou <strong>yarn</strong>.</li>
  </ul>
  <h3>Passos</h3>
  <ol>
    <li>Clone o repositório:
      <pre><code>git clone https://github.com/seu-usuario/commercex.git
cd commercex
      </code></pre>
    </li>
    <li>Instale as dependências:
      <pre><code>npm install
# ou
yarn install
      </code></pre>
    </li>
    <li>Configure o banco de dados:
      <ul>
        <li>Renomeie o arquivo <code>.env.example</code> para <code>.env</code>.</li>
        <li>Atualize as variáveis de ambiente para corresponder à sua configuração de banco de dados.</li>
      </ul>
    </li>
    <li>Execute as migrações para criar as tabelas no banco:
      <pre><code>node ace migration:run</code></pre>
    </li>
    <li>Inicie o servidor de desenvolvimento:
      <pre><code>node ace serve --watch</code></pre>
    </li>
    <li>Acesse a API em <a href="http://localhost:3333">http://localhost:3333</a>.</li>
  </ol>

  <hr>

  <h2 id="estrutura">Estrutura do Projeto</h2>
  <pre>
commercex/
├── app/
│   ├── Controllers/
│   ├── Models/
│   ├── Validators/
├── config/
├── database/
│   ├── migrations/
├── public/
├── start/
│   ├── routes.ts
├── .env.example
├── package.json
└── README.md
  </pre>

  <hr>

  <h2 id="documentacao">Documentação da API</h2>
  <h3>Documentação via Swagger UI</h3>
  <p>Após diversas tentativas de implementar a documentação utilizando o Swagger de maneira tradicional, enfrentamos dificuldades técnicas que inviabilizaram sua integração completa no contexto do AdonisJS 6 devido a problemas de compatibilidade 
 e erros inesperados.</p> 

  <p>Como alternativa, foi utilizada uma solução provisória por meio do Swagger Editor, cuja documentação pode ser acessada em:</p>
  
  <pre><a href="https://app.swaggerhub.com/apis-docs/AiezerSantos/Commercex_docs/1.0.0">Documentação da API</a></pre>
  
  <h3>Endpoints Principais</h3>
  <table border="1">
    <thead>
      <tr>
        <th>Rota</th>
        <th>Método</th>
        <th>Descrição</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>/signup</td>
        <td>POST</td>
        <td>Cadastro de novos usuários.</td>
      </tr>
      <tr>
        <td>/login</td>
        <td>POST</td>
        <td>Login e geração de token.</td>
      </tr>
      <tr>
        <td>/clients</td>
        <td>GET</td>
        <td>Listar todos os clientes.</td>
      </tr>
      <tr>
        <td>/clients</td>
        <td>POST</td>
        <td>Criar um novo cliente.</td>
      </tr>
      <tr>
        <td>/products</td>
        <td>GET</td>
        <td>Listar todos os produtos.</td>
      </tr>
      <tr>
        <td>/products</td>
        <td>POST</td>
        <td>Criar um novo produto.</td>
      </tr>
      <tr>
        <td>/sales</td>
        <td>POST</td>
        <td>Registrar uma nova venda.</td>
      </tr>
    </tbody>
  </table>
  
</body>
</html>

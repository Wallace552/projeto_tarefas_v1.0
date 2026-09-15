# Task Manager

Aplicação web simples para gerenciamento de tarefas, desenvolvida com **HTML, CSS e JavaScript**, utilizando **IndexedDB** como banco de dados local do navegador.

O projeto foi desenvolvido com foco em aprendizado, principalmente nos conceitos de JavaScript, manipulação do DOM e operações CRUD com IndexedDB.

\---

## Objetivo do projeto

Criar uma aplicação de tarefas que permita:

* Adicionar tarefas;
* Listar tarefas cadastradas;
* Filtrar tarefas por status;
* Marcar tarefas como concluídas;
* Reabrir tarefas concluídas;
* Editar tarefas;
* Cancelar uma edição;
* Excluir tarefas;
* Confirmar a exclusão antes de remover uma tarefa.

A aplicação foi pensada para funcionar **localmente em um único computador**, sem necessidade de servidor, Apache, PHP ou banco de dados externo.

\---

## Tecnologias utilizadas

### HTML

Responsável pela estrutura da página e pelos elementos da interface.

### CSS

Responsável pela aparência da aplicação.

### JavaScript

Responsável pela lógica da aplicação, incluindo:

* Eventos;
* Manipulação do DOM;
* Cadastro e alteração de tarefas;
* Filtros;
* Edição;
* Exclusão;
* Comunicação com o IndexedDB.

### IndexedDB

Banco de dados integrado ao navegador.

Ele permite armazenar os dados localmente, sem necessidade de um servidor.

\---

## Estrutura do projeto

```text
task-manager/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── app.js
    └── database.js
```

### `index.html`

Contém a estrutura da aplicação:

* Formulário;
* Campos da tarefa;
* Botão de salvar;
* Botão de cancelar;
* Botões de filtro;
* Área onde as tarefas são exibidas.

### `css/style.css`

Contém os estilos da aplicação.

### `js/database.js`

Responsável principalmente pela abertura e configuração do IndexedDB.

### `js/app.js`

Contém a lógica principal da aplicação e as funções do CRUD.

\---

# IndexedDB

O banco utilizado pelo projeto se chama:

```text
tarefasDB
```

A aplicação possui um Object Store chamado:

```text
tarefas
```

O Object Store possui:

```javascript
{
    keyPath: "id",
    autoIncrement: true
}
```

Isso significa que o IndexedDB gera automaticamente um `id` para cada tarefa.

\---

## Estrutura de uma tarefa

Cada tarefa armazenada possui esta estrutura:

```javascript
{
    id: 1,
    titulo: "Minha primeira tarefa",
    descricao: "Descrição da tarefa",
    data: "2026-09-15",
    status: "pendente"
}
```

### Campos

|Campo|Descrição|
|-|-|
|`id`|Identificador único gerado pelo IndexedDB|
|`titulo`|Nome da tarefa|
|`descricao`|Descrição da tarefa|
|`data`|Data associada à tarefa|
|`status`|Estado atual da tarefa|

Os status utilizados internamente são:

```text
pendente
concluida
```

É importante manter esses valores consistentes, pois os filtros e outras partes da aplicação dependem deles.

Por exemplo:

```javascript
tarefa.status === "pendente"
```

é diferente de:

```javascript
tarefa.status === "Pendente"
```

JavaScript diferencia letras maiúsculas e minúsculas.

\---

# CRUD

O projeto utiliza as quatro operações básicas de persistência de dados:

|CRUD|IndexedDB|Função no projeto|
|-|-|-|
|Create|`add()`|`adicionarTarefa()`|
|Read|`get()` / `getAll()`|`listarTarefas()`|
|Update|`put()`|`atualizarTarefa()`|
|Delete|`delete()`|`excluirTarefa()`|

\---

# Adicionando uma tarefa

A função responsável pelo cadastro é:

```javascript
function adicionarTarefa(titulo, descricao, data, status) {
    const transaction = db.transaction("tarefas", "readwrite");
    const store = transaction.objectStore("tarefas");

    const tarefa = {
        titulo: titulo,
        descricao: descricao,
        data: data,
        status: status
    };

    const request = store.add(tarefa);

    request.onsuccess = function () {
        console.log("Tarefa adicionada com sucesso!");
        listarTarefas();
    };

    request.onerror = function (event) {
        console.error(
            "Erro ao adicionar tarefa:",
            event.target.error
        );
    };
}
```

O fluxo é:

```text
Formulário
   ↓
adicionarTarefa()
   ↓
transaction
   ↓
Object Store "tarefas"
   ↓
store.add()
   ↓
IndexedDB
```

\---

# Listando tarefas

A função:

```javascript
listarTarefas()
```

utiliza:

```javascript
store.getAll()
```

para recuperar as tarefas armazenadas.

As tarefas são exibidas da mais recente para a mais antiga utilizando:

```javascript
reverse()
```

Depois disso, a aplicação aplica o filtro atualmente selecionado.

\---

# Filtros

Existem três filtros:

```text
Todas
Pendentes
Concluídas
```

O estado atual do filtro é armazenado em:

```javascript
let filtroAtual = "todas";
```

Os valores possíveis são:

```text
todas
pendentes
concluidas
```

A filtragem é feita com:

```javascript
tarefas.filter(...)
```

Exemplo:

```javascript
if (filtroAtual === "pendentes") {
    return tarefa.status === "pendente";
}
```

O filtro não altera os dados do banco.

Ele apenas decide quais tarefas serão exibidas na tela.

\---

# Filtro visual

Além de filtrar as tarefas, o botão selecionado recebe a classe:

```text
filtro-ativo
```

A função responsável por isso é:

```javascript
atualizarFiltroVisual()
```

Ela remove a classe dos três botões e depois adiciona ao botão correspondente ao filtro atual.

Isso cria uma indicação visual de qual filtro está selecionado.

\---

# Concluir e reabrir tarefas

A função:

```javascript
alterarStatusTarefa(id)
```

busca a tarefa no banco utilizando:

```javascript
store.get(id)
```

Depois verifica o status atual.

Se estiver:

```text
concluida
```

altera para:

```text
pendente
```

Caso contrário, altera para:

```text
concluida
```

Depois utiliza:

```javascript
store.put(tarefa)
```

para salvar a alteração.

Assim, o mesmo botão pode funcionar como:

```text
Concluir
```

ou:

```text
Reabrir
```

dependendo do status atual.

\---

# Edição de tarefas

A edição foi dividida em duas responsabilidades.

## Preparar a edição

A função:

```javascript
prepararEdicao(tarefa)
```

coloca os dados da tarefa no formulário.

Também guarda o `id` da tarefa:

```javascript
tarefaEditando = tarefa.id;
```

E altera o texto do botão:

```text
Adicionar tarefa
```

para:

```text
Salvar alterações
```

Também torna o botão:

```text
Cancelar
```

visível.

\---

## Atualizar a tarefa

Depois que o formulário é enviado, a função:

```javascript
atualizarTarefa(id, titulo, descricao, data, status)
```

cria novamente o objeto da tarefa mantendo seu `id` e utiliza:

```javascript
store.put(tarefa)
```

O `put()` é utilizado porque queremos atualizar um objeto que já existe.

\---

# Cancelar edição

A variável:

```javascript
let tarefaEditando = null;
```

indica se estamos ou não editando uma tarefa.

Quando:

```javascript
tarefaEditando === null
```

estamos adicionando uma nova tarefa.

Quando existe um `id` nessa variável, estamos editando uma tarefa existente.

A função:

```javascript
cancelarEdicao()
```

faz:

```javascript
tarefaEditando = null;
```

Depois:

* Limpa o formulário;
* Volta o botão para "Adicionar tarefa";
* Esconde o botão "Cancelar".

\---

# Exclusão

A função:

```javascript
excluirTarefa(id)
```

abre uma transação de escrita e utiliza:

```javascript
store.delete(id)
```

para remover a tarefa do IndexedDB.

Depois da exclusão, a lista é atualizada com:

```javascript
listarTarefas();
```

\---

# Confirmação antes de excluir

Antes de executar a exclusão, o botão utiliza:

```javascript
confirm()
```

Exemplo:

```javascript
const confirmar = confirm(
    "Tem certeza que deseja excluir esta tarefa?"
);

if (confirmar) {
    excluirTarefa(tarefa.id);
}
```

O `confirm()` retorna:

```text
true
```

quando o usuário confirma.

Ou:

```text
false
```

quando o usuário cancela.

Assim, a função responsável pelo banco continua cuidando apenas da exclusão, enquanto a interface cuida da confirmação.

\---

# IndexedDB é assíncrono

Um dos principais conceitos aprendidos durante o desenvolvimento foi que a abertura do IndexedDB é **assíncrona**.

A variável:

```javascript
let db;
```

inicialmente não possui a conexão com o banco.

O banco é aberto através de:

```javascript
const request = indexedDB.open("tarefasDB", 1);
```

Quando a abertura termina com sucesso:

```javascript
request.onsuccess = function (event) {
    db = event.target.result;
};
```

Por isso, tentar executar:

```javascript
db.transaction(...)
```

antes de o banco estar pronto causa erro.

\---

# Evento `bancoPronto`

Para evitar esse problema, foi criado um evento personalizado:

```javascript
document.dispatchEvent(new Event("bancoPronto"));
```

Depois, o `app.js` aguarda esse evento:

```javascript
document.addEventListener("bancoPronto", function(){
    atualizarFiltroVisual();
    listarTarefas();
});
```

Dessa forma:

```text
Abrir IndexedDB
       ↓
Banco pronto
       ↓
dispara "bancoPronto"
       ↓
listarTarefas()
```

Isso garante que a aplicação só tente acessar o banco depois que ele estiver disponível.

\---

# Conceitos de JavaScript aprendidos

Durante o desenvolvimento foram trabalhados vários conceitos importantes.

## Variáveis

Exemplo:

```javascript
let filtroAtual = "todas";
```

## Funções

Exemplo:

```javascript
function adicionarTarefa(...) {
    ...
}
```

## Condicionais

Exemplo:

```javascript
if (tarefa.status === "concluida") {
    ...
}
```

## Eventos

Exemplo:

```javascript
botaoExcluir.addEventListener("click", function(){
    ...
});
```

## DOM

Exemplo:

```javascript
document.getElementById("titulo")
```

e:

```javascript
document.createElement("div")
```

## Arrays

Exemplos:

```javascript
reverse()
```

```javascript
filter()
```

```javascript
forEach()
```

## Objetos

As tarefas são representadas como objetos:

```javascript
const tarefa = {
    titulo: titulo,
    descricao: descricao,
    data: data,
    status: status
};
```

\---

# Problemas encontrados durante o desenvolvimento

## `db` estava undefined

Erro:

```text
Cannot read properties of undefined (reading 'transaction')
```

### Causa

A aplicação tentou acessar o banco antes de o IndexedDB terminar de abrir.

### Solução

Criamos o evento:

```text
bancoPronto
```

para garantir que o banco estivesse disponível antes de executar operações.

\---

## Status não aparecia no filtro

Em determinado momento uma tarefa era salva como:

```text
Pendente
```

enquanto o filtro procurava:

```text
pendente
```

### Causa

JavaScript diferencia maiúsculas e minúsculas.

### Solução

Padronizar os valores internos:

```text
pendente
concluida
```

\---

## `addEventListener` em elemento `null`

Também ocorreram erros ao tentar adicionar eventos a elementos que não existiam ou cujo `id` estava diferente no HTML.

Exemplo:

```javascript
document.getElementById("botao-cancelar")
```

retornava:

```text
null
```

### Solução

Conferir se o `id` usado no JavaScript era exatamente igual ao `id` existente no HTML.

\---

## Funções com o mesmo nome

Durante a implementação da edição houve duas funções com o mesmo nome:

```javascript
editarTarefa()
```

Em JavaScript, a segunda declaração substitui a primeira.

### Solução

Separar as responsabilidades usando nomes diferentes:

```text
prepararEdicao()
atualizarTarefa()
```

Isso deixou o código mais claro.

\---

# Como executar

O projeto não precisa de:

* Apache;
* PHP;
* MySQL;
* SQLite;
* servidor web.

A aplicação utiliza o IndexedDB fornecido pelo próprio navegador.

Basta abrir:

```text
index.html
```

em um navegador moderno.

\---

# Onde os dados ficam?

As tarefas ficam armazenadas no **IndexedDB do navegador**.

Isso significa que os dados não estão dentro dos arquivos:

```text
index.html
app.js
database.js
```

Eles ficam armazenados separadamente pelo navegador.

Portanto, copiar apenas os arquivos do projeto para outro computador **não copia automaticamente as tarefas existentes**.

O outro computador terá seu próprio banco IndexedDB.

\---

# 🔐 Escopo atual

O projeto foi planejado inicialmente para uso:

* Local;
* Em um único computador;
* Sem servidor;
* Sem sistema de usuários;
* Sem autenticação;
* Sem banco de dados remoto.

É uma aplicação adequada para estudo e para gerenciamento pessoal simples.

\---

# 🚀 Próximos passos possíveis

A aplicação já possui uma base funcional de CRUD.

Algumas evoluções possíveis, em ordem de dificuldade:

1. Melhorar a apresentação das datas;
2. Melhorar o CSS e a interface;
3. Adicionar contador de tarefas;
4. Adicionar pesquisa por título;
5. Ordenar tarefas por data;
6. Adicionar confirmação para ações importantes;
7. Melhorar mensagens de sucesso/erro;
8. Criar uma interface mais responsiva;
9. Organizar melhor o código JavaScript;
10. Adicionar exportação/importação das tarefas;
11. Versionar o projeto com Git;
12. Publicar uma versão estática do projeto.

\---

# 📚 Objetivo de aprendizado

O objetivo principal deste projeto não é apenas criar uma lista de tarefas.

A ideia é utilizar o projeto para aprender, na prática:

```text
HTML
 ↓
CSS
 ↓
JavaScript
 ↓
DOM
 ↓
Eventos
 ↓
Objetos
 ↓
Arrays
 ↓
CRUD
 ↓
IndexedDB
 ↓
Organização de código
 ↓
Git
```

A aplicação pode continuar sendo expandida gradualmente, adicionando novas funcionalidades conforme novos conceitos forem aprendidos.

\---

## Status do projeto

**Funcionalidade atual: CRUD local de tarefas utilizando IndexedDB.**

Principais funcionalidades implementadas:

* \[x] Criar tarefa
* \[x] Listar tarefas
* \[x] Filtrar tarefas
* \[x] Concluir tarefa
* \[x] Reabrir tarefa
* \[x] Editar tarefa
* \[x] Cancelar edição
* \[x] Excluir tarefa
* \[x] Confirmar exclusão
* \[x] Persistência local com IndexedDB

\---

## Autor

Projeto desenvolvido como estudo prático de desenvolvimento web com JavaScript e IndexedDB.

Wallace L.M.L.


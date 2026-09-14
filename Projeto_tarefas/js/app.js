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
        console.error("Erro ao adicionar tarefa:", event.target.error);
    };
}

function listarTarefas(){
	const transaction = db.transaction("tarefas", "readonly");
	
	const store = transaction.objectStore("tarefas");
	
	const request = store.getAll();
	
	
	request.onsuccess = function(){
		
		const tarefas = request.result;
		const listarTarefas = document.getElementById("lista-tarefas");
		const lista = document.getElementById("lista-tarefas");
		lista.innerHTML = "";
		
		
		tarefas.forEach(function(tarefa){
			const elemento = document.createElement("div");
			elemento.innerHTML = `
			<p>
		<strong>${tarefa.titulo}</strong>
		<br>
		Descrição:${tarefa.descricao}
		<br>
		Data: ${tarefa.data}
		<br>
		Status: ${tarefa.status}
		
		<button class="botao-excluir">Excluir</button>
		<button class="botao-concluir">${tarefa.status === "concluida" ? "Reabrir" : "Concluir"}</button>
		<button class="botao-editar">Editar</button>
			</p>`;
			
		const botaoExcluir = elemento.querySelector(".botao-excluir");
		botaoExcluir.addEventListener("click", function(){
			excluirTarefa(tarefa.id);
		});
		
		const botaoConcluir = elemento.querySelector(".botao-concluir");
		botaoConcluir.addEventListener("click", function(){
		alterarStatusTarefa(tarefa.id);
		
		console.log("Botao Concluir clicado");
		});
		
		const botaoEditar = elemento.querySelector(".botao-editar");
		botaoEditar.addEventListener("click", function(){
			prepararEdicao(tarefa);
			console.log("BOTAO EDITAR CLICADO");
		});
			
			lista.appendChild(elemento);
		});
		
	
	};
	
	request.onerror = function(event){
		console.error(
		"Erro ao buscar tarefas:",
		event.target.error
		
		);
	};
	
};

//atualiza a tarefa no banco, faz a função de UPDATE//
function atualizarTarefa(id, titulo, descricao, data, status) {

    const transaction = db.transaction("tarefas", "readwrite");

    const store = transaction.objectStore("tarefas");

    const tarefa = {
		id: id,
		titulo: titulo,
        descricao: descricao,
        data: data,
        status: status
    };

    const request = store.put(tarefa);

    request.onsuccess = function () {
        console.log("Tarefa alterada com sucesso!");
    };

    request.onerror = function (event) {
        console.error(
		"Erro ao adicionar tarefa:",
		event.target.error);
    };
	
}

function excluirTarefa(id){
	
	const transaction = db.transaction("tarefas","readwrite"); //da as ações de ler e escrever a tarefa no banco
	const store = transaction.objectStore("tarefas"); //seleciona a tabela correta do banco para deletar
	
	const request = store.delete(id); //deleta a tarefa selecionada pelo ID
	
	request.onsuccess = function (){
		console.log("Tarefa deletada com sucesso!");
		listarTarefas();
	};
	
	request.onerror = function(event){
		console.log("Erro ao excluir tarefa", event.target.error);
	};
	
};

function alterarStatusTarefa(id){
	
const transaction = db.transaction("tarefas", "readwrite");
const store = transaction.objectStore("tarefas");
	
	const request = store.get(id);
	
	request.onsuccess = function(){
		const tarefa = request.result;
		
			if(tarefa.status === "concluida"){
			tarefa.status = "pendente";
			
			}
			else{tarefa.status = "concluida";
			}
		
		const requestPut = store.put(tarefa);
		requestPut.onsuccess = function(){
		console.log("Tarefa concluída com sucesso!");
		
		listarTarefas();
		};	
	};
	request.onerror = function(event){
		console.error("Erro ao alterar status:", event.target.error)
	};
};

function editarTarefa(tarefa){
	tarefaEditando = tarefa.id;
	
	document.getElementById("titulo").value = tarefa.titulo;
	document.getElementById("descricao").value = tarefa.descricao;
	document.getElementById("data").value = tarefa.data;
	document.getElementById("status").value = tarefa.status;
	
};

function prepararEdicao(tarefa){
	
	tarefaEditando = tarefa.id;
	
	document.getElementById("titulo").value = tarefa.titulo;
	document.getElementById("descricao").value = tarefa.descricao;
	document.getElementById("data").value = tarefa.data;
	document.getElementById("status").value = tarefa.status;
	
	document.getElementById("botao-salvar").textContent = "Salvar alterações";
	
};
// Abaixo variaveis declaradas //


let tarefaEditando = null; //VARIAVEL PARA GUARDAR O ID DA TAREFA QUE ESTA SENDO EDITADA//

const formulario = document.getElementById("form-tarefa");
	formulario.addEventListener("submit", function (event) {
		
	event.preventDefault();
	
	const titulo = document.getElementById("titulo").value;
	const descricao = document.getElementById("descricao").value;
	const data = document.getElementById("data").value;
	const status = document.getElementById("status").value;
		if(tarefaEditando === null){
			adicionarTarefa(titulo, descricao, data, status);
		}else{
			atualizarTarefa(
			tarefaEditando,
			titulo,
			descricao,
			data,
			status
			);
			tarefaEditando = null;
		}
	
});

const botaoListar = document.getElementById("botao-listar");
		botaoListar.addEventListener("click", function(){
			console.log("BOTÃO LISTAR FOI CLICADO");
			listarTarefas();
		});



	

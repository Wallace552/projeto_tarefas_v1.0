
// Abaixo variaveis declaradas //
let tarefaEditando = null;
let filtroAtual = "todas";
const formulario = document.getElementById("form-tarefa");
const botaoCancelar = document.getElementById("botao-cancelar");
//variaveis dos filtros da lista de tarefas//
const filtroTodas = document.getElementById("filtro-todas");
const filtroPendentes = document.getElementById("filtro-pendentes");
const filtroConcluidas = document.getElementById("filtro-concluidas");

filtroTodas.addEventListener("click", function(){
					filtroAtual = "todas";
					listarTarefas();
					atualizarFiltroVisual();
				});
filtroPendentes.addEventListener("click", function(){
					filtroAtual = "pendentes";
					//console.log(filtroAtual);
					listarTarefas();
					atualizarFiltroVisual();
				});
filtroConcluidas.addEventListener("click", function(){
					filtroAtual = "concluidas";
					listarTarefas();
					atualizarFiltroVisual();
				});

function atualizarFiltroVisual (){
	filtroTodas.classList.remove("filtro-ativo");
	filtroPendentes.classList.remove("filtro-ativo");
	filtroConcluidas.classList.remove("filtro-ativo");
	
	if(filtroAtual === "todas"){
		filtroTodas.classList.add("filtro-ativo");
	}if(filtroAtual === "pendentes"){
		filtroPendentes.classList.add("filtro-ativo");
	}if(filtroAtual === "concluidas"){
		filtroConcluidas.classList.add("filtro-ativo");	
	}
};

function adicionarTarefa(titulo, descricao, data, status) {

    const transaction = db.transaction("tarefas", "readwrite");

    const store = transaction.objectStore("tarefas");

    const tarefa = {
		titulo: titulo,
        descricao: descricao,
        data: data,
        status: status
    };
	console.log("Tarea que esta sendo add:", tarefa);
    const request = store.add(tarefa);

    request.onsuccess = function () {
        console.log("Tarefa adicionada com sucesso!");
		listarTarefas();
    };

    request.onerror = function (event) {
        console.error("Erro ao adicionar tarefa:", event.target.error);
    };
}

// usada para criar a lista de tarefas//
function listarTarefas(){
	const transaction = db.transaction("tarefas", "readonly");
	const store = transaction.objectStore("tarefas");
	const request = store.getAll();
	
	
	request.onsuccess = function(){
		
		const tarefas = request.result.reverse();
		const lista = document.getElementById("lista-tarefas");
		const tarefasFiltradas = tarefas.filter(function(tarefa){
			if(filtroAtual === "pendentes"){
				return tarefa.status === "pendente"
				
			}if(filtroAtual === "concluidas"){
				return tarefa.status === "concluida"
			}
			return true;
		});
		
		lista.innerHTML = "";
				
		tarefasFiltradas.forEach(function(tarefa){
			const textoBotaoStatus = tarefa.status === "concluida" ? "Reabir" : "Concluir";
			const textoStatus = tarefa.status === "concluida" ? "Concluída ✓" : "Pendente";
			const elemento = document.createElement("div");
			elemento.classList.add("tarefa");
			
			if (tarefa.status === "concluida") {
			elemento.classList.add("concluida");
			}
			elemento.innerHTML = `
			<p>
		<strong>${tarefa.titulo}</strong>
		<br>
		Descrição:${tarefa.descricao}
		<br>
		Data: ${tarefa.data}
		<br>
		Status: ${textoStatus}
		<br>
		
		<button class="botao-editar">Editar</button>
		<button class="botao-concluir">${textoBotaoStatus}</button>
		<button class="botao-excluir">Excluir</button>
			</p>`;
			
			
		const botaoExcluir = elemento.querySelector(".botao-excluir");
		botaoExcluir.addEventListener("click", function(){
			confirmar = confirm ("Tem certeza que deseja excluir esta tarefa?");
			if(confirmar){excluirTarefa(tarefa.id);}
		});
			
		const botaoConcluir = elemento.querySelector(".botao-concluir");
		botaoConcluir.addEventListener("click", function(){
		alterarStatusTarefa(tarefa.id);
		
		//console.log("Botao Concluir clicado");
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

function prepararEdicao(tarefa){
	
	tarefaEditando = tarefa.id;
	
	document.getElementById("titulo").value = tarefa.titulo;
	document.getElementById("descricao").value = tarefa.descricao;
	document.getElementById("data").value = tarefa.data;
	document.getElementById("status").value = tarefa.status;
	
	document.getElementById("botao-salvar").textContent = "Salvar alterações";
	document.getElementById("botao-cancelar").hidden = false;
};

function cancelarEdicao(){
	tarefaEditando = null;
	document.getElementById("form-tarefa").reset();
	document.getElementById("botao-salvar").textContent = "Adicionar tarefa";
	
	document.getElementById("botao-cancelar").hidden = true;
};

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

botaoCancelar.addEventListener("click", function(){
			cancelarEdicao();
			console.log("Edição Cancelada com sucesso");
		});

document.addEventListener("bancoPronto", function(){
	listarTarefas();
});
	

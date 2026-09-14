let db;

const request = indexedDB.open("tarefasDB", 1);

request.onupgradeneeded = function (event) {

    db = event.target.result;

    db.createObjectStore("tarefas", {
        keyPath: "id",
        autoIncrement: true
    });

    console.log("Object Store 'tarefas' criada!");
};

request.onsuccess = function (event) {

    db = event.target.result;

    console.log("Banco aberto com sucesso!");

    // Só para teste
    console.log("Conexão:", db);
};

request.onerror = function (event) {

    console.error(
        "Erro ao abrir o banco:",
        event.target.error
    );
};
try {
	$pdo = new PDO ('sqlite:./Desktop/Projeto_tarefas/config/tarefas.sqlite');
	
	$pdo->SetAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	echo "Conexão realizada com Sucesso!";
} catch (PDOException $e) {
	echo "Erro de Conexão: " . $e->getMessage();
}
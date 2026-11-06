<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Método não permitido.']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$whatsapp = trim($dados['whatsapp'] ?? '');
$data_nascimento = trim($dados['data_nascimento'] ?? '');

if (empty($nome) || empty($email) || empty($whatsapp) || empty($data_nascimento)) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Preencha todos os campos obrigatórios.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Formato de e-mail inválido.']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO clientes (nome, email, whatsapp, data_nascimento) VALUES (:nome, :email, :whatsapp, :data_nascimento)");
    $stmt->execute([
        ':nome' => $nome,
        ':email' => $email,
        ':whatsapp' => $whatsapp,
        ':data_nascimento' => $data_nascimento
    ]);

    echo json_encode(['sucesso' => true, 'mensagem' => 'Cliente cadastrado com sucesso!']);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Este e-mail já está cadastrado.']);
    } else {
        http_response_code(500);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao salvar cadastro.']);
    }
}
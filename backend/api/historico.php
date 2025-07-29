<?php
// backend/api/historico.php

// Mostrar erros em ambiente de desenvolvimento
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Cabeçalhos
header('Content-Type: application/json');

// Conexão com o banco
include_once('../config/db.php');

// Função: listar histórico de uma palavra
function listarHistorico($uuid) {
    global $pdo;

    try {
        $stmt = $pdo->prepare("
            SELECT id, palavra_uuid, data_alteracao, usuario, acao, dados_anteriores, dados_novos
            FROM historico_palavras
            WHERE palavra_uuid = :uuid
            ORDER BY data_alteracao DESC
        ");
        $stmt->execute([':uuid' => $uuid]);
        $historico = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Decodificar JSONs
        foreach ($historico as &$item) {
            $item['dados_anteriores'] = $item['dados_anteriores'] ? json_decode($item['dados_anteriores'], true) : null;
            $item['dados_novos'] = $item['dados_novos'] ? json_decode($item['dados_novos'], true) : null;
        }

        echo json_encode($historico);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Erro ao buscar histórico', 'error' => $e->getMessage()]);
    }
}

// Validação de parâmetros
$uuid = $_GET['palavra_uuid'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $uuid) {
    listarHistorico($uuid);
    exit;
}

// Rota inválida
http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Parâmetro "palavra_uuid" obrigatório']);

<?php
// backend/api/palavras.php

// Mostrar erros (apenas em ambiente de desenvolvimento)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Cabeçalhos
header('Content-Type: application/json');

// Conexão
include_once('../config/db.php');

// Função: Listar palavras
function listarPalavras() {
    global $pdo;
    try {
        $stmt = $pdo->query("SELECT * FROM palavras");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Erro ao listar palavras', 'error' => $e->getMessage()]);
        exit;
    }
}

// Função: Importar palavras com upsert
function importarPalavras($palavras) {
    global $pdo;

    if (!is_array($palavras)) {
        return ['status' => 'error', 'message' => 'Dados inválidos (esperado array)'];
    }

    $sql = "
        INSERT INTO palavras (uuid, termo, classe, denotativo, conotacoes, registro, traducao, etimologia, updated_at)
        VALUES (:uuid, :termo, :classe, :denotativo, :conotacoes, :registro, :traducao, :etimologia, :updated_at)
        ON DUPLICATE KEY UPDATE 
            termo = IF(VALUES(updated_at) > updated_at, VALUES(termo), termo),
            classe = IF(VALUES(updated_at) > updated_at, VALUES(classe), classe),
            denotativo = IF(VALUES(updated_at) > updated_at, VALUES(denotativo), denotativo),
            conotacoes = IF(VALUES(updated_at) > updated_at, VALUES(conotacoes), conotacoes),
            registro = IF(VALUES(updated_at) > updated_at, VALUES(registro), registro),
            traducao = IF(VALUES(updated_at) > updated_at, VALUES(traducao), traducao),
            etimologia = IF(VALUES(updated_at) > updated_at, VALUES(etimologia), etimologia),
            updated_at = GREATEST(updated_at, VALUES(updated_at))
    ";

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare($sql);

        foreach ($palavras as $p) {
            if (!empty($p['deleted'])) {
                // Remover do banco se marcado como excluído
                $stmtDelete = $pdo->prepare("DELETE FROM palavras WHERE uuid = :uuid");
                $stmtDelete->execute([':uuid' => $p['uuid']]);
                continue;
            }
            
            $updatedAt = $p['updated_at'] ?? null;
            if (!$updatedAt || !strtotime($updatedAt)) {
                $updatedAt = date('Y-m-d H:i:s');
            }

            $stmt = $pdo->prepare("
                INSERT INTO palavras (uuid, termo, classe, denotativo, conotacoes, registro, traducao, etimologia, updated_at)
                VALUES (:uuid, :termo, :classe, :denotativo, :conotacoes, :registro, :traducao, :etimologia, :updated_at)
                ON DUPLICATE KEY UPDATE 
                    termo = IF(VALUES(updated_at) > updated_at, VALUES(termo), termo),
                    classe = IF(VALUES(updated_at) > updated_at, VALUES(classe), classe),
                    denotativo = IF(VALUES(updated_at) > updated_at, VALUES(denotativo), denotativo),
                    conotacoes = IF(VALUES(updated_at) > updated_at, VALUES(conotacoes), conotacoes),
                    registro = IF(VALUES(updated_at) > updated_at, VALUES(registro), registro),
                    traducao = IF(VALUES(updated_at) > updated_at, VALUES(traducao), traducao),
                    etimologia = IF(VALUES(updated_at) > updated_at, VALUES(etimologia), etimologia),
                    updated_at = GREATEST(updated_at, VALUES(updated_at));
            ");

            $stmt->execute([
            ':uuid' => $p['uuid'],
            ':termo' => $p['termo'],
            ':classe' => $p['classe'],
            ':denotativo' => $p['denotativo'],
            ':conotacoes' => $p['conotacoes'],
            ':registro' => $p['registro'],
            ':traducao' => $p['traducao'],
            ':etimologia' => $p['etimologia'],
            ':updated_at' => $updatedAt
            ]);
        }

        $pdo->commit();
        return ['status' => 'success', 'message' => 'Sincronização concluída com sucesso'];

    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        return ['status' => 'error', 'message' => 'Erro ao importar palavras', 'error' => $e->getMessage()];
    }
}

// Roteamento
$acao = $_GET['acao'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $acao === '') {
    echo json_encode(listarPalavras());
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $acao === 'importar') {
    $input = file_get_contents('php://input');
    $dados = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'JSON malformado']);
        exit;
    }

    echo json_encode(importarPalavras($dados));
    exit;
}

// Rota inválida
http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Rota ou método inválido']);

<?php
require_once '../config/db.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $sql = "INSERT INTO palavras (termo, classe_gramatical, significado_denotativo, conotacoes, registro_uso, traducao)
            VALUES (:termo, :classe, :denotativo, :conotacoes, :registro, :traducao)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':termo' => $data['termo'],
        ':classe' => $data['classe'],
        ':denotativo' => $data['denotativo'],
        ':conotacoes' => $data['conotacoes'],
        ':registro' => $data['registro'],
        ':traducao' => $data['traducao']
    ]);
    echo json_encode(['status' => 'ok', 'id' => $pdo->lastInsertId()]);
}

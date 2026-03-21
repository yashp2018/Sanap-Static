<?php
require_once __DIR__ . '/../../config/database.php';
setCorsHeaders();

if (session_status() === PHP_SESSION_NONE) session_start();

if (empty($_SESSION['user_id'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated'], 401);
}

// Optionally re-fetch fresh user data from DB
$pdo  = getDBConnection();
$stmt = $pdo->prepare("SELECT id, name, email, phone, role, status FROM users WHERE id = :id");
$stmt->execute([':id' => $_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user || $user['status'] !== 'active') {
    // User deleted or deactivated — kill session
    session_destroy();
    jsonResponse(['success' => false, 'message' => 'Session invalid'], 401);
}

jsonResponse([
    'success' => true,
    'user'    => [
        'id'    => (int) $user['id'],
        'name'  => $user['name'],
        'email' => $user['email'],
        'phone' => $user['phone'],
        'role'  => $user['role'],
    ],
]);

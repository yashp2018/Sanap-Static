<?php
require_once __DIR__ . '/../../config/database.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input    = getInput();
$login    = sanitize($input['email'] ?? '');   // accepts email OR phone
$password = $input['password'] ?? '';

if (empty($login) || empty($password)) {
    jsonResponse(['success' => false, 'message' => 'Email/phone and password are required'], 400);
}

$pdo = getDBConnection();

// Support login by email OR phone
$stmt = $pdo->prepare("
    SELECT id, name, email, phone, password, role, status
    FROM users
    WHERE (email = :login OR phone = :login)
    LIMIT 1
");
$stmt->execute([':login' => $login]);
$user = $stmt->fetch();

// Use constant-time comparison to prevent timing attacks
if (!$user || !password_verify($password, $user['password'])) {
    jsonResponse(['success' => false, 'message' => 'Invalid credentials'], 401);
}

if ($user['status'] !== 'active') {
    jsonResponse(['success' => false, 'message' => 'Account is inactive. Contact support.'], 403);
}

// ── Start session ────────────────────────────────────────────────
if (session_status() === PHP_SESSION_NONE) session_start();
session_regenerate_id(true);   // prevent session fixation
$_SESSION['user_id']   = (int) $user['id'];
$_SESSION['user_name'] = $user['name'];
$_SESSION['user_role'] = $user['role'];

// Rehash if needed (future-proofs password algorithm upgrades)
if (password_needs_rehash($user['password'], PASSWORD_BCRYPT, ['cost' => 12])) {
    $newHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    $pdo->prepare("UPDATE users SET password = :p WHERE id = :id")
        ->execute([':p' => $newHash, ':id' => $user['id']]);
}

jsonResponse([
    'success' => true,
    'message' => 'Login successful',
    'user'    => [
        'id'    => (int) $user['id'],
        'name'  => $user['name'],
        'email' => $user['email'],
        'phone' => $user['phone'],
        'role'  => $user['role'],
    ],
]);

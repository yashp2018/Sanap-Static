<?php
require_once __DIR__ . '/../../config/database.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = getInput();

$name     = sanitize($input['name']     ?? '');
$phone    = sanitize($input['phone']    ?? '');
$email    = sanitize($input['email']    ?? '');
$password = $input['password']          ?? '';
$address  = sanitize($input['address']  ?? '');

// ── Validation ───────────────────────────────────────────────────
if (empty($name) || empty($phone) || empty($password)) {
    jsonResponse(['success' => false, 'message' => 'Name, phone and password are required'], 400);
}

if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Invalid email format'], 400);
}

if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
    jsonResponse(['success' => false, 'message' => 'Invalid Indian phone number'], 400);
}

if (strlen($password) < 6) {
    jsonResponse(['success' => false, 'message' => 'Password must be at least 6 characters'], 400);
}

if (strlen($name) < 2 || strlen($name) > 100) {
    jsonResponse(['success' => false, 'message' => 'Name must be 2–100 characters'], 400);
}

// ── Duplicate check ──────────────────────────────────────────────
$pdo = getDBConnection();

$checkSql = 'SELECT id FROM users WHERE phone = :phone' .
            (!empty($email) ? ' OR email = :email' : '');
$checkStmt = $pdo->prepare($checkSql);
$checkStmt->bindValue(':phone', $phone);
if (!empty($email)) $checkStmt->bindValue(':email', $email);
$checkStmt->execute();

if ($checkStmt->fetch()) {
    jsonResponse(['success' => false, 'message' => 'Phone or email already registered'], 409);
}

// ── Insert ───────────────────────────────────────────────────────
$hashed = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

$stmt = $pdo->prepare("
    INSERT INTO users (name, email, phone, password, address, role, status)
    VALUES (:name, :email, :phone, :password, :address, 'customer', 'active')
    RETURNING id
");
$stmt->execute([
    ':name'     => $name,
    ':email'    => $email ?: null,
    ':phone'    => $phone,
    ':password' => $hashed,
    ':address'  => $address ?: null,
]);
$userId = (int) $stmt->fetchColumn();

// ── Start session ────────────────────────────────────────────────
if (session_status() === PHP_SESSION_NONE) session_start();
session_regenerate_id(true);
$_SESSION['user_id']   = $userId;
$_SESSION['user_name'] = $name;
$_SESSION['user_role'] = 'customer';

jsonResponse([
    'success' => true,
    'message' => 'Registration successful',
    'user'    => [
        'id'    => $userId,
        'name'  => $name,
        'email' => $email,
        'phone' => $phone,
        'role'  => 'customer',
    ],
], 201);

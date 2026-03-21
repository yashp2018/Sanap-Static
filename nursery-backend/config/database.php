<?php
/**
 * PostgreSQL Database Connection — PDO
 * Sanap Hi-Tech Nursery
 */

define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'nursery_db');
define('DB_USER', 'postgres');
define('DB_PASS', 'yourpassword'); // ← Change in production

define('FRONTEND_ORIGIN', 'http://localhost:5173'); // ← Change to your domain in production

// ── Session config (must be before session_start) ──────────────
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Lax');
ini_set('session.use_strict_mode', 1);
// ini_set('session.cookie_secure', 1); // Uncomment when using HTTPS

// ── CORS headers ────────────────────────────────────────────────
function setCorsHeaders(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === FRONTEND_ORIGIN) {
        header("Access-Control-Allow-Origin: $origin");
    }
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=UTF-8');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// ── DB connection ────────────────────────────────────────────────
function getDBConnection(): PDO {
    try {
        $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
        return new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'message' => 'Database connection failed'], 500);
    }
}

// ── Helpers ──────────────────────────────────────────────────────
function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getInput(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function sanitize(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

// ── Auth guards ──────────────────────────────────────────────────
function requireAuth(): array {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (empty($_SESSION['user_id'])) {
        jsonResponse(['success' => false, 'message' => 'Unauthorized — please login'], 401);
    }
    return [
        'user_id'   => $_SESSION['user_id'],
        'user_name' => $_SESSION['user_name'],
        'user_role' => $_SESSION['user_role'],
    ];
}

function requireAdmin(): array {
    $user = requireAuth();
    if ($user['user_role'] !== 'admin') {
        jsonResponse(['success' => false, 'message' => 'Forbidden — admin access only'], 403);
    }
    return $user;
}

function calculatePrice(float $exFactory, float $price15k, float $price30k, int $quantity): float {
    if ($quantity >= 30000) return $price30k;
    if ($quantity >= 15000) return $price15k;
    return $exFactory;
}

<?php
/**
 * Auth Middleware — Sanap Hi-Tech Nursery
 * Include at the top of any protected PHP endpoint.
 *
 * Usage:
 *   require_once __DIR__ . '/../includes/auth.php';
 *   $user = checkAuth();   // any logged-in user
 *   $user = checkAdmin();  // admin only
 */

require_once __DIR__ . '/../config/database.php';

function checkAuth(): array {
    if (session_status() === PHP_SESSION_NONE) session_start();

    if (empty($_SESSION['user_id']) || empty($_SESSION['user_role'])) {
        jsonResponse([
            'success'  => false,
            'message'  => 'Unauthorized — please login',
            'redirect' => '/login',
        ], 401);
    }

    return [
        'user_id'   => (int) $_SESSION['user_id'],
        'user_name' => $_SESSION['user_name'],
        'user_role' => $_SESSION['user_role'],
    ];
}

function checkAdmin(): array {
    $user = checkAuth();

    if ($user['user_role'] !== 'admin') {
        jsonResponse([
            'success'  => false,
            'message'  => 'Forbidden — admin access only',
            'redirect' => '/',
        ], 403);
    }

    return $user;
}

<?php
// redirect_to_cashfree.php
// This page redirects to Cashfree payment page on load, amount is taken from URL param

// Get amount from URL param
$amount = isset($_GET['amount']) ? $_GET['amount'] : null;

if (!$amount || !is_numeric($amount) || $amount <= 0) {
    die('Invalid or missing amount.');
}

// Here you would typically create an order with Cashfree and get the payment link
// For demonstration, let's assume you have a function createCashfreeOrder($amount) that returns the payment link

require_once __DIR__ . '/create_order.php'; // You should implement order creation in this file

$paymentLink = createCashfreeOrder($amount); // This function should return the payment URL

if (!$paymentLink) {
    die('Failed to create Cashfree order.');
}

// Redirect to payment page
header('Location: ' . $paymentLink);
exit;

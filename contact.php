<?php
// Tomoe Link - Secure Contact Form Handler
// Recipient email is stored server-side only and never exposed to the browser

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Recipient — stored server-side only, never visible in HTML/JS
$recipient = base64_decode('ZGNoaWF5a0BnbWFpbC5jb20=');

// Sanitize inputs
function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

$name    = sanitize($_POST['name']    ?? '');
$org     = sanitize($_POST['org']     ?? '');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$subject = sanitize($_POST['subject'] ?? 'General Enquiry');
$message = sanitize($_POST['message'] ?? '');

// Validate required fields
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide a valid email address.']);
    exit;
}

// Build email
$emailSubject = 'Tomoe Link Website Enquiry: ' . $subject;

$emailBody  = "You have received a new enquiry from the Tomoe Link website.\n\n";
$emailBody .= "-------------------------------------------\n";
$emailBody .= "Name:         " . $name . "\n";
$emailBody .= "Organisation: " . ($org ?: 'Not provided') . "\n";
$emailBody .= "Email:        " . $email . "\n";
$emailBody .= "Topic:        " . $subject . "\n";
$emailBody .= "-------------------------------------------\n\n";
$emailBody .= "Message:\n" . $message . "\n\n";
$emailBody .= "-------------------------------------------\n";
$emailBody .= "Sent from: www.tomoelink.com\n";

$headers  = "From: noreply@tomoelink.com\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$sent = mail($recipient, $emailSubject, $emailBody, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Thank you for your enquiry. We will be in touch shortly.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Sorry, your message could not be sent. Please try again later.']);
}
?>

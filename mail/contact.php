<?php

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Verificar si los campos están completos y si el correo es válido
if (
    empty($_POST['name']) || 
    empty($_POST['subject']) || 
    empty($_POST['message']) || 
    empty($_POST['phone']) || 
    !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) ||
    !isset($_POST['privacyPolicy'])
) {
    http_response_code(400);
    echo json_encode(['error' => 'Por favor complete todos los campos y acepte la política de privacidad']);
    exit;
}

$name = strip_tags($_POST['name']);
$subject = strip_tags($_POST['subject']);
$message = nl2br(htmlspecialchars($_POST['message']));
$phone = strip_tags($_POST['phone']);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

// Configurar PHPMailer
$mail = new PHPMailer(true);
try {
    // Configuración del servidor SMTP


    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com'; // Cambia a tu servidor de correo
    $mail->SMTPAuth = true;
    $mail->Username = 'krengifoo24@gmail.com'; // Cambia por tu dirección de correo
    $mail->Password = 'dkuriqrdanzdgpnn'; // Cambia por tu contraseña
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587; // Puerto para TLS

    // Remitente y destinatario
    $mail->setFrom($email, $name);
    $mail->addAddress('stiven95rengifo@gmail.com'); // Cambia por el destinatario

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = "Consulta de $name: $subject";
    $mail->Body    = "
        <h2>Consulta de Contacto</h2>
        <p><strong>Nombre:</strong> $name</p>
        <p><strong>Teléfono:</strong> $phone</p>
        <p><strong>Correo Electrónico:</strong> $email</p>
        <p><strong>Servicio:</strong> $subject</p>
        <p><strong>Mensaje:</strong><br> $message</p>
    ";

    $mail->send();
    echo json_encode(['success' => 'El mensaje se ha enviado correctamente']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => "El mensaje no pudo ser enviado. Error: {$mail->ErrorInfo}"]);
}
?>

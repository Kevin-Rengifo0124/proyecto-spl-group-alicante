<?php
require '../vendor/PHPMailer/src/Exception.php';
require '../vendor/PHPMailer/src/PHPMailer.php';
require '../vendor/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Verificar que se reciben los datos del formulario
if (empty($_POST['name']) ||
    empty($_POST['message']) ||
    empty($_POST['phone']) ||
    empty($_POST['email']) ||
    empty($_POST['subject']) ||
    !isset($_POST['privacyPolicy']) ||
    empty($_POST['g-recaptcha-response'])) {
    echo 'Por favor, completa todos los campos correctamente.';
    exit;
}

// Verificar reCAPTCHA
$recaptcha_secret = '6Ldnz_EqAAAAACT269EA5aNVuhc2oDANxcUjAQ8C';
$recaptcha_response = $_POST['g-recaptcha-response'];
$recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';

$response = file_get_contents($recaptcha_url . '?secret=' . $recaptcha_secret . '&response=' . $recaptcha_response);
$response_keys = json_decode($response, true);

if (!$response_keys["success"]) {
    echo 'Error de verificación reCAPTCHA. Por favor, inténtelo de nuevo.';
    exit;
}

try {
    // Crear una nueva instancia de PHPMailer
    $mail = new PHPMailer(true);
    
    // Configuración del servidor
    $mail->isSMTP();                                      
    $mail->Host       = 'smtp.ionos.es';                    // Servidor SMTP de Ionos
    $mail->SMTPAuth   = true;                               // Habilitar autenticación SMTP
    $mail->Username   = 'info@splgroup.es';                 // SMTP username - dirección completa
    $mail->Password   = 'Levante-2023';                       // SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;     // Habilitar STARTTLS
    $mail->Port       = 587;                                // Puerto TCP para conectarse
    
    // Si se necesita debug (quitar en producción)
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                  // Habilitar debugging
    
    // Datos del formulario
    $name = strip_tags(trim($_POST['name']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $subject = strip_tags(trim($_POST['subject']));
    $message = strip_tags(trim($_POST['message']));
    $phone = strip_tags(trim($_POST['phone']));

    // Destinatarios
    $mail->setFrom('info@splgroup.es', 'Formulario Web SPL Group');  // Remitente (debe ser tu dirección de Ionos)
    $mail->addAddress('info@splgroup.es');                           // Destinatario principal
    $mail->addReplyTo($email, $name);                                // Dirección de respuesta

    // Contenido
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';                                         // Configurar juego de caracteres
    $mail->Subject = 'Nuevo contacto web: ' . $subject;
    
    // Cuerpo del correo
    $mail->Body    = "
        <h2>Nuevo mensaje desde el formulario de contacto</h2>
        <p><strong>Nombre:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Teléfono:</strong> {$phone}</p>
        <p><strong>Asunto:</strong> {$subject}</p>
        <p><strong>Mensaje:</strong></p>
        <p>{$message}</p>
    ";
    
    // Versión alternativa en texto plano
    $mail->AltBody = "Nuevo mensaje de {$name}. Email: {$email}. Teléfono: {$phone}. Asunto: {$subject}. Mensaje: {$message}.";

    // Enviar el correo
    $mail->send();
    echo 'Su mensaje ha sido enviado correctamente.';
} catch (Exception $e) {
    echo "No se pudo enviar el mensaje. Error: {$mail->ErrorInfo}";
}
?>
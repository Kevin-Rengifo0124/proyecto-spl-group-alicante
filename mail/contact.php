<?php

echo $_POST['name'];

if (empty($_POST['name']) ||
    empty($_POST['message']) ||
   	empty($_POST['phone']) ||
   	empty($_POST['email'])) {
    echo 'Por favor, completa todos los campos correctamente.';
    exit;
}

require '../vendor/PHPMailer/src/Exception.php';
require '../vendor/PHPMailer/src/PHPMailer.php';
require '../vendor/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

try {

    // Crear una nueva instancia de PHPMailer con excepciones activadas
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.ionos.es';
    $mail->SMTPAuth = true;
    $mail->Username = 'info@splgroup.es';
    $mail->Password = 'SplGroupes';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Configuración de destinatarios
    $mail->addAddress('krengifoo24@gmail.com');

    // Datos del formulario
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);
    $phone = htmlspecialchars($_POST['phone']);

   // Configuración del remitente
    $mail->setFrom($email);

    // Configuración del contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Nuevo mensaje de: ' . $name;
    $mail->Body = "
        <h2>Nuevo mensaje del formulario web</h2>
        <p><strong>Nombre:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Teléfono:</strong> $phone</p>
        <p><strong>Asunto:</strong> $subject</p>
        <p><strong>Mensaje:</strong> $message</p>
    ";
    $mail->AltBody = "Nuevo mensaje de $name. Email: $email. Teléfono: $phone. Asunto: $subject. Mensaje: $message.";
   $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->send();
    echo 'El correo ha sido enviado correctamente.';
} catch (Exception $e) {
    echo 'Error al enviar el correo: ' . $e->getMessage();
}
?>

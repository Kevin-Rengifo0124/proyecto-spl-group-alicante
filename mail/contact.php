<?php
if (
    empty($_POST['name']) || 
    empty($_POST['subject']) || 
    empty($_POST['message']) || 
    empty($_POST['phone']) || 
    !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)
) {
    http_response_code(500);
    exit();
}

$name = strip_tags(htmlspecialchars($_POST['name']));
$email = strip_tags(htmlspecialchars($_POST['email']));
$m_subject = strip_tags(htmlspecialchars($_POST['subject']));
$phone = strip_tags(htmlspecialchars($_POST['phone']));
$message = strip_tags(htmlspecialchars($_POST['message']));

$to = "krengifoo24@gmail.com";  // Correo al que deseas enviar
$subject = "$m_subject - Mensaje de: $name";
$body = "Has recibido un nuevo mensaje desde tu formulario web.\n\n";
$body .= "Detalles del mensaje:\n\n";
$body .= "Nombre: $name\n";
$body .= "Teléfono: $phone\n";
$body .= "Correo Electrónico: $email\n";
$body .= "Asunto: $m_subject\n";
$body .= "Mensaje:\n$message";

$headers = "From: noreply@tudominio.com\n"; 
$headers .= "Reply-To: $email";	

if (!mail($to, $subject, $body, $headers)) {
  echo "<p>Error al enviar el mensaje. Inténtelo de nuevo más tarde.</p>";
  http_response_code(500);
} else {
  echo "<p>Mensaje enviado correctamente. Gracias por contactarnos.</p>";
}
?>

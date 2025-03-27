$(function () {
    $("#contactForm input, #contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {
            // Mostrar errores de validación
        },
        submitSuccess: function ($form, event) {
            event.preventDefault();
            
            // Recoger datos del formulario
            var name = $("input#name").val();
            var email = $("input#email").val();
            var subject = $("input#subject").val() || $("#subject").val(); // Manejar select o input
            var message = $("textarea#message").val();
            var phone = $("#phone").val();
            var recaptchaResponse = grecaptcha.getResponse();
            
            // Deshabilitar botón para prevenir múltiples envíos
            $this = $("#sendMessageButton");
            $this.prop("disabled", true);

            // Realizar la petición AJAX
            $.ajax({
                url: "../mail/contact.php", // Ruta correcta al archivo PHP (ajustar según la estructura del servidor)
                type: "POST",
                data: {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    phone: phone,
                    'g-recaptcha-response': recaptchaResponse
                },
                cache: false,
                success: function (response) {
                    console.log("Éxito:", response);
                    // Mostrar mensaje de éxito
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<strong>Su mensaje ha sido enviado correctamente. </strong>");
                    $('#success > .alert-success')
                        .append('</div>');
                        
                    // Limpiar formulario
                    $('#contactForm').trigger("reset");
                },
                error: function (xhr, status, error) {
                    console.log("Error:", error);
                    // Mostrar mensaje de error
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-danger').append($("<strong>").text("Lo sentimos " + name + ", parece que nuestro servidor de correo no está respondiendo. Por favor, inténtelo de nuevo más tarde."));
                    $('#success > .alert-danger').append('</div>');
                    
                    // Limpiar formulario
                    $('#contactForm').trigger("reset");
                },
                complete: function () {
                    console.log("Completado");
                    // Habilitar botón nuevamente después de un segundo
                    setTimeout(function () {
                        $this.prop("disabled", false);
                    }, 1000);
                }
            });
        },
        filter: function () {
            return $(this).is(":visible");
        },
    });

    // Manejar el cambio de pestaña
    $("a[data-toggle=\"tab\"]").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

// Limpiar mensajes cuando se hace focus en el nombre
$('#name').focus(function () {
    $('#success').html('');
});
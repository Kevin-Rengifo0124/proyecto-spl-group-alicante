document.getElementById("contactForm").addEventListener("submit", function(event) {
    var privacyChecked = document.getElementById("privacyPolicy").checked;
    var recaptchaResponse = grecaptcha.getResponse();
    
    if (!privacyChecked) {
        alert("Debes aceptar la Política de Privacidad para continuar.");
        event.preventDefault();
    }
    
    if (recaptchaResponse.length === 0) {
        alert("Por favor, completa el reCAPTCHA para continuar.");
        event.preventDefault();
    }
});

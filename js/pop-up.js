document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("popupModal");
    var closeBtn = document.querySelector("#popupModal .close"); // Más preciso

    // Verificar si el modal y el botón existen
    if (!modal || !closeBtn) {
        console.error("Modal o botón de cierre no encontrados");
        return;
    }

    // Mostrar el modal automáticamente
    modal.style.display = "block";

    // Cerrar el modal al hacer clic en la "X"
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

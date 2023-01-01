document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("popupModal");
    var closeBtn = document.querySelector("#popupModal .close");

    if (!modal || !closeBtn) {
        console.error("Modal o botón de cierre no encontrados");
        return;
    }

    // Esperar 10 segundos antes de mostrar el modal
    setTimeout(function () {
        modal.style.display = "flex";
    }, 10000); // 10 segundos

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

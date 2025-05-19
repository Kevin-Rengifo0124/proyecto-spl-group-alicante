document.addEventListener("DOMContentLoaded", function() {
    // Elementos del DOM
    const carousel = document.querySelector(".image-list");
    const prevBtn = document.querySelector("#prev-slide");
    const nextBtn = document.querySelector("#next-slide");
    const scrollbarThumb = document.querySelector(".scrollbar-thumb");
    const scrollbarTrack = document.querySelector(".scrollbar-track");
    
    // Variables globales
    let isDragging = false;
    let startX, startScrollLeft;
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    let momentum = 0;
    let animationId = null;
    
    // Activar scroll suave en CSS
    carousel.style.scrollBehavior = "smooth";
    
    // Función para actualizar la posición del scrollbar basado en el scroll del carrusel
    const updateScrollThumbPosition = () => {
        const scrollPercentage = carousel.scrollLeft / scrollWidth;
        const thumbPosition = scrollPercentage * (scrollbarTrack.clientWidth - scrollbarThumb.offsetWidth);
        scrollbarThumb.style.left = `${thumbPosition}px`;
        
        // Opcional: actualizar contador de imágenes
        // updateImageCounter();
    };
    
    // Función para desplazarse una imagen a la izquierda con más fluidez
    const slideLeft = () => {
        // Desplazarse más suavemente (1.5 imágenes)
        const itemWidth = carousel.querySelector(".image-item").offsetWidth + 20; // +20 for the gap
        carousel.scrollLeft -= itemWidth * 1.5;
        setTimeout(updateScrollThumbPosition, 60);
    };
    
    // Función para desplazarse una imagen a la derecha con más fluidez
    const slideRight = () => {
        // Desplazarse más suavemente (1.5 imágenes)
        const itemWidth = carousel.querySelector(".image-item").offsetWidth + 20; // +20 for the gap
        carousel.scrollLeft += itemWidth * 1.5;
        setTimeout(updateScrollThumbPosition, 60);
    };
    
    // Event Listeners para los botones
    prevBtn.addEventListener("click", slideLeft);
    nextBtn.addEventListener("click", slideRight);
    
    // Agregar inercia al desplazamiento
    const applyMomentum = () => {
        if (Math.abs(momentum) > 0.1) {
            carousel.scrollLeft += momentum;
            momentum *= 0.95; // Factor de reducción de la inercia
            updateScrollThumbPosition();
            animationId = requestAnimationFrame(applyMomentum);
        } else {
            cancelAnimationFrame(animationId);
        }
    };
    
    // Event Listeners para arrastrar el carrusel con el mouse
    carousel.addEventListener("mousedown", (e) => {
        isDragging = true;
        carousel.classList.add("dragging");
        carousel.style.scrollBehavior = "auto"; // Desactivar scroll suave durante el arrastre
        startX = e.pageX;
        startScrollLeft = carousel.scrollLeft;
        momentum = 0;
        cancelAnimationFrame(animationId);
    });
    
    // Mejorar la detección de movimiento para mayor fluidez
    let lastX = 0;
    let lastTimestamp = 0;
    
    carousel.addEventListener("mousemove", (e) => {
        if(!isDragging) return;
        
        const x = e.pageX;
        const timestamp = Date.now();
        const walk = (x - startX) * 2.5; // Aumentar el multiplicador para mayor sensibilidad
        
        // Calcular velocidad para momentum
        if (lastTimestamp) {
            const dt = timestamp - lastTimestamp;
            const dx = x - lastX;
            if (dt > 0) {
                momentum = dx * 8; // Factor de inercia
            }
        }
        
        carousel.scrollLeft = startScrollLeft - walk;
        updateScrollThumbPosition();
        
        lastX = x;
        lastTimestamp = timestamp;
    });
    
    // Event Listeners para el scrollbar con más fluidez
    scrollbarThumb.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.pageX;
        startScrollLeft = scrollbarThumb.offsetLeft;
        
        document.addEventListener("mousemove", onScrollbarDrag);
        document.addEventListener("mouseup", onMouseUp);
    });
    
    // Función para arrastrar el scrollbar con más fluidez
    const onScrollbarDrag = (e) => {
        if(!isDragging) return;
        const x = e.pageX;
        const walk = x - startX;
        
        // Calcular la nueva posición del thumb
        const maxThumbPosition = scrollbarTrack.clientWidth - scrollbarThumb.offsetWidth;
        let newThumbPosition = startScrollLeft + walk;
        
        // Limitar la posición del thumb dentro del track
        newThumbPosition = Math.max(0, Math.min(newThumbPosition, maxThumbPosition));
        scrollbarThumb.style.left = `${newThumbPosition}px`;
        
        // Actualizar la posición del carrusel sin smooth scrolling durante el arrastre
        carousel.style.scrollBehavior = "auto";
        const scrollPercentage = newThumbPosition / maxThumbPosition;
        carousel.scrollLeft = scrollPercentage * scrollWidth;
    };
    
    // Función para detener el arrastre con inercia
    const onMouseUp = () => {
        isDragging = false;
        carousel.classList.remove("dragging");
        carousel.style.scrollBehavior = "smooth"; // Reactivar scroll suave
        
        // Aplicar momentum solo después de soltar el mouse
        animationId = requestAnimationFrame(applyMomentum);
        
        document.removeEventListener("mousemove", onScrollbarDrag);
        document.removeEventListener("mouseup", onMouseUp);
        
        lastTimestamp = 0;
    };
    
    // Listeners para finalizar el arrastre
    document.addEventListener("mouseup", onMouseUp);
    
    // Actualizar el scrollbar cuando el usuario desplaza el carrusel
    carousel.addEventListener("scroll", updateScrollThumbPosition);
    
    // Soporte para eventos táctiles con mayor fluidez
    carousel.addEventListener("touchstart", (e) => {
        isDragging = true;
        carousel.style.scrollBehavior = "auto";
        startX = e.touches[0].pageX;
        startScrollLeft = carousel.scrollLeft;
        momentum = 0;
        cancelAnimationFrame(animationId);
    });
    
    carousel.addEventListener("touchmove", (e) => {
        if(!isDragging) return;
        
        const x = e.touches[0].pageX;
        const timestamp = Date.now();
        const walk = (x - startX) * 2.5;
        
        // Calcular velocidad para momentum
        if (lastTimestamp) {
            const dt = timestamp - lastTimestamp;
            const dx = x - lastX;
            if (dt > 0) {
                momentum = dx * 8; // Factor de inercia
            }
        }
        
        carousel.scrollLeft = startScrollLeft - walk;
        updateScrollThumbPosition();
        
        lastX = x;
        lastTimestamp = timestamp;
    });
    
    carousel.addEventListener("touchend", () => {
        isDragging = false;
        carousel.style.scrollBehavior = "smooth";
        
        // Aplicar momentum después de soltar
        animationId = requestAnimationFrame(applyMomentum);
        
        lastTimestamp = 0;
    });
    
    // Función opcional para actualizar el contador de imágenes
    /*
    const updateImageCounter = () => {
        const items = carousel.querySelectorAll('.image-item');
        const scrollPosition = carousel.scrollLeft;
        const itemWidth = items[0].offsetWidth + 20;
        const currentIndex = Math.round(scrollPosition / itemWidth) + 1;
        
        document.querySelector('.image-counter').textContent = `${currentIndex} of ${items.length}`;
        
        // If using progress dots, update active dot
        document.querySelectorAll('.progress-dot').forEach((dot, index) => {
            if (index === currentIndex - 1) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };
    */
    
    // Ajustar el scrollbar y recalcular dimensiones cuando cambia el tamaño de la ventana
    window.addEventListener("resize", () => {
        scrollWidth = carousel.scrollWidth - carousel.clientWidth;
        updateScrollThumbPosition();
    });
    
    // Inicializar la posición del scrollbar
    updateScrollThumbPosition();
    
    // Opcional: Configurar los puntos de progreso si los estás usando
    /*
    const progressDots = document.querySelectorAll('.progress-dot');
    progressDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const items = carousel.querySelectorAll('.image-item');
            const itemWidth = items[0].offsetWidth + 20;
            carousel.scrollLeft = itemWidth * index;
        });
    });
    */
    
    // Autorreproducción opcional (descomenta para activar)
    /*
    let autoplayInterval;
    
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            if (carousel.scrollLeft >= scrollWidth - 10) {
                carousel.scrollLeft = 0;
            } else {
                slideRight();
            }
        }, 5000); // Cambiar cada 5 segundos
    };
    
    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };
    
    // Iniciar autorreproducción
    startAutoplay();
    
    // Detener autorreproducción al interactuar
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('touchstart', stopAutoplay);
    
    // Reanudar autorreproducción al dejar de interactuar
    carousel.addEventListener('mouseleave', startAutoplay);
    */
});

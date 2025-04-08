document.addEventListener("DOMContentLoaded", () => {
    const startVoiceButton = document.getElementById("start-voice");
    const currentContent = document.getElementById("current-content");
    const currentLevel = document.getElementById("current-level");
    const feedback = document.getElementById("feedback");
    const progressBar = document.getElementById("progress-bar");

    const content = [
        // Nivel inicial
        { text: "Mamá", level: "Inicial" },
        { text: "Papá", level: "Inicial" },
        { text: "Sol", level: "Inicial" },
        { text: "Luna", level: "Inicial" },
        { text: "Taza", level: "Inicial" },
        { text: "Casa", level: "Inicial" },
        // Nivel intermedio
        { text: "Elefante", level: "Intermedio" },
        { text: "Montaña", level: "Intermedio" },
        { text: "Computadora", level: "Intermedio" },
        { text: "Grillo", level: "Intermedio" },
        { text: "La rana salta y canta", level: "Intermedio" },
        { text: "El gato en el zapato", level: "Intermedio" },
        // Nivel avanzado
        { text: "Tres tristes tigres comen trigo", level: "Avanzado" },
        { text: "Si el caracol tuviera cara sería un caracol con cara", level: "Avanzado" }
    ];

    let currentIndex = 0;

    // Verifica si el navegador soporta la API de reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        feedback.textContent = "Tu navegador no soporta el reconocimiento de voz.";
        startVoiceButton.disabled = true;
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = false;

    // Función para normalizar texto (eliminar tildes, convertir a minúsculas, etc.)
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD") // Descompone caracteres con tildes
            .replace(/[\u0300-\u036f]/g, "") // Elimina marcas diacríticas
            .trim(); // Elimina espacios adicionales
    };

    // Función para iniciar el reconocimiento de voz
    startVoiceButton.addEventListener("click", () => {
        startVoiceButton.style.display = "none"; // Ocultar el botón al iniciar
        if (currentIndex >= content.length) {
            feedback.textContent = "¡Felicidades! Has completado todos los niveles.";
            return;
        }

        const currentItem = content[currentIndex];
        currentContent.textContent = currentItem.text;
        currentLevel.textContent = `Nivel: ${currentItem.level}`;
        feedback.textContent = "Escuchando..."; // Feedback más grande
        recognition.start();
    });

    // Manejar el resultado del reconocimiento de voz
    recognition.addEventListener("result", (event) => {
        const transcript = normalizeText(event.results[0][0].transcript);
        const expected = normalizeText(content[currentIndex].text);

        if (transcript === expected) {
            feedback.textContent = "¡Correcto! Avanzando al siguiente contenido.";
            currentIndex++;
            updateProgressBar();

            if (currentIndex < content.length) {
                const nextItem = content[currentIndex];
                currentContent.textContent = nextItem.text;
                currentLevel.textContent = `Nivel: ${nextItem.level}`;
                recognition.start(); // Continuar escuchando automáticamente
            } else {
                currentContent.textContent = "¡Has completado todos los niveles!";
                currentLevel.textContent = "Nivel: Completado";
                feedback.textContent = "¡Felicidades! Has completado todo.";
            }
        } else {
            feedback.textContent = `Incorrecto. Escuché: "${transcript}". Intenta de nuevo.`;
            recognition.start(); // Reintentar automáticamente
        }
    });

    recognition.addEventListener("error", (event) => {
        feedback.textContent = `Error: ${event.error}`;
    });

    recognition.addEventListener("end", () => {
        if (currentIndex < content.length) {
            recognition.start(); // Continuar escuchando automáticamente
        }
    });

    // Función para actualizar la barra de progreso
    const updateProgressBar = () => {
        const progressPercentage = (currentIndex / content.length) * 100;
        progressBar.value = progressPercentage; // Actualiza el valor de la barra
        progressBar.textContent = `${Math.round(progressPercentage)}%`; // Muestra el porcentaje
    };
});

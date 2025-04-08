document.addEventListener("DOMContentLoaded", () => {
    const startVoiceButton = document.getElementById("start-voice");
    const currentContent = document.getElementById("current-content");
    const currentLevel = document.getElementById("current-level");
    const feedback = document.getElementById("feedback");
    const progressBar = document.getElementById("progress-bar");

    const content = [
        // Nivel inicial
        { text: "mamá", level: "Inicial" },
        { text: "papá", level: "Inicial" },
        { text: "sol", level: "Inicial" },
        { text: "luna", level: "Inicial" },
        { text: "taza", level: "Inicial" },
        { text: "casa", level: "Inicial" },
        { text: "La luna brilla", level: "Inicial" },
        { text: "Mi mamá me ama", level: "Inicial" },
        { text: "El sol sale", level: "Inicial" },
        // Nivel intermedio
        { text: "tren", level: "Intermedio" },
        { text: "flor", level: "Intermedio" },
        { text: "grillo", level: "Intermedio" },
        { text: "plátano", level: "Intermedio" },
        { text: "La rana salta y canta", level: "Intermedio" },
        { text: "El gato en el zapato", level: "Intermedio" },
        // Nivel avanzado
        { text: "Tres tristes tigres comen trigo", level: "Avanzado" },
        { text: "Pedro pica papas", level: "Avanzado" }
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
        if (currentIndex >= content.length) {
            feedback.textContent = "¡Felicidades! Has completado todos los niveles.";
            return;
        }

        const currentItem = content[currentIndex];
        currentContent.textContent = currentItem.text;
        currentLevel.textContent = `Nivel: ${currentItem.level}`;
        feedback.textContent = "Escuchando... por favor, repite.";
        recognition.start();
    });

    // Manejar el resultado del reconocimiento de voz
    recognition.addEventListener("result", (event) => {
        const transcript = normalizeText(event.results[0][0].transcript);
        const expected = normalizeText(content[currentIndex].text);

        if (transcript === expected) {
            feedback.textContent = "¡Correcto! Avanzando al siguiente contenido.";
            currentIndex++;
            progressBar.value = (currentIndex / content.length) * 100;

            if (currentIndex < content.length) {
                const nextItem = content[currentIndex];
                currentContent.textContent = nextItem.text;
                currentLevel.textContent = `Nivel: ${nextItem.level}`;
            } else {
                currentContent.textContent = "¡Has completado todos los niveles!";
                currentLevel.textContent = "Nivel: Completado";
            }
        } else {
            feedback.textContent = `Incorrecto. Escuché: "${transcript}". Intenta de nuevo.`;
        }
    });

    recognition.addEventListener("error", (event) => {
        feedback.textContent = `Error: ${event.error}`;
    });

    recognition.addEventListener("end", () => {
        feedback.textContent += " (Reconocimiento finalizado)";
    });
});

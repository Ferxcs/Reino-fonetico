document.addEventListener("DOMContentLoaded", () => {
    const karaokeVideo = document.getElementById("karaoke-video");
    const startKaraokeImage = document.getElementById("start-karaoke");
    const karaokeContent = document.getElementById("karaoke-content");
    const karaokePhrase = document.getElementById("karaoke-phrase"); // Contenedor para las frases
    const karaokeFeedback = document.getElementById("karaoke-feedback");
    const retryButton = document.getElementById("retry-button");

    const pausePoints = [
        {
            time: 27,
            phrases: [
                "rolo raton",
                "rolo raton",
                "pasa el rato",
                "en un rincon",
                "come rosquillas",
                "sobre una silla",
                "con roberto y con ramon"
            ]
        },
        {
            time: 63,
            phrases: [
                "rolo raton",
                "rolo raton",
                "pasa el rato",
                "en un rincon",
                "come rosquillas",
                "sobre una silla",
                "con roberto y con ramon"
            ]
        }
    ];

    let currentPauseIndex = 0;
    let currentPhraseIndex = 0;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        karaokeFeedback.textContent = "Tu navegador no soporta el reconocimiento de voz.";
        startKaraokeImage.style.display = "none";
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = true;

    // Función para normalizar texto
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    };

    // Función para mostrar las frases divididas
    const displayPhrases = (phrases) => {
        karaokePhrase.innerHTML = phrases
            .map((phrase, index) => `<span class="karaoke-phrase" data-index="${index}">${phrase}</span>`)
            .join(" ");
    };

    // Manejar clic en la imagen para iniciar el karaoke
    startKaraokeImage.addEventListener("click", () => {
        startKaraokeImage.style.display = "none";
        karaokeVideo.style.display = "block";
        karaokeContent.style.display = "block";
        karaokeVideo.muted = false;
        karaokeVideo.play();
        karaokeFeedback.textContent = "¡Canta cuando el video se detenga!";
    });

    // Manejar los puntos de pausa en el video
    karaokeVideo.addEventListener("timeupdate", () => {
        if (currentPauseIndex < pausePoints.length) {
            const pausePoint = pausePoints[currentPauseIndex];
            if (Math.floor(karaokeVideo.currentTime) === pausePoint.time) {
                karaokeVideo.pause();
                currentPhraseIndex = 0;
                displayPhrases(pausePoint.phrases); // Mostrar las frases
                karaokeFeedback.textContent = "Escuchando...";
                retryButton.style.display = "none";
                recognition.start();
            }
        }
    });

    // Manejar el resultado del reconocimiento de voz
    recognition.addEventListener("result", (event) => {
        const transcript = normalizeText(event.results[0][0].transcript);
        const phrases = pausePoints[currentPauseIndex].phrases;
        const currentPhrase = normalizeText(phrases[currentPhraseIndex]);

        console.log(`Texto reconocido: "${transcript}"`);
        console.log(`Frase esperada: "${currentPhrase}"`);

        const similarity = calculateSimilarity(transcript, currentPhrase);
        console.log(`Similitud: ${similarity}`);

        if (similarity > 0.7) {
            const phraseElements = document.querySelectorAll(".karaoke-phrase");
            const currentElement = phraseElements[currentPhraseIndex];
            if (currentElement) {
                currentElement.classList.add("correct-phrase");
            }

            currentPhraseIndex++;
            if (currentPhraseIndex === phrases.length) {
                karaokeFeedback.textContent = "¡Correcto! Continuando...";
                currentPauseIndex++;
                recognition.stop();
                karaokeVideo.play();
            } else {
                karaokeFeedback.textContent = `¡Bien! Ahora di: "${phrases[currentPhraseIndex]}"`;
            }
        } else {
            karaokeFeedback.textContent = `Escuché: "${transcript}". Intenta de nuevo.`;
        }
    });

    recognition.addEventListener("error", (event) => {
        karaokeFeedback.textContent = `Error: ${event.error}`;
        retryButton.style.display = "block";
    });

    recognition.addEventListener("end", () => {
        if (currentPhraseIndex < pausePoints[currentPauseIndex].phrases.length) {
            recognition.start();
        }
    });

    retryButton.addEventListener("click", () => {
        karaokeFeedback.textContent = "Escuchando...";
        retryButton.style.display = "none";
        recognition.start();
    });

    const calculateSimilarity = (str1, str2) => {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        const longerLength = longer.length;

        if (longerLength === 0) return 1.0;

        let editDistance = 0;
        for (let i = 0; i < shorter.length; i++) {
            if (shorter[i] !== longer[i]) editDistance++;
        }
        editDistance += longerLength - shorter.length;

        return (longerLength - editDistance) / longerLength;
    };
});

import { showBackButton, setupOptions } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const levelButtons = document.querySelectorAll(".level-button");
    const levelSection = document.getElementById("level-section");
    const voiceSection = document.getElementById("voice-section");
    const selectedLevelTitle = document.getElementById("selected-level-title");
    const videoPlayer = document.getElementById("video-player");
    const optionsContainer = document.getElementById("options-container");
    const backToMenuButton = document.getElementById("back-to-menu");

    videoPlayer.style.display = "none";
    optionsContainer.style.display = "none";
    backToMenuButton.style.display = "none";

    const pausePoints = [
        { time: 20, correctWord: "enorme", incorrectWord: "pequeña" },
        { time: 42, correctWord: "raíz", incorrectWord: "hoja" },
        { time: 70, correctWord: "lago", incorrectWord: "río" },
        { time: 97, correctWord: "lombrices", incorrectWord: "mariposas" },
        { time: 137, correctWord: "dinosaurio", incorrectWord: "elefante" },
        { time: 161, correctWord: "gruta", incorrectWord: "cueva" },
        { time: 168, correctWord: "hormiga", incorrectWord: "abeja" },
        { time: 234, correctWord: "fiesta", incorrectWord: "trabajo" }
    ];

    let currentPauseIndex = 0;

    levelButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const selectedLevelId = parseInt(event.target.dataset.level, 10);

            if (selectedLevelId === 3) {
                levelSection.style.display = "none";
                voiceSection.style.display = "block";
                videoPlayer.style.display = "block";
                optionsContainer.style.display = "none";

                selectedLevelTitle.textContent = "Cuentos que Hablan";
                videoPlayer.src = "video/Muchos túneles y un problema.mp4";
                videoPlayer.currentTime = 0;
                videoPlayer.play();

                showBackButton(backToMenuButton, voiceSection, levelSection);
            }
        });
    });

    videoPlayer.addEventListener("timeupdate", () => {
        if (currentPauseIndex < pausePoints.length) {
            const pausePoint = pausePoints[currentPauseIndex];
            if (Math.floor(videoPlayer.currentTime) === pausePoint.time) {
                videoPlayer.pause();
                optionsContainer.style.display = "block";

                setupOptions(videoPlayer, optionsContainer, pausePoint, () => {
                    currentPauseIndex++;
                    videoPlayer.play();
                });
            }
        }
    });
});

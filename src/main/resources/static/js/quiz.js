document.addEventListener("DOMContentLoaded", async () => {
    const participantId = sessionStorage.getItem("participantId");
    if (!participantId) {
        window.location.href = "index.html";
        return;
    }

    const loadingState = document.getElementById("loadingState");
    const quizState = document.getElementById("quizState");
    const errorState = document.getElementById("errorState");

    const progressLabel = document.getElementById("progressLabel");
    const progressFill = document.getElementById("progressFill");
    const timerEl = document.getElementById("timer");
    const questionText = document.getElementById("questionText");
    const optionsContainer = document.getElementById("optionsContainer");
    const nextBtn = document.getElementById("nextBtn");

    let questions = [];
    let currentIndex = 0;
    let answers = {}; // questionId -> selectedOption
    let startTime = null;
    let timerInterval = null;

    function showError(msg) {
        loadingState.classList.add("hidden");
        quizState.classList.add("hidden");
        errorState.classList.remove("hidden");
        errorState.textContent = msg;
    }

    function formatTime(totalSeconds) {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
        const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            timerEl.textContent = formatTime(elapsed);
        }, 1000);
    }

    function renderQuestion() {
        const q = questions[currentIndex];
        progressLabel.textContent = `QUESTION ${currentIndex + 1} / ${questions.length}`;
        progressFill.style.width = `${((currentIndex) / questions.length) * 100}%`;

        questionText.textContent = q.questionText;
        optionsContainer.innerHTML = "";

        const options = [
            { letter: "A", text: q.optionA },
            { letter: "B", text: q.optionB },
            { letter: "C", text: q.optionC },
            { letter: "D", text: q.optionD },
        ];

        options.forEach((opt) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "option";
            btn.dataset.letter = opt.letter;
            if (answers[q.id] === opt.letter) btn.classList.add("selected");

            btn.innerHTML = `<span class="letter">${opt.letter}</span><span class="text"></span>`;
            btn.querySelector(".text").textContent = opt.text;

            btn.addEventListener("click", () => {
                answers[q.id] = opt.letter;
                document.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
                btn.classList.add("selected");
                nextBtn.disabled = false;
            });

            optionsContainer.appendChild(btn);
        });

        nextBtn.disabled = !answers[q.id];
        nextBtn.textContent = currentIndex === questions.length - 1 ? "Finish quiz →" : "Next →";
    }

    nextBtn.addEventListener("click", async () => {
        if (currentIndex < questions.length - 1) {
            currentIndex++;
            renderQuestion();
        } else {
            await submitQuiz();
        }
    });

    async function submitQuiz() {
        clearInterval(timerInterval);
        const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);

        nextBtn.disabled = true;
        nextBtn.textContent = "Submitting…";

        const payload = {
            participantId,
            timeTakenSeconds,
            answers: questions.map(q => ({
                questionId: q.id,
                selectedOption: answers[q.id] || null,
            })),
        };

        try {
            const res = await fetch(`${API_BASE_URL}/quiz/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Could not submit your answers. Please try again.");

            const result = await res.json();
            sessionStorage.setItem("quizResult", JSON.stringify(result));
            window.location.href = "result.html";
        } catch (err) {
            showError(err.message);
        }
    }

    try {
        const res = await fetch(`${API_BASE_URL}/quiz/questions`);
        if (!res.ok) throw new Error("Could not load the quiz. Please try again shortly.");
        questions = await res.json();

        if (!questions.length) {
            showError("No questions are set up yet.");
            return;
        }

        loadingState.classList.add("hidden");
        quizState.classList.remove("hidden");
        startTimer();
        renderQuestion();
    } catch (err) {
        showError(err.message);
    }
});

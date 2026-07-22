document.addEventListener("DOMContentLoaded", () => {
    const loadingState = document.getElementById("loadingState");
    const errorState = document.getElementById("errorState");
    const bigPodium = document.getElementById("bigPodium");
    const emptyState = document.getElementById("emptyState");

    const REFRESH_MS = 10000;

    function formatTime(totalSeconds) {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
        const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    function renderPodium(top3) {
        loadingState.classList.add("hidden");
        errorState.classList.add("hidden");

        if (!top3.length) {
            bigPodium.classList.add("hidden");
            emptyState.classList.remove("hidden");
            return;
        }
        emptyState.classList.add("hidden");
        bigPodium.classList.remove("hidden");
        bigPodium.innerHTML = "";

        // Visual podium order: 2nd, 1st, 3rd
        const order = [top3[1], top3[0], top3[2]];
        const classes = ["second", "first", "third"];
        const medals = ["🥈", "🥇", "🥉"];

        order.forEach((entry, i) => {
            const slot = document.createElement("div");
            slot.className = `big-slot ${classes[i]}`;

            if (!entry) {
                slot.style.visibility = "hidden";
                bigPodium.appendChild(slot);
                return;
            }

            slot.innerHTML = `
        <div class="medal">${medals[i]}</div>
        <div class="big-block">${entry.rank}</div>
        <div class="big-name"></div>
        <div class="big-meta"></div>
      `;
            slot.querySelector(".big-name").textContent = entry.name;
            slot.querySelector(".big-meta").textContent =
                `${entry.score}/${entry.totalQuestions} correct · ${formatTime(entry.timeTakenSeconds)}`;
            bigPodium.appendChild(slot);
        });
    }

    async function loadWinners() {
        try {
            const res = await fetch(`${API_BASE_URL}/leaderboard/top3`);
            if (!res.ok) throw new Error("Couldn't load the leaderboard.");
            const top3 = await res.json();	
			console.log("top3 ", top3);
            renderPodium(top3);
        } catch (err) {
            loadingState.classList.add("hidden");
            bigPodium.classList.add("hidden");
            emptyState.classList.add("hidden");
            errorState.textContent = err.message;
            errorState.classList.remove("hidden");
        }
    }

    loadWinners();
    setInterval(loadWinners, REFRESH_MS);
});

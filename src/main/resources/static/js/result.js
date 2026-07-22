document.addEventListener("DOMContentLoaded", async () => {
    const resultRaw = sessionStorage.getItem("quizResult");
    const name = sessionStorage.getItem("participantName") || "You";

    const playerName = document.getElementById("playerName");
    const scoreText = document.getElementById("scoreText");
    const rankText = document.getElementById("rankText");
    const podium = document.getElementById("podium");
    const leaderboardList = document.getElementById("leaderboardList");
    const lbEmpty = document.getElementById("lbEmpty");

    if (resultRaw) {
        const result = JSON.parse(resultRaw);
        playerName.textContent = `Nice work, ${name}`;
        scoreText.textContent = `${result.score} / ${result.totalQuestions}`;
        rankText.textContent = `Finished in ${formatTime(result.timeTakenSeconds)} · Rank #${result.rank} overall`;
    } else {
        playerName.textContent = "Leaderboard";
        scoreText.textContent = "";
        rankText.textContent = "";
    }

    function formatTime(totalSeconds) {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
        const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    function renderPodium(top3) {
        podium.innerHTML = "";
        if (!top3.length) {
            podium.classList.add("hidden");
            lbEmpty.classList.remove("hidden");
            return;
        }
        // Order visually as 2nd, 1st, 3rd for a classic podium look
        const order = [top3[1], top3[0], top3[2]];
        const classes = ["second", "first", "third"];

        order.forEach((entry, i) => {
            const slot = document.createElement("div");
            slot.className = `podium-slot ${classes[i]}`;
            if (!entry) {
                slot.style.visibility = "hidden";
                podium.appendChild(slot);
                return;
            }
            slot.innerHTML = `
        <div class="podium-block">${entry.rank}</div>
        <div class="podium-name"></div>
        <div class="podium-score"></div>
      `;
            slot.querySelector(".podium-name").textContent = entry.name;
            slot.querySelector(".podium-score").textContent = `${entry.score}/${entry.totalQuestions} · ${formatTime(entry.timeTakenSeconds)}`;
            podium.appendChild(slot);
        });
    }

    function renderList(top3) {
        leaderboardList.innerHTML = "";
        top3.forEach((entry) => {
            const li = document.createElement("li");
            li.innerHTML = `
        <span class="rank-badge">#${entry.rank}</span>
        <span class="lb-name"></span>
        <span class="lb-score">${entry.score}/${entry.totalQuestions}</span>
      `;
            li.querySelector(".lb-name").textContent = entry.name;
            leaderboardList.appendChild(li);
        });
    }

    try {
        const res = await fetch(`${API_BASE_URL}/leaderboard/top3`);
        if (!res.ok) throw new Error("leaderboard unavailable");
        const top3 = await res.json();
        renderPodium(top3);
        renderList(top3);
    } catch (err) {
        lbEmpty.textContent = "Couldn't load the leaderboard right now.";
        lbEmpty.classList.remove("hidden");
        podium.classList.add("hidden");
    }
});

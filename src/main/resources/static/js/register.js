document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const submitBtn = document.getElementById("submitBtn");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
//    const addressInput = document.getElementById("address");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
//    const addressError = document.getElementById("addressError");
    const formError = document.getElementById("formError");

    function clearErrors() {
//        [nameError, emailError, addressError, formError].forEach(el => (el.textContent = ""));
		[nameError, emailError, formError].forEach(el => (el.textContent = ""));
    }

    function validate() {
        clearErrors();
        let ok = true;

        if (!nameInput.value.trim()) {
            nameError.textContent = "Please enter your name.";
            ok = false;
        }
        const emailVal = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal) {
            emailError.textContent = "Please enter your email.";
            ok = false;
        } else if (!emailPattern.test(emailVal)) {
            emailError.textContent = "Enter a valid email address.";
            ok = false;
        }
        /*if (!addressInput.value.trim()) {
            addressError.textContent = "Please enter your address.";
            ok = false;
        }*/
        return ok;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!validate()) return;

        submitBtn.disabled = true;
        submitBtn.textContent = "Starting…";

        try {
            const res = await fetch(`${API_BASE_URL}/participants`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
 //                   address: addressInput.value.trim(),
                }),
            });

            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
//                throw new Error(errBody.email || errBody.name || errBody.address || "Registration failed. Please try again.");
				throw new Error(errBody.email || errBody.name || errBody.error || "Registration failed. Please try again.");
            }

            const data = await res.json();
            sessionStorage.setItem("participantId", data.participantId);
            sessionStorage.setItem("participantName", data.name);
            window.location.href = "quiz.html";
        } catch (err) {
            formError.textContent = err.message || "Something went wrong. Please try again.";
            submitBtn.disabled = false;
            submitBtn.textContent = "Start the quiz →";
        }
    });
});

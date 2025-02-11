document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    const responseMessage = document.getElementById("response-message");

    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const subject = document.getElementById("subject").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) {
                responseMessage.innerHTML = "<span style='color: red;'>Please fill in all required fields.</span>";
                return;
            }

            // ✅ Use URLSearchParams for Google Apps Script
            const formData = new URLSearchParams({ name, email, subject, message });

            try {
                const response = await fetch(
                    "https://script.google.com/macros/s/AKfycbznIWNLF1vG294RaH_MTPHJmq4RORndlm8QDCubrCxWPfyMk2GHw2p29j1UoYVL3AEhnQ/exec", 
                    {
                        method: "POST",
                        body: formData,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" }
                    }
                );

                if (response.ok) {
                    responseMessage.innerHTML = "<span style='color: green;'>Message sent successfully!</span>";
                    form.reset();
                } else {
                    throw new Error("Failed to send message. Please try again later.");
                }
            } catch (error) {
                console.error("Error:", error);
                responseMessage.innerHTML = "<span style='color: red;'>Network error. Please try again.</span>";
            }
        });
    }

    // ✅ Back-to-Top Button
    const topButton = document.createElement("button");
    topButton.innerHTML = "▲";
    topButton.id = "back-to-top";
    Object.assign(topButton.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#555",
        color: "#fff",
        border: "none",
        padding: "10px 15px",
        borderRadius: "5px",
        cursor: "pointer",
        display: "none",
        fontSize: "20px",
        transition: "opacity 0.3s ease-in-out"
    });
    document.body.appendChild(topButton);

    // ✅ Debounced Scroll Event for Performance
    let lastScrollTop = 0;
    const debounce = (func, wait = 100) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const handleScroll = debounce(() => {
        if (window.scrollY > 200) {
            topButton.style.display = "block";
            topButton.style.opacity = "1";
        } else {
            topButton.style.opacity = "0";
            setTimeout(() => (topButton.style.display = "none"), 300);
        }
    });

    window.addEventListener("scroll", handleScroll);

    topButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // ✅ Improved Fade-in Animation using Intersection Observer
    const fadeElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle("visible", entry.isIntersecting);
        });
    }, { threshold: 0.2 }); // Trigger when 20% of the element is visible

    fadeElements.forEach(el => observer.observe(el));

    // ✅ Dark Mode Toggle
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;

    // Apply previously saved dark mode preference
    if (localStorage.getItem("dark-mode") === "enabled") {
        body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", function () {
        const isEnabled = body.classList.toggle("dark-mode");
        localStorage.setItem("dark-mode", isEnabled ? "enabled" : "disabled");
    });
});

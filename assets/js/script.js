// Wait for the DOM to fully load before executing any code
document.addEventListener("DOMContentLoaded", () => {
  /*************************************************
   * 1. Contact Form Submission Handler
   *************************************************/
  const form = document.getElementById("contact-form");
  const responseMessage = document.getElementById("response-message");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate that reCAPTCHA is completed (for standard checkbox reCAPTCHA)
      const captchaResponse = grecaptcha.getResponse();
      console.log("CAPTCHA response:", captchaResponse);
      if (!captchaResponse) {
        responseMessage.textContent = "Please complete the CAPTCHA.";
        responseMessage.className = "error-message";
        return;
      }

      // Retrieve and trim form inputs
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();
      console.log("Form inputs:", { name, email, subject, message });

      // Ensure required fields are filled
      if (!name || !email || !message) {
        responseMessage.textContent = "Please fill in all required fields.";
        responseMessage.className = "error-message";
        return;
      }

      // Validate email format using a regular expression
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        responseMessage.textContent = "Please enter a valid email address.";
        responseMessage.className = "error-message";
        return;
      }

      // Prepare form data in URL-encoded format for submission
      const formData = new URLSearchParams({ name, email, subject, message });
      console.log("FormData to be sent:", formData.toString());

      try {
        // Send the form data to the Google Apps Script endpoint
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbw33G3AZEuxFF8zAPKjlJGMSciK-UkcPGnTZeAFFKTBDL9YFjJX4164zszl-3oYv62z/exec",
          {
            method: "POST",
            body: formData,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );
        console.log("Fetch response status:", response.status);

        if (response.ok) {
          responseMessage.textContent = "Message sent successfully!";
          responseMessage.className = "success-message";
          form.reset();
          // Reset the reCAPTCHA widget after successful submission
          grecaptcha.reset();
        } else {
          throw new Error("Failed to send message. Please try again later.");
        }
      } catch (error) {
        console.error("Contact form error:", error);
        responseMessage.textContent = "Network error. Please try again.";
        responseMessage.className = "error-message";
      }
    });
  }

  /*************************************************
   * 2. Back-to-Top Button Setup
   *************************************************/
  // Create the button element and assign an ID
  const topButton = document.createElement("button");
  topButton.innerHTML = "▲";
  topButton.id = "back-to-top";

  // Apply inline styles to the button for positioning and appearance
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
    transition: "opacity 0.3s ease-in-out",
  });
  document.body.appendChild(topButton);

  // Debounce function to limit how frequently the scroll event fires
  const debounce = (func, wait = 100) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Scroll event handler to show/hide the back-to-top button
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

  // Add smooth scroll behavior when the back-to-top button is clicked
  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /*************************************************
   * 3. Fade-In Animation with Intersection Observer
   *************************************************/
  // Select all elements with the .fade-in class
  const fadeElements = document.querySelectorAll(".fade-in");

  // Create an IntersectionObserver to toggle the 'visible' class when elements enter the viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("visible", entry.isIntersecting);
      });
    },
    { threshold: 0.2 } // Trigger when 20% of the element is visible
  );
  fadeElements.forEach((el) => observer.observe(el));

  /*************************************************
   * 4. Dark Mode Toggle Functionality
   *************************************************/
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;

  // Apply saved dark mode preference from localStorage, if available
  if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
  }

  // Toggle dark mode on button click and update localStorage
  darkModeToggle.addEventListener("click", () => {
    const isEnabled = body.classList.toggle("dark-mode");
    localStorage.setItem("dark-mode", isEnabled ? "enabled" : "disabled");
  });
});

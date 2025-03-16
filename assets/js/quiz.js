// Wait until the DOM is fully loaded before running any quiz code
document.addEventListener("DOMContentLoaded", () => {
    /****************************************************
     * 1. Multi-Step Quiz Navigation Setup
     ****************************************************/
    // Select all quiz step containers
    const quizSteps = document.querySelectorAll(".quiz-step");
    // Track the current step index (starting at 0)
    let currentStep = 0;
  
    /**
     * Displays the quiz step corresponding to the given index.
     * Hides all other steps.
     *
     * @param {number} index - The index of the step to show.
     */
    function showStep(index) {
      quizSteps.forEach((step, i) => {
        // Add "active" class if this is the current step; otherwise, remove it
        step.classList.toggle("active", i === index);
      });
    }
  
    /**
     * Moves to the next quiz step.
     * Validates that the current step has an answer selected before proceeding.
     */
    function nextStep() {
      // Get all radio inputs in the current step
      const currentInputs = quizSteps[currentStep].querySelectorAll('input[type="radio"]');
      // Check if at least one answer is selected
      const isChecked = [...currentInputs].some(input => input.checked);
  
      if (!isChecked) {
        alert("Please select an answer before proceeding.");
        return;
      }
  
      // If not on the last step, move to the next step
      if (currentStep < quizSteps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    }
  
    /**
     * Moves to the previous quiz step.
     */
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    }
  
    /****************************************************
     * 2. Quiz Result Calculation
     ****************************************************/
    /**
     * Calculates the quiz results and displays the final zodiac interpretation.
     *
     * @param {Event} event - The form submission event.
     */
    function finishQuiz(event) {
      event.preventDefault();
  
      // Validate that the last step has an answer selected
      const lastInputs = quizSteps[currentStep].querySelectorAll('input[type="radio"]');
      const isChecked = [...lastInputs].some(input => input.checked);
      if (!isChecked) {
        alert("Please select an answer for the last question.");
        return;
      }
  
      // Gather all answers from the quiz (assumes 10 questions with names q1 to q10)
      const answers = {};
      for (let i = 1; i <= 10; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected) {
          const sign = selected.value;
          // Count the frequency of each zodiac sign answer
          answers[sign] = (answers[sign] || 0) + 1;
        }
      }
  
      // Determine the dominant zodiac sign based on the highest count
      let maxSign = null;
      let maxCount = 0;
      for (const sign in answers) {
        if (answers[sign] > maxCount) {
          maxCount = answers[sign];
          maxSign = sign;
        }
      }
  
      // Predefined interpretations for each zodiac sign
      const interpretations = {
        Aries: "You are bold and energetic, always ready to take the lead.",
        Taurus: "You value stability, comfort, and loyalty in all you do.",
        Gemini: "You are versatile, social, and thrive on mental stimulation.",
        Cancer: "You are empathetic, caring, and value emotional security.",
        Leo: "You are confident, creative, and shine in the spotlight.",
        Virgo: "You are analytical, practical, and detail-oriented.",
        Libra: "You seek balance, harmony, and fairness in every situation.",
        Scorpio: "You are intense, passionate, and value deep connections.",
        Sagittarius: "You are adventurous, optimistic, and crave freedom.",
        Capricorn: "You are disciplined, ambitious, and strive for achievement.",
        Aquarius: "You are innovative, independent, and champion individuality.",
        Pisces: "You are imaginative, compassionate, and deeply intuitive."
      };
  
      // Display the result in the designated container
      const quizResult = document.getElementById("quiz-result");
      quizResult.innerHTML = `
        <h4>Your Zodiac Quiz Result</h4>
        <p><strong>Your dominant zodiac trait:</strong> ${maxSign}</p>
        <p>${interpretations[maxSign] || "No interpretation found."}</p>
        <p>Want to learn more about your zodiac? <a href="index.html#five">Explore our insights</a> or <a href="index.html#six">contact us</a> for a detailed reading.</p>
      `;
  
      // Smoothly scroll to the result section
      quizResult.scrollIntoView({ behavior: "smooth" });
    }
  
    /****************************************************
     * 3. Attach Event Listeners to Quiz Navigation Buttons
     ****************************************************/
    quizSteps.forEach((step) => {
      // Next button listener
      const nextBtn = step.querySelector(".next-btn");
      if (nextBtn) {
        nextBtn.addEventListener("click", nextStep);
      }
      // Previous button listener
      const prevBtn = step.querySelector(".prev-btn");
      if (prevBtn) {
        prevBtn.addEventListener("click", prevStep);
      }
      // Finish button listener
      const finishBtn = step.querySelector(".finish-btn");
      if (finishBtn) {
        finishBtn.addEventListener("click", finishQuiz);
      }
    });
  
    // Initialize the quiz by displaying the first step
    showStep(currentStep);
  });
  
// ===========================
// Countdown Timer
// ===========================
const countdownDate = new Date("October 18, 2025 00:00:00").getTime();

const timer = setInterval(() => {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  if (distance <= 0) {
    clearInterval(timer);
    document.querySelector(".countdown").innerHTML = "We are live!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, '0');
  document.getElementById("hours").textContent = String(hours).padStart(2, '0');
  document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
  document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
}, 1000);


// ===========================
// Smooth Scroll
// ===========================
function scrollToSection() {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
}


// ===========================
// Email Format Validator
// ===========================
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}


// ===========================
// Show Popup
// ===========================
function showPopup(type, customMsg = null) {
  const popupId = type === "success" ? "success-popup" : "error-popup";
  const popup = document.getElementById(popupId);

  if (!popup) {
    console.error("Popup element not found:", popupId);
    return;
  }

  // Custom message (optional)
  if (customMsg) {
    const messagePara = popup.querySelector("p");
    if (messagePara) messagePara.textContent = customMsg;
  }

  popup.classList.remove("hidden");

  if (type === "success") {
    playSuccessSound();
  }

  setTimeout(() => {
    popup.classList.add("hidden");
  }, 4000);
}

function closePopup(id) {
  const popup = document.getElementById(id);
  if (popup) {
    popup.classList.add("hidden");
  }
}


// ===========================
// Play Sound on Success
// ===========================
function playSuccessSound() {
  const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3");
  audio.play();
}


// ===========================
// Email Submission Logic
// ===========================
const ABSTRACT_API_KEY = "e17da560e0a3413ba4e8b0b6eb64c6bd"; // Replace with your key

const form = document.getElementById("notify-form");
const submitBtn = form.querySelector("button");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  if (!validateEmail(email)) {
    showPopup("error", "Please enter a valid email address.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    // Step 1: Abstract API email validation
    const verifyRes = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}&email=${email}`);
    const verifyData = await verifyRes.json();

    console.log("Abstract API Response:", verifyData);

    const isDeliverable = verifyData.deliverability === "DELIVERABLE";
    const isGmail = verifyData.is_free_email?.value && email.endsWith("@gmail.com");

    if (!isDeliverable || !isGmail) {
      showPopup("error", "Please use a valid and deliverable Gmail address.");
      return;
    }

    // Step 2: Send to Formspree
    const response = await fetch("https://formspree.io/f/mdkdwovo", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    console.log("Formspree response status:", response.status);

    if (response.ok) {
      showPopup("success", "✅ Email Sent Successfully!");
      form.reset();
    } else {
      const resData = await response.json();
      console.error("Formspree error:", resData);
      const message = resData?.errors?.[0]?.message || "Something went wrong!";
      showPopup("error", message);
    }

  } catch (err) {
    console.error("Network or Validation Error:", err);
    showPopup("error", "Something went wrong. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Notify Me";
  }
});

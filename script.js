const revealElements = document.querySelectorAll(".reveal");
const bundleCopy = document.querySelector("#bundle-copy");
const offerCards = document.querySelectorAll("[data-bundle]");
const bundleSelect = document.querySelector("#bundle-select");
const checkoutForm = document.querySelector("#checkout-form");
const formStatus = document.querySelector("#form-status");
const hiddenFormFrame = document.querySelector("#hidden-form-frame");
const chatToggle = document.querySelector("#chat-toggle");
const chatPanel = document.querySelector("#chat-panel");
const chatClose = document.querySelector("#chat-close");
const chatForm = document.querySelector("#chat-form");
const chatThread = document.querySelector("#chat-thread");
const chatMessage = document.querySelector("#chat-message");
let isSubmittingOrder = false;

function setFormStatus(type, message) {
  if (!formStatus) return;
  formStatus.className = `form-status is-visible is-${type}`;
  formStatus.textContent = message;
}

function setBundleValue(bundle) {
  if (!bundleSelect) return;
  if (bundle === "1 Unit") bundleSelect.value = "One Unit - NGN 22,999";
  if (bundle === "2 Units") bundleSelect.value = "Two Units - NGN 42,999";
  if (bundle === "3 Units") bundleSelect.value = "Three Units - NGN 63,999";
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((element) => observer.observe(element));

offerCards.forEach((card) => {
  const updateBundle = () => {
    const bundle = card.getAttribute("data-bundle");
    bundleCopy.textContent = `${bundle} selected. Use this final section as your order handoff for WhatsApp, a form embed, or direct checkout.`;
    setBundleValue(bundle);
  };

  card.addEventListener("mouseenter", updateBundle);
  card.addEventListener("focusin", updateBundle);
});

bundleSelect?.addEventListener("change", () => {
  bundleCopy.textContent = `${bundleSelect.value} selected. Fill the form and submit your order.`;
});

checkoutForm?.addEventListener("submit", (event) => {
  if (!checkoutForm.reportValidity()) return;

  const submitButton = checkoutForm.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
  }

  isSubmittingOrder = true;
  setFormStatus("success", "Submitting your order...");
});

hiddenFormFrame?.addEventListener("load", () => {
  if (!isSubmittingOrder) return;

  isSubmittingOrder = false;
  checkoutForm?.reset();
  if (bundleSelect) {
    bundleSelect.value = "Two Units - NGN 42,999";
  }
  bundleCopy.textContent = "Order submitted successfully. We will contact you shortly after reviewing your details.";
  setFormStatus("success", "Order submitted successfully. We will contact you shortly.");

  const submitButton = checkoutForm?.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = "Submit order";
  }
});

function openChatPanel() {
  if (!chatPanel || !chatToggle) return;
  chatPanel.hidden = false;
  chatToggle.setAttribute("aria-expanded", "true");
  chatMessage?.focus();
}

function closeChatPanel() {
  if (!chatPanel || !chatToggle) return;
  chatPanel.hidden = true;
  chatToggle.setAttribute("aria-expanded", "false");
}

chatToggle?.addEventListener("click", () => {
  if (chatPanel?.hidden) {
    openChatPanel();
  } else {
    closeChatPanel();
  }
});

chatClose?.addEventListener("click", closeChatPanel);

chatForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = chatMessage?.value.trim();
  if (!message || !chatThread) return;

  const userBubble = document.createElement("article");
  userBubble.className = "chat-bubble chat-bubble-user";
  userBubble.textContent = message;
  chatThread.appendChild(userBubble);
  chatThread.scrollTop = chatThread.scrollHeight;
  chatMessage.value = "";

  const whatsappMessage = [
    "Hello G&DSquare, I need assistance with the UV Toilet Sterilizer.",
    `Message: ${message}`,
  ].join("\n");

  window.setTimeout(() => {
    window.open(
      `https://wa.me/2347076816040?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank",
      "noopener"
    );
  }, 320);
});

const revealElements = document.querySelectorAll(".reveal");
const bundleCopy = document.querySelector("#bundle-copy");
const offerCards = document.querySelectorAll("[data-bundle]");
const bundleSelect = document.querySelector("#bundle-select");
const checkoutForm = document.querySelector("#checkout-form");
const formStatus = document.querySelector("#form-status");

function encodeFormData(data) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
}

function setFormStatus(type, message) {
  if (!formStatus) return;

  formStatus.className = `form-status is-visible is-${type}`;
  formStatus.textContent = message;
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
  {
    threshold: 0.16,
  }
);

revealElements.forEach((element) => observer.observe(element));

offerCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    const bundle = card.getAttribute("data-bundle");
    bundleCopy.textContent = `${bundle} selected. Use this final section as your order handoff for WhatsApp, a form embed, or direct checkout.`;
    if (bundleSelect) {
      if (bundle === "1 Unit") bundleSelect.value = "One Unit - ₦22,999";
      if (bundle === "2 Units") bundleSelect.value = "Two Units - ₦42,999";
      if (bundle === "3 Units") bundleSelect.value = "Three Units - ₦63,999";
    }
  });

  card.addEventListener("focusin", () => {
    const bundle = card.getAttribute("data-bundle");
    bundleCopy.textContent = `${bundle} selected. Use this final section as your order handoff for WhatsApp, a form embed, or direct checkout.`;
    if (bundleSelect) {
      if (bundle === "1 Unit") bundleSelect.value = "One Unit - ₦22,999";
      if (bundle === "2 Units") bundleSelect.value = "Two Units - ₦42,999";
      if (bundle === "3 Units") bundleSelect.value = "Three Units - ₦63,999";
    }
  });
});

if (bundleSelect) {
  bundleSelect.addEventListener("change", () => {
    bundleCopy.textContent = `${bundleSelect.value} selected. Fill the form and send the order on WhatsApp.`;
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!checkoutForm.reportValidity()) {
      return;
    }

    const submitButton = checkoutForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    const formData = new FormData(checkoutForm);
    const payload = {};
    formData.forEach((value, key) => {
      payload[key] = value.toString();
    });

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodeFormData(payload),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      checkoutForm.reset();
      if (bundleSelect) {
        bundleSelect.value = "Two Units - ₦42,999";
      }
      bundleCopy.textContent = "Order submitted successfully. We will contact you shortly after reviewing your details.";
      setFormStatus("success", "Order submitted successfully. Check your Netlify dashboard for the new submission.");
    } catch (error) {
      setFormStatus("error", "Order could not be submitted right now. Please try again or send your order on WhatsApp.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit order";
      }
    }
  });
}

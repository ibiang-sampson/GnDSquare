const revealElements = document.querySelectorAll(".reveal");
const bundleCopy = document.querySelector("#bundle-copy");
const offerCards = document.querySelectorAll("[data-bundle]");
const bundleSelect = document.querySelector("#bundle-select");
const checkoutForm = document.querySelector("#checkout-form");

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
  checkoutForm.addEventListener("submit", (event) => {
    if (!checkoutForm.reportValidity()) {
      event.preventDefault();
      return;
    }
  });
}

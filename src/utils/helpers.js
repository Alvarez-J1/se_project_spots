export function setButtonText(
  submitBtn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving…"
) {
  if (isLoading) {
    submitBtn.textContent = loadingText;
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
  } else {
    submitBtn.textContent = defaultText;
    submitBtn.removeAttribute("aria-busy");
    if (!submitBtn.classList.contains("modal__submit-btn_disabled")) {
      submitBtn.disabled = false;
    }
  }
}

export function showFormError(formEl, message) {
  let errorEl = formEl.querySelector(".modal__form-error");
  if (!errorEl) {
    errorEl = document.createElement("p");
    errorEl.className = "modal__form-error";
    errorEl.setAttribute("role", "alert");
    formEl.prepend(errorEl);
  }
  errorEl.textContent =
    message || "Something went wrong. Please try again.";
  errorEl.hidden = false;
}

export function clearFormError(formEl) {
  const errorEl = formEl.querySelector(".modal__form-error");
  if (errorEl) {
    errorEl.hidden = true;
    errorEl.textContent = "";
  }
}

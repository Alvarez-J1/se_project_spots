export function setButtonText(
  submitBtn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving.."
) {
  if (isLoading) {
    submitBtn.textContent = loadingText;
  } else {
    submitBtn.textContent = defaultText;
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

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

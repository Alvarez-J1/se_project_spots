export function setButtonText(
  submitBtn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..",
  deleteCard = "Deleting"
) {
  if (isLoading) {
    submitBtn.textContent = loadingText;
  } else {
    submitBtn.textContent = defaultText;
  }
}

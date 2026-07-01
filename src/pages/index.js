import logoSrc from "../images/logo.svg";
import { setButtonText } from "../utils/helpers.js";
import editBtnSrc from "../images/editBtnSrc.svg";
import plusSrc from "../images/plus.svg";
import Api from "../utils/Api.js";
const plusImage = document.getElementById("plus__image");
plusImage.src = plusSrc;

const PencilImage = document.getElementById("pencil__image");
PencilImage.src = editBtnSrc;

const logoImage = document.getElementById("logo__image");
logoImage.src = logoSrc;

const footerYear = document.querySelector(".footer__year");
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "./validation.js";

//profile elements
const editProfileModal = document.querySelector("#edit-profile-modal");
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAddButton = document.querySelector(".profile__add-btn");
const profileAvatar = document.querySelector(".profile__avatar");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const profileSection = document.querySelector(".profile");
const cardsSection = document.querySelector(".cards");
const profileLoadError = document.getElementById("profile-load-error");
const editModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const avatarModalBtn = document.querySelector(".profile__avatar-btn");
// Form Elements
const profileForm = document.forms["profile-form"];
const editModalCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const cardModal = document.querySelector("#add-card-modal");
const cardForm = document.forms["card-form"];
const cardSubmitButton = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector("#add-profile-close-btn");

// Avatar Elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = document.forms["avatar-form"];
const avatarSubmitButton = avatarModal.querySelector("#avatar__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector("#avatar__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

// Delete Form Elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.forms["remove-form"];
const cancelBtn = deleteModal.querySelector("#cancel-btn");

// Card-related
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardNameInput = cardModal.querySelector("#add-card-name-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn-preview"
);

let selectedCard;
let selectedCardId;

const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

// Find all close buttons
const closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach((button) => {
  // Find the closest popup only once
  const popup = button.closest(".modal");
  // Set the listener
  button.addEventListener("click", () => closeModal(popup));
});

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "40811508-9c36-428c-adef-ee0a4e68ed5a",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    profileAvatar.src = userData.avatar;
    profileNameElement.textContent = userData.name;
    profileDescriptionElement.textContent = userData.about;
    cards.forEach((item) => {
      renderCard(item);
    });
  })

  .catch((err) => {
    console.error(err);
    profileLoadError.hidden = false;
  })
  .finally(() => {
    profileSection.removeAttribute("aria-busy");
    cardsSection.removeAttribute("aria-busy");
  });

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23ece3cf'/%3E%3Ctext x='50%25' y='50%25' fill='%23a89c80' font-family='Poppins, Arial, sans-serif' font-size='22' text-anchor='middle' dominant-baseline='middle'%3EImage unavailable%3C/text%3E%3C/svg%3E";

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardImageBtn = cardElement.querySelector(".card__image-btn");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardRemoveBtn = cardElement.querySelector(".card__remove-btn");

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
    cardElement.classList.add("card_liked");
  }
  cardLikeBtn.setAttribute("aria-pressed", data.isLiked ? "true" : "false");

  cardNameEl.textContent = data.name;
  cardImageEl.alt = data.name;
  cardImageEl.addEventListener("error", () => {
    cardImageEl.src = PLACEHOLDER_IMAGE;
    cardImageEl.alt = `${data.name} (image unavailable)`;
  });
  cardImageEl.src = data.link;

  cardImageBtn.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.alt = data.name;
  });

  cardLikeBtn.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  cardRemoveBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );
  //cardRemoveBtn.classList.toggle("card__remove-btn_hovered");
  return cardElement;
}

let lastFocusedElement;

function openModal(modal) {
  lastFocusedElement = document.activeElement;
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
  const closeBtn = modal.querySelector(".modal__close-btn");
  if (closeBtn) {
    closeBtn.focus();
  }
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened"); // Find the currently open modal
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function handleLike(evt, cardId) {
  const isLiked = evt.target.classList.contains("card__like-btn_liked");
  api
    .changeLikeStatus(cardId, isLiked)
    .then((updatedData) => {
      if (updatedData.isLiked) {
        evt.target.classList.add("card__like-btn_liked");
      } else {
        evt.target.classList.remove("card__like-btn_liked");
      }
      evt.target.setAttribute("aria-pressed", updatedData.isLiked ? "true" : "false");
    })
    .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileNameElement.textContent = data.name;
      profileDescriptionElement.textContent = data.about;
      evt.target.reset();
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  const avatar = avatarInput.value;
  api
    .editAvatar(avatar)
    .then((userData) => {
      profileAvatar.src = userData.avatar;
      evt.target.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");
  api
    .removeCard(selectedCardId) // pass the ID the the api function
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
      // close the modal
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };
  api
    .addNewCard(inputValues)
    .then((data) => {
      renderCard(data);
      evt.target.reset();
      disableButton(cardSubmitButton, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileNameElement.textContent;
  editModalDescriptionInput.value = profileDescriptionElement.textContent;
  resetValidation(
    profileForm,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

profileAddButton.addEventListener("click", () => {
  openModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarFormSubmit);

profileForm.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

cancelBtn.addEventListener("click", (evt) => {
  evt.preventDefault();
  closeModal(deleteModal);
});

enableValidation(settings);

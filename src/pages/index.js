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

import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "./validation.js";

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Golden Gate Bridge",
//     link: " https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
// ];

//profile elements
const editProfileModal = document.querySelector("#edit-profile-modal");
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAddButton = document.querySelector(".profile__add-btn");
const profileAvatar = document.querySelector(".profile__avatar");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
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
    console.log(cards);
    console.log(userData);

    profileAvatar.src = userData.avatar;
    profileNameElement.textContent = userData.name;
    profileDescriptionElement.textContent = userData.about;
    console.log("Avatar URL:", userData.avatar);

    console.log("User Data:", userData);
    cards.forEach((item) => {
      renderCard(item);
    });
  })

  .catch((err) => {
    console.error(err);
  });

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardRemoveBtn = cardElement.querySelector(".card__remove-btn");

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
    cardElement.classList.add("card_liked");
  }

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardImageEl.addEventListener("click", () => {
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

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
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
      const updatedIsLiked = updatedData.likes && updatedData.likes.length > 0;

      if (updatedData.isLiked) {
        evt.target.classList.add("card__like-btn_liked");
      } else {
        evt.target.classList.remove("card__like-btn_liked");
      }
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

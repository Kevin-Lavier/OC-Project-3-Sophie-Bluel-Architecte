// Global variable

let modal = null;

// Function Open Modal
const openModal = function (e) {
  e.preventDefault();
  // Select bloc "modifier" that will open modal when clicked
  const target = document.querySelector(
    e.target.closest(".js-modal").getAttribute("href")
  );
  target.style.display = "flex";
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);

  // Display gallery in modal1
  if (modal.id === "modal1") {
    displayModalGallery(works);
  }
};

//Function Close Modal with different ways to close it
const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  if (modal.querySelector(".js-modal-close")) {
    modal
      .querySelector(".js-modal-close")
      .removeEventListener("click", closeModal);
  }
  if (modal.querySelector(".js-modal-stop")) {
    modal
      .querySelector(".js-modal-stop")
      .removeEventListener("click", stopPropagation);
  }
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

// Function that display gallery in modal
function displayModalGallery(works) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  // Loop to manipulate DOM and create dynamically gallery
  works.forEach((work) => {
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");
    trashIcon.dataset.id = work.id; // Store the work ID in a data attribute

    trashIcon.addEventListener("click", deleteWork);

    imgContainer.appendChild(img);
    imgContainer.appendChild(trashIcon);
    modalGallery.appendChild(imgContainer);
  });
}

// Gloval variable that need loaded DOM to work correctly
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("input-form");
  const titleInput = document.getElementById("input-texte");
  const titleError = document.getElementById("title-error");
  const photoInput = document.getElementById("input-photo");
  const photoError = document.getElementById("photo-error");
  const categorySelect = document.getElementById("categorie");
  const categoryError = document.getElementById("category-error");
  const validateButton = form.querySelector(".add-photo-button");

  const validateForm = () => {
    let isValid = true;

    // Check if the photo is selected and its size
    if (!photoInput.files[0]) {
      isValid = false;
    } else if (photoInput.files[0].size > 4 * 1024 * 1024) {
      isValid = false;
    }

    // Check title length
    const title = titleInput.value;
    if (title.length < 3 || title.length > 40) {
      isValid = false;
    }

    // Check if category is selected
    const category = categorySelect.value;
    if (!category) {
      isValid = false;
    }

    // Update the button style based on validation
    if (isValid) {
      validateButton.style.background = "#1D6154";
      validateButton.style.border = "2px solid #1D6154";
      validateButton.style.color = "#ffffff";
    } else {
      validateButton.style.background = "#A7A7A7";
      validateButton.style.border = "2px solid #A7A7A7";
      validateButton.style.color = "#ffffff";
    }

    return isValid;
  };

  // Create visualization of the selected picture
  photoInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    photoError.textContent = "";

    if (file.size > 4 * 1024 * 1024) {
      photoError.textContent = "L'image doit faire moins de 4mo.";
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const fenetreAjout = document.querySelector(".fenetre-ajout");
      fenetreAjout.innerHTML = ""; // Clear the previous content

      const imgPreview = document.createElement("img");
      imgPreview.src = e.target.result;
      imgPreview.style.width = "100%";
      imgPreview.style.height = "auto";

      fenetreAjout.appendChild(imgPreview);

      validateForm();
    };

    if (file) {
      reader.readAsDataURL(file);
    }

    validateForm();
  });

  titleInput.addEventListener("input", validateForm);
  categorySelect.addEventListener("change", validateForm);

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Perform final validation before submit
    let isValid = true;
    const title = titleInput.value;
    const photo = photoInput.files[0];
    const category = categorySelect.value;

    // Reset error messages
    titleError.textContent = "";
    photoError.textContent = "";
    categoryError.textContent = "";

    if (!photo) {
      photoError.textContent = "Vous devez choisir une image.";
      isValid = false;
    } else if (photo.size > 4 * 1024 * 1024) {
      photoError.textContent = "L'image doit faire moins de 4 mo.";
      isValid = false;
    }

    if (title.length < 3) {
      titleError.textContent = "Le titre doit faire entre 3 et 40 caractères.";
      isValid = false;
    } else if (title.length > 40) {
      titleError.textContent = "Le titre doit faire entre 3 et 40 caractères.";
      isValid = false;
    }

    if (!category) {
      categoryError.textContent = "Veuillez sélectionner une catégorie.";
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", photo);
    formData.append("category", category);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newWork = await response.json();
        works.push(newWork);

        // Update the galleries
        displayWorks(works);
        displayModalGallery(works);

        // Close the modal and reset the form
        closeModal(event);
        form.reset();
        document.querySelector(".fenetre-ajout").innerHTML = `
          <i class="fas fa-image large-icon" style="color: #B9C5CC;"></i>
          <input class="hidden" type="file" id="input-photo" accept="image/jpeg, image/png" name="image" required>
          <label for="input-photo">+ Ajouter Photo</label>
          <p>jpg, png : 4mo max</p>
        `;
      } else {
        throw new Error("Erreur lors de l'ajout du projet");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout du projet");
    }
  });

  validateForm(); // Initial call to set the correct button style
});

// Function to send request to the API DELETE
async function deleteWork(event) {
  const workId = event.target.dataset.id;

  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authorization
      },
    });

    if (response.ok) {
      // Remove the work from the local works array
      works = works.filter((work) => work.id != workId);

      // Update the galleries
      displayWorks(works);
      displayModalGallery(works);
    } else {
      throw new Error("Erreur lors de la suppression du projet");
    }
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la suppression du projet");
  }
}

// Interaction between modal1,2 and homepage when clicked
document
  .querySelector(".add-photo-button")
  .addEventListener("click", function () {
    document.getElementById("modal1").style.display = "none";
    document.getElementById("modal2").style.display = "flex";
    modal = document.getElementById("modal2");
    modal.addEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-close")
      .addEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-stop")
      .addEventListener("click", stopPropagation);
  });

document.querySelector(".js-modal-back").addEventListener("click", function () {
  document.getElementById("modal2").style.display = "none";
  document.getElementById("modal1").style.display = "flex";
  modal = document.getElementById("modal1");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
});

document.querySelectorAll(".js-modal-close").forEach((closeButton) => {
  closeButton.addEventListener("click", closeModal);
});

// Function to get categories on form
async function populateCategories() {
  const select = document.getElementById("categorie");

  // Check if select is present
  if (!select) {
    console.error("L'élément select n'a pas été trouvé");
    return;
  }

  // Delete existing content
  select.innerHTML = "";
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (response.ok) {
      const categories = await response.json();

      // Display categories on form
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });
    } else {
      console.error("Erreur lors de la récupération des catégories");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories", error);
  }
}

// Waiting Dom Loaded before start function
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
});

//......API GET WORKS

let works = [];
let categories = [];

const fetchWorks = fetch("http://localhost:5678/api/works");
const fetchCategories = fetch("http://localhost:5678/api/categories");

// Load DOM before execute the function getWorks and addFilterEventListeners

document.addEventListener("DOMContentLoaded", () => {
  getWorks();
  getCategories();
  addFilterEventListeners();
  checkAuthStatus(); // Appel de la fonction pour vérifier l'authentification
});

// Fetch GET api/works

async function getWorks() {
  try {
    const response = await fetchWorks;
    if (response.ok) {
      works = await response.json();
      displayWorks(works);
    } else {
      throw new Error("Impossible de contacter le serveur");
    }
  } catch (error) {
    console.error(error);
  }
}

// Fetch GET api/categories

async function getCategories() {
  try {
    const response = await fetchCategories;
    if (response.ok) {
      categories = await response.json();
    } else {
      throw new Error("Impossible de contacter le serveur pour les catégories");
    }
  } catch (error) {
    console.error(error);
  }
}

// Function that manipulates DOM

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    gallery.appendChild(figure);
    figure.appendChild(img);
    figure.appendChild(figcaption);
  });
}

//......FILTERS

// addEventListener on button that have data-id

function addFilterEventListeners() {
  const filtersSection = document.querySelector("#filters");
  const buttons = filtersSection.querySelectorAll("button");

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const categoryId = event.target.getAttribute("data-id");

      buttons.forEach((btn) => btn.classList.remove("active"));

      event.target.classList.add("active");

      filterWorks(categoryId);
    });
  });
}

// Filters then display projects per category

function filterWorks(categoryId) {
  const filteredWorks =
    categoryId === "all"
      ? works
      : works.filter((work) => work.categoryId == categoryId);
  displayWorks(filteredWorks);
}

//......AUTH STATUS CHECK

function checkAuthStatus() {
  const loginLink = document.getElementById("login");
  const topBar = document.getElementById("top-bar");
  const editLink = document.getElementById("edit-link");

  // Vérifiez si le token est présent dans le stockage local
  const token = localStorage.getItem("token");

  if (token) {
    // Si le token est présent, changer "login" en "logout", afficher la barre noire et le lien "modifier"
    loginLink.textContent = "logout";
    topBar.style.display = "flex"; // Affiche la barre noire
    if (editLink) {
      editLink.style.display = "block"; // Affiche le lien "modifier"
    }
    loginLink.addEventListener("click", (event) => {
      event.preventDefault();
      // Supprimez le token et redirigez vers la page de connexion
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  } else {
    // Si le token n'est pas présent, cacher la barre noire et le lien "modifier"
    topBar.style.display = "none";
    if (editLink) {
      editLink.style.display = "none"; // Cache le lien "modifier"
    }
  }
}

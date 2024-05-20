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
  changeLogStatus(); // Appel de la fonction pour vérifier l'authentification
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

function changeLogStatus() {
  const loginLink = document.getElementById("login");

  const token = localStorage.getItem("token");

  if (token) {
    loginLink.textContent = "logout";
    loginLink.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }
}

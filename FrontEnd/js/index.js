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
  checkAuthStatus();
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

  // Check if token is present in localStorage
  const token = localStorage.getItem("token");

  if (token) {
    // if token OK, "login" ---> "Logout", Display black bar and icon to get access to the modal "Modifier"
    loginLink.textContent = "logout";
    topBar.style.display = "flex"; // Display black bar
    if (editLink) {
      editLink.style.display = "block"; // Icon to get access to the modal "Modifier"
    }
    loginLink.addEventListener("click", (event) => {
      event.preventDefault();
      // Delete Token and go to index.html with new fresh features
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  } else {
    // If no token, no display
    topBar.style.display = "none";
    if (editLink) {
      editLink.style.display = "none"; // Hide icon to get access to the modal "Modifier"
    }
  }
}

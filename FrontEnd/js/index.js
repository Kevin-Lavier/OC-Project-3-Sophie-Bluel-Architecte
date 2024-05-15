//......API GET WORKS

// Fetch GET api/works

async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (response.ok) {
      const works = await response.json();
      displayWorks(works); // Function that manipulate DOM
    } else {
      throw new Error("Impossible de contacter le serveur");
    }
  } catch (error) {
    console.error(error);
  }
}

// Function that manipulate DOM

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

// Load DOM before execute the function getWorks

document.addEventListener("DOMContentLoaded", () => {
  getWorks();
});

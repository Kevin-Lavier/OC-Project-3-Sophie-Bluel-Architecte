document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Save token to local storage or cookies if needed
        localStorage.setItem("token", data.token);
        // Redirect to the homepage
        window.location.href = "index.html";
        console.log("Connecté");
      } else {
        const errorData = await response.json();
        errorMessage.textContent =
          errorData.message || "Identifiant ou mot de passe incorrect";
      }
    } catch (error) {
      errorMessage.textContent =
        "Une erreur est survenue. Veuillez réessayer plus tard.";
    }
  });
});

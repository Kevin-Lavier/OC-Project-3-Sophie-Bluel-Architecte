// User get connected after clicked button "Se connecter"

// Wait DOM loaded before
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async (event) => {
    // Cancel refresh page
    event.preventDefault();

    // Interaction with user taht will fill the .value
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Check if data users by sending value from login page in JSON
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
        // Save token to local storage
        localStorage.setItem("token", data.token);
        // Redirect to the index.html
        window.location.href = "index.html";
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

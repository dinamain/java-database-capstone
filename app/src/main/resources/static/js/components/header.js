function renderHeader() {
  const headerDiv = document.getElementById("header");

  // Root page: reset session and show only logo
  if (window.location.pathname.endsWith("/")) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    headerDiv.innerHTML = `
      <header class="header">
        <div class="logo-section">
          <img src="../assets/images/logo/logo.png" alt="Hospital CMS Logo" class="logo-img">
          <span class="logo-title">Hospital CMS</span>
        </div>
      </header>`;
    return;
  }

  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  // Session expired or invalid
  if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
    localStorage.removeItem("userRole");
    alert("Session expired or invalid login. Please log in again.");
    window.location.href = "/";
    return;
  }

  let headerContent = `
    <header class="header">
      <div class="logo-section">
        <img src="../assets/images/logo/logo.png" alt="Hospital CMS Logo" class="logo-img">
        <span class="logo-title">Hospital CMS</span>
      </div>
      <nav>`;

  // Role-specific buttons
  if (role === "admin") {
    headerContent += `
      <button id="addDocBtn" class="adminBtn" onclick="openModal('addDoctor')">Add Doctor</button>
      <a href="#" onclick="logout()">Logout</a>`;
  } else if (role === "doctor") {
    headerContent += `
      <button class="adminBtn" onclick="selectRole('doctor')">Home</button>
      <a href="#" onclick="logout()">Logout</a>`;
  } else if (role === "patient") {
    headerContent += `
      <button id="patientLogin" class="adminBtn">Login</button>
      <button id="patientSignup" class="adminBtn">Sign Up</button>`;
  } else if (role === "loggedPatient") {
    headerContent += `
      <button id="home" class="adminBtn" onclick="window.location.href='/pages/loggedPatientDashboard.html'">Home</button>
      <button id="patientAppointments" class="adminBtn" onclick="window.location.href='/pages/patientAppointments.html'">Appointments</button>
      <a href="#" onclick="logoutPatient()">Logout</a>`;
  }

  headerContent += `</nav></header>`;

  // Inject into page
  headerDiv.innerHTML = headerContent;

  // Attach listeners to dynamic buttons
  attachHeaderButtonListeners();
}

// Handle button actions after rendering
function attachHeaderButtonListeners() {
  const loginBtn = document.getElementById("patientLogin");
  const signupBtn = document.getElementById("patientSignup");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => openModal("loginPatient"));
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", () => openModal("signupPatient"));
  }
}

// Logout function for admin/doctor
function logout() {
  localStorage.removeItem("userRole");
  localStorage.removeItem("token");
  window.location.href = "/";
}

// Logout for logged-in patient
function logoutPatient() {
  localStorage.removeItem("token");
  localStorage.setItem("userRole", "patient");
  window.location.href = "/pages/patientDashboard.html";
}

// Call render on load
renderHeader();

// Imports
import { getDoctors, filterDoctors } from './services/doctorServices.js';
import { patientSignup, patientLogin } from './services/patientServices.js';
import { createDoctorCard } from './components/doctorCard.js';
import { openModal } from './components/modals.js';

// DOMContentLoaded Initialization
document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards(); // Load all doctors on page load

  // Signup modal trigger
  const signupBtn = document.getElementById("patientSignup");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => openModal("patientSignup"));
  }

  // Login modal trigger
  const loginBtn = document.getElementById("patientLogin");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => openModal("patientLogin"));
  }

  // Filter triggers
  const searchBar = document.getElementById("searchBar");
  const timeFilter = document.getElementById("filterTime");
  const specialtyFilter = document.getElementById("filterSpecialty");

  if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
  if (timeFilter) timeFilter.addEventListener("change", filterDoctorsOnChange);
  if (specialtyFilter) specialtyFilter.addEventListener("change", filterDoctorsOnChange);
});

// Load all doctor cards
async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    doctors.forEach(doctor => {
      const card = createDoctorCard(doctor);
      contentDiv.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load doctors:", error);
    const contentDiv = document.getElementById("content");
    if (contentDiv) contentDiv.innerHTML = "<p>⚠️ Failed to load doctor data. Please try again later.</p>";
  }
}

// Filter doctors dynamically
async function filterDoctorsOnChange() {
  try {
    const name = document.getElementById("searchBar")?.value.trim() || null;
    const time = document.getElementById("filterTime")?.value || null;
    const specialty = document.getElementById("filterSpecialty")?.value || null;

    const response = await filterDoctors(name || null, time || null, specialty || null);
    const doctors = response?.doctors || [];
    const contentDiv = document.getElementById("content");

    contentDiv.innerHTML = "";

    if (doctors.length > 0) {
      doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
      });
    } else {
      contentDiv.innerHTML = "<p>🔍 No doctors found with the given filters.</p>";
    }
  } catch (error) {
    console.error("Failed to filter doctors:", error);
    alert("❌ An error occurred while filtering doctors.");
  }
}

// Handle patient signup form submission
window.signupPatient = async function () {
  try {
    const data = {
      name: document.getElementById("name")?.value,
      email: document.getElementById("email")?.value,
      password: document.getElementById("password")?.value,
      phone: document.getElementById("phone")?.value,
      address: document.getElementById("address")?.value
    };

    const { success, message } = await patientSignup(data);

    if (success) {
      alert(`✅ ${message}`);
      document.getElementById("modal").style.display = "none";
      window.location.reload();
    } else {
      alert(`❌ ${message}`);
    }
  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ An error occurred during signup.");
  }
};

// Handle patient login form submission
window.loginPatient = async function () {
  try {
    const data = {
      email: document.getElementById("email")?.value,
      password: document.getElementById("password")?.value
    };

    const response = await patientLogin(data);

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("token", result.token);
      window.location.href = "/pages/loggedPatientDashboard.html";
    } else {
      alert("❌ Invalid credentials!");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("❌ Failed to log in. Please try again.");
  }
};

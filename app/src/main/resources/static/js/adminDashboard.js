// app/src/main/resources/static/js/adminDashboard.js

import { openModal } from "../components/modals.js";
import { getDoctors, filterDoctors, saveDoctor } from "../services/doctorServices.js";
import { createDoctorCard } from "../components/doctorCard.js"; // Make sure this exists and exports createDoctorCard

// DOM elements
const contentDiv = document.getElementById("content");
const searchBar = document.getElementById("searchBar");
const filterTime = document.getElementById("filterTime");
const filterSpecialty = document.getElementById("filterSpecialty");

// Open Add Doctor Modal when Add Doctor button is clicked
document.getElementById('addDocBtn').addEventListener('click', () => {
  openModal('addDoctor');
});

// Load doctors when page loads
window.onload = function () {
  loadDoctorCards();
};

// Fetch all doctors and render cards
async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Error loading doctors:", error);
    contentDiv.innerHTML = "<p>Error loading doctors.</p>";
  }
}

// Event listeners for filtering doctors dynamically
searchBar.addEventListener("input", filterDoctorsOnChange);
filterTime.addEventListener("change", filterDoctorsOnChange);
filterSpecialty.addEventListener("change", filterDoctorsOnChange);

// Called on filter/search input changes
async function filterDoctorsOnChange() {
  const name = searchBar.value.trim() || null;
  const time = filterTime.value || null;
  const specialty = filterSpecialty.value || null;

  try {
    const doctors = await filterDoctors(name, time, specialty);

    if (doctors && doctors.length > 0) {
      renderDoctorCards(doctors);
    } else {
      contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
    }
  } catch (error) {
    console.error("Filter failed:", error);
    alert("Failed to filter doctors.");
  }
}

// Render doctors as cards in the content div
function renderDoctorCards(doctors) {
  contentDiv.innerHTML = ""; // Clear previous

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

// Handle adding a new doctor via modal form submission
window.adminAddDoctor = async function () {
  const name = document.getElementById("docName").value;
  const email = document.getElementById("docEmail").value;
  const phone = document.getElementById("docPhone").value;
  const password = document.getElementById("docPassword").value;
  const specialty = document.getElementById("docSpecialty").value;
  const availableTime = document.getElementById("docAvailableTime").value;

  // Check for admin token
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Authentication token missing. Please login again.");
    return;
  }

  const doctor = { name, email, phone, password, specialty, availableTime };

  try {
    const result = await saveDoctor(doctor, token);

    if (result.success) {
      alert("Doctor added successfully!");
      location.reload(); // Reload page to refresh doctor list
    } else {
      alert("Failed to add doctor: " + result.message);
    }
  } catch (error) {
    console.error("Add doctor failed:", error);
    alert("Something went wrong while adding the doctor.");
  }
};

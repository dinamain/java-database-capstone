// Import dependencies
import { openModal } from "../components/modals.js";
import { getDoctors, filterDoctors, saveDoctor } from "../services/doctorServices.js";

// DOM elements
const contentDiv = document.getElementById("content");
const searchBar = document.getElementById("searchBar");
const filterTime = document.getElementById("filterTime");
const filterSpecialty = document.getElementById("filterSpecialty");

// Open Add Doctor Modal
document.getElementById('addDocBtn').addEventListener('click', () => {
  openModal('addDoctor');
});

// Load all doctors on page load
window.onload = function () {
  loadDoctorCards();
};

// Fetch and render doctor cards
async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Error loading doctors:", error);
    contentDiv.innerHTML = "<p>Error loading doctors.</p>";
  }
}

// Attach event listeners for filtering
searchBar.addEventListener("input", filterDoctorsOnChange);
filterTime.addEventListener("change", filterDoctorsOnChange);
filterSpecialty.addEventListener("change", filterDoctorsOnChange);

// Handle filter input changes
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

// Render list of doctors as cards
function renderDoctorCards(doctors) {
  contentDiv.innerHTML = ""; // Clear content

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

// Create a doctor card component
function createDoctorCard(doctor) {
  const card = document.createElement("div");
  card.className = "doctor-card";

  card.innerHTML = `
    <h3>Dr. ${doctor.name}</h3>
    <p><strong>Email:</strong> ${doctor.email}</p>
    <p><strong>Specialty:</strong> ${doctor.specialty}</p>
    <p><strong>Available:</strong> ${doctor.availableTime}</p>
  `;

  return card;
}

// Handle adding a new doctor
window.adminAddDoctor = async function () {
  const name = document.getElementById("docName").value;
  const email = document.getElementById("docEmail").value;
  const phone = document.getElementById("docPhone").value;
  const password = document.getElementById("docPassword").value;
  const specialty = document.getElementById("docSpecialty").value;
  const availableTime = document.getElementById("docAvailableTime").value;

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
      location.reload();
    } else {
      alert("Failed to add doctor: " + result.message);
    }
  } catch (error) {
    console.error("Add doctor failed:", error);
    alert("Something went wrong while adding the doctor.");
  }
};

import { showBookingOverlay } from "../pages/loggedPatient.js";
import { deleteDoctor } from "../services/doctorServices.js";
import { getPatientData } from "../services/patientServices.js";

// Function to create and return a doctor card component
export function createDoctorCard(doctor) {
  // Main card container
  const card = document.createElement("div");
  card.classList.add("doctor-card");

  // Get user role from localStorage
  const role = localStorage.getItem("userRole");

  // Doctor info section
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("doctor-info");

  const name = document.createElement("h3");
  name.textContent = doctor.name;

  const specialization = document.createElement("p");
  specialization.textContent = `Specialization: ${doctor.specialization}`;

  const email = document.createElement("p");
  email.textContent = `Email: ${doctor.email}`;

  const availability = document.createElement("p");
  availability.textContent = `Availability: ${doctor.availableSlots?.join(", ") || "N/A"}`;

  // Append info elements
  infoDiv.appendChild(name);
  infoDiv.appendChild(specialization);
  infoDiv.appendChild(email);
  infoDiv.appendChild(availability);

  // Action buttons section
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("card-actions");

  // === Admin Role ===
  if (role === "admin") {
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete";
    removeBtn.classList.add("adminBtn");

    removeBtn.addEventListener("click", async () => {
      const confirmDelete = confirm(`Are you sure you want to delete Dr. ${doctor.name}?`);
      if (!confirmDelete) return;

      const token = localStorage.getItem("token");
      try {
        const deleted = await deleteDoctor(doctor.id, token);
        if (deleted) {
          alert("Doctor deleted successfully!");
          card.remove(); // Remove card from DOM
        } else {
          alert("Failed to delete doctor.");
        }
      } catch (err) {
        console.error("Error deleting doctor:", err);
        alert("An error occurred.");
      }
    });

    actionsDiv.appendChild(removeBtn);
  }

  // === Not Logged-In Patient ===
  else if (role === "patient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.classList.add("adminBtn");

    bookNow.addEventListener("click", () => {
      alert("Please log in first to book an appointment.");
    });

    actionsDiv.appendChild(bookNow);
  }

  // === Logged-In Patient ===
  else if (role === "loggedPatient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.classList.add("adminBtn");

    bookNow.addEventListener("click", async (e) => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        return;
      }

      try {
        const patientData = await getPatientData(token);
        showBookingOverlay(e, doctor, patientData);
      } catch (err) {
        console.error("Booking failed:", err);
        alert("Failed to load booking interface.");
      }
    });

    actionsDiv.appendChild(bookNow);
  }

  // Assemble card
  card.appendChild(infoDiv);
  card.appendChild(actionsDiv);

  return card;
}

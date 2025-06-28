// Import dependencies
import { getAllAppointments } from "../services/appointmentRecordService.js";
import { createPatientRow } from "../components/patientRows.js";

// DOM references
const tableBody = document.getElementById("patientTableBody");
const searchBar = document.getElementById("searchBar");
const todayButton = document.getElementById("todayButton");
const datePicker = document.getElementById("datePicker");

// Global variables
let selectedDate = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
let patientName = null;
const token = localStorage.getItem("token");

// Set default date in date picker on load
if (datePicker) datePicker.value = selectedDate;

// Handle search bar input for patient name
searchBar?.addEventListener("input", () => {
  const value = searchBar.value.trim();
  patientName = value !== "" ? value : "null";
  loadAppointments();
});

// Handle "Today's Appointments" button click
todayButton?.addEventListener("click", () => {
  selectedDate = new Date().toISOString().split("T")[0];
  if (datePicker) datePicker.value = selectedDate;
  loadAppointments();
});

// Handle date picker changes
datePicker?.addEventListener("change", () => {
  selectedDate = datePicker.value;
  loadAppointments();
});

// Load and render appointments
async function loadAppointments() {
  try {
    const appointments = await getAllAppointments(selectedDate, patientName || "null", token);
    tableBody.innerHTML = ""; // Clear previous rows

    if (!appointments || appointments.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5">No Appointments found for ${selectedDate}.</td></tr>`;
      return;
    }

    appointments.forEach((appt) => {
      const patient = {
        id: appt.patientId,
        name: appt.patientName,
        phone: appt.patientPhone,
        email: appt.patientEmail,
        time: appt.time,
        condition: appt.condition
      };
      const row = createPatientRow(patient);
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading appointments:", error);
    tableBody.innerHTML = `<tr><td colspan="5">Error loading appointments. Try again later.</td></tr>`;
  }
}

// Load appointments on initial page load
document.addEventListener("DOMContentLoaded", () => {
  loadAppointments();
});

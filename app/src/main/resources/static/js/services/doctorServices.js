// app/src/main/resources/static/js/services/doctorServices.js

import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + "/doctor";

/**
 * Fetch all doctors from the server
 * @returns {Array} List of doctors or empty array on error
 */
export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API);
    const data = await response.json();
    return data.doctors || [];
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}

/**
 * Delete a doctor by ID using an auth token
 * @param {string} id - Doctor's unique identifier
 * @param {string} token - Authentication token (Admin)
 * @returns {Object} { success: boolean, message: string }
 */
export async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${id}/${token}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return {
      success: response.ok,
      message: result.message || "Doctor deleted",
    };
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the doctor.",
    };
  }
}

/**
 * Save a new doctor record
 * @param {Object} doctor - Doctor details (name, email, availability, etc.)
 * @param {string} token - Authentication token (Admin)
 * @returns {Object} { success: boolean, message: string }
 */
export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctor),
    });
    const result = await response.json();
    return {
      success: response.ok,
      message: result.message || "Doctor saved successfully",
    };
  } catch (error) {
    console.error("Error saving doctor:", error);
    return {
      success: false,
      message: "Failed to save doctor. Please try again.",
    };
  }
}

/**
 * Filter doctors based on name, time, and specialty
 * @param {string|null} name - Doctor name filter
 * @param {string|null} time - Availability time filter
 * @param {string|null} specialty - Specialty filter
 * @returns {Array} Filtered list of doctors or empty array
 */
export async function filterDoctors(name, time, specialty) {
  try {
    // Provide safe defaults to avoid breaking URLs
    const safeName = name || "null";
    const safeTime = time || "null";
    const safeSpecialty = specialty || "null";

    const response = await fetch(
      `${DOCTOR_API}/filter/${safeName}/${safeTime}/${safeSpecialty}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.doctors || [];
    } else {
      console.warn("Failed to filter doctors, status:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error filtering doctors:", error);
    return [];
  }
}

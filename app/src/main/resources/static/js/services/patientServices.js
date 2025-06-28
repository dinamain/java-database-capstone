import { API_BASE_URL } from "../config/config.js";

const PATIENT_API = API_BASE_URL + '/patient';

/**
 * Signup a new patient
 * @param {Object} data - { name, email, password, ... }
 * @returns {Object} { success, message }
 */
export async function patientSignup(data) {
  try {
    const response = await fetch(`${PATIENT_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return { success: true, message: result.message };
  } catch (error) {
    console.error("Error :: patientSignup :: ", error);
    return { success: false, message: error.message };
  }
}

/**
 * Patient login function
 * @param {Object} data - { email, password }
 * @returns {Promise<Response>} - full fetch response (to extract status/token outside)
 */
export async function patientLogin(data) {
  return await fetch(`${PATIENT_API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

/**
 * Get logged-in patient's profile data using token
 * @param {string} token
 * @returns {Object|null} patient object or null
 */
export async function getPatientData(token) {
  try {
    const response = await fetch(`${PATIENT_API}/${token}`);
    const data = await response.json();

    if (response.ok) return data.patient;
    return null;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}

/**
 * Fetch appointments for a patient or doctor
 * Backend decides based on the user param
 * @param {string} id - patient or doctor ID
 * @param {string} token
 * @param {string} user - "patient" or "doctor"
 * @returns {Array|null} appointments array or null
 */
export async function getPatientAppointments(id, token, user) {
  try {
    const response = await fetch(`${PATIENT_API}/${id}/${user}/${token}`);
    const data = await response.json();

    if (response.ok) {
      return data.appointments || [];
    }

    return null;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return null;
  }
}

/**
 * Filter appointments based on condition and patient name
 * @param {string} condition - "pending", "consulted", etc.
 * @param {string} name
 * @param {string} token
 * @returns {Object} { appointments: [] }
 */
export async function filterAppointments(condition, name, token) {
  try {
    const response = await fetch(`${PATIENT_API}/filter/${condition}/${name}/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch appointments:", response.statusText);
      return { appointments: [] };
    }
  } catch (error) {
    console.error("Error filtering appointments:", error);
    alert("Something went wrong!");
    return { appointments: [] };
  }
}

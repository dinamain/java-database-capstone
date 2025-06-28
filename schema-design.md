# Schema Design for Smart Clinic Management System

## MySQL Database Design

### Table: patients
- id: INT, Primary Key, Auto Increment
- name: VARCHAR(100), Not Null
- email: VARCHAR(100), Not Null, Unique
- phone: VARCHAR(15), Not Null
- date_of_birth: DATE, Not Null
- created_at: TIMESTAMP, Default CURRENT_TIMESTAMP

### Table: doctors
- id: INT, Primary Key, Auto Increment
- name: VARCHAR(100), Not Null
- email: VARCHAR(100), Not Null, Unique
- phone: VARCHAR(15), Not Null
- specialization: VARCHAR(100), Not Null
- created_at: TIMESTAMP, Default CURRENT_TIMESTAMP

### Table: appointments
- id: INT, Primary Key, Auto Increment
- doctor_id: INT, Foreign Key → doctors(id), Not Null
- patient_id: INT, Foreign Key → patients(id), Not Null
- appointment_time: DATETIME, Not Null
- status: ENUM('Scheduled', 'Completed', 'Cancelled'), Default 'Scheduled'
- created_at: TIMESTAMP, Default CURRENT_TIMESTAMP

### Table: admin
- id: INT, Primary Key, Auto Increment
- username: VARCHAR(50), Not Null, Unique
- password_hash: VARCHAR(255), Not Null
- email: VARCHAR(100), Not Null, Unique
- created_at: TIMESTAMP, Default CURRENT_TIMESTAMP

<!-- Add any other tables if needed -->

## MongoDB Collection Design

### Collection: prescriptions

```json
{
  "_id": "ObjectId('64abc1234567890abcdef1234')",
  "patientId": 101,
  "appointmentId": 55,
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Every 6 hours"
    },
    {
      "name": "Amoxicillin",
      "dosage": "250mg",
      "frequency": "Twice a day"
    }
  ],
  "doctorNotes": "Patient to take medicines after meals.",
  "refillCount": 2,
  "issuedDate": "2025-06-25T10:00:00Z",
  "pharmacy": {
    "name": "City Pharmacy",
    "address": "123 Main Street"
  }
}

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json();
}

export const api = {
  getPatients: () => request("/patients"),
  getPatient: (id) => request(`/patients/${id}`),
  getAppointmentsByPatient: (patientId) => request(`/appointments?patientId=${patientId}`),
  getDoctor: (id) => request(`/doctors/${id}`),
  getDoctors: () => request("/doctors"),
};

export default api;

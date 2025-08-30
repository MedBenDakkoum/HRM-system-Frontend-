const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:10000";

const api = async (endpoint, method = "GET", body = null, headers = {}) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Ensure cookies are sent
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  if (import.meta.env.MODE === "development") {
    console.log("Fetching:", `${baseURL}${endpoint}`, options); // Debug log
  }
  const response = await fetch(`${baseURL}${endpoint}`, options);
  if (!response.ok) {
    const errorText = await response.text(); // Log response body for details
    console.error("Fetch error:", {
      status: response.status,
      text: errorText,
    });
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// All endpoints (unchanged)
export const endpoints = {
  login: { url: "/api/employees/login", method: "POST" },
  register: { url: "/api/employees/register", method: "POST" },
  getEmployees: { url: "/api/employees", method: "GET" },
  getEmployeeById: { url: "/api/employees/:id", method: "GET" },
  updateEmployee: { url: "/api/employees/:id", method: "PATCH" },
  deleteEmployee: { url: "/api/employees/:id", method: "DELETE" },
  recordAttendance: { url: "/api/attendance", method: "POST" },
  getAttendance: { url: "/api/attendance/employee/:employeeId", method: "GET" },
  generateQrCode: { url: "/api/attendance/qr/:employeeId", method: "GET" },
  scanQrCode: { url: "/api/attendance/scan-qr", method: "POST" },
  facialAttendance: { url: "/api/attendance/facial", method: "POST" },
  recordExit: { url: "/api/attendance/exit", method: "POST" },
  getPresenceReport: {
    url: "/api/attendance/report/:employeeId",
    method: "GET",
  },
  getAllPresenceReports: { url: "/api/attendance/reports", method: "GET" },
  generateAttestation: { url: "/api/documents/attestation", method: "POST" },
  generatePaySlip: { url: "/api/documents/payslip", method: "POST" },
  getEmployeeDocuments: {
    url: "/api/documents/employee/:employeeId",
    method: "GET",
  },
  getAllAttestations: { url: "/api/documents/attestations", method: "GET" },
  downloadDocument: { url: "/api/documents/download/:docId", method: "GET" },
  requestLeave: { url: "/api/leaves", method: "POST" },
  approveLeave: { url: "/api/leaves/approve", method: "POST" },
  getEmployeeLeaves: { url: "/api/leaves/employee/:employeeId", method: "GET" },
  getAllLeaves: { url: "/api/leaves", method: "GET" },
};

export default api;

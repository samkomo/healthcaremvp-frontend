import { useEffect } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import PatientPane from "./components/PatientPane";
import DetailPane from "./components/DetailPane";
import { useHealthcare } from "context/HealthcareContext";

function HealthcareDashboard() {
  const {
    state: {
      patients,
      patientsMeta,
      selectedPatientId,
      filters,
      patient,
      patientMeta,
      appointments,
      appointmentsMeta,
      doctorsById,
    },
    actions: { loadPatients, selectPatient, setSearch },
  } = useHealthcare();

  useEffect(() => {
    if (patientsMeta.status === "idle") {
      loadPatients();
    }
  }, [patientsMeta.status, loadPatients]);

  // Retry functions
  const handleRetryPatients = () => {
    loadPatients();
  };

  const handleRetryPatient = () => {
    if (selectedPatientId) {
      selectPatient(selectedPatientId);
    }
  };

  const handleRetryAppointments = () => {
    if (selectedPatientId) {
      selectPatient(selectedPatientId);
    }
  };

  const showInitialError = patientsMeta.status === "error";

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {showInitialError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Unable to load patients: {patientsMeta.error}
        </Alert>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: { xs: 2, sm: 2.5, md: 3 },
          height: {
            xs: "auto",
            sm: "auto",
            md: "calc(100vh - 140px)",
            lg: "calc(100vh - 160px)",
          },
          alignItems: "stretch",
          px: { xs: 0, sm: 1 },
        }}
      >
        <PatientPane
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelect={selectPatient}
          search={filters.search}
          onSearchChange={setSearch}
          meta={patientsMeta}
          onRetry={handleRetryPatients}
        />
        <DetailPane
          patient={patient}
          patientMeta={patientMeta}
          appointments={appointments}
          appointmentsMeta={appointmentsMeta}
          doctorsById={doctorsById}
          onRetryPatient={handleRetryPatient}
          onRetryAppointments={handleRetryAppointments}
        />
      </Box>
      <Footer />
    </DashboardLayout>
  );
}

export default HealthcareDashboard;

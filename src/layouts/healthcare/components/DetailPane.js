import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Paper from "@mui/material/Paper";
import PatientHeader from "./PatientHeader";
import MedicalHistoryCard from "./MedicalHistoryCard";
import AppointmentList from "./AppointmentList";

export default function DetailPane({
  patient,
  patientMeta,
  appointments,
  appointmentsMeta,
  doctorsById,
  onRetryPatient,
  onRetryAppointments,
}) {
  const isPatientLoading = patientMeta.status === "loading";
  const detailPaneRef = useRef(null);

  // Scroll to top when patient changes
  useEffect(() => {
    if (patient && detailPaneRef.current) {
      detailPaneRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [patient]);

  return (
    <Box
      ref={detailPaneRef}
      sx={{
        width: { xs: "100%", lg: "66.667%" },
        height: {
          xs: "auto",
          sm: "auto",
          md: "calc(100vh - 180px)",
          lg: "100%",
        },
        minHeight: { xs: "500px", sm: "600px" },
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        overflowY: "auto",
        overflowX: "hidden",
        pr: 1,
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.3)",
          },
        },
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isPatientLoading ? (
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="center" mb={3}>
              <Skeleton variant="circular" width={80} height={80} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
              </Box>
            </Stack>
            <Skeleton variant="rectangular" height={120} />
          </CardContent>
        ) : patient ? (
          <>
            <PatientHeader patient={patient} />
            <MedicalHistoryCard medicalHistory={patient.medicalHistory} />
            <Divider />
            <AppointmentList
              appointments={appointments}
              appointmentsMeta={appointmentsMeta}
              doctorsById={doctorsById}
              onRetry={onRetryAppointments}
            />
          </>
        ) : patientMeta.status === "error" ? (
          <CardContent>
            <Alert
              severity="error"
              icon={<Icon>error_outline</Icon>}
              action={
                onRetryPatient && (
                  <Button color="inherit" size="small" onClick={onRetryPatient}>
                    Retry
                  </Button>
                )
              }
            >
              <Typography variant="body2" fontWeight={500}>
                Failed to load patient details
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {patientMeta.error}
              </Typography>
            </Alert>
          </CardContent>
        ) : (
          <CardContent>
            <Paper
              variant="outlined"
              sx={{
                p: 6,
                textAlign: "center",
                bgcolor: "action.hover",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Icon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}>person_outline</Icon>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Patient Selected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a patient from the list to view their details and appointments.
              </Typography>
            </Paper>
          </CardContent>
        )}
      </Card>
    </Box>
  );
}

DetailPane.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    gender: PropTypes.string,
    medicalHistory: PropTypes.string,
  }),
  patientMeta: PropTypes.shape({
    status: PropTypes.string.isRequired,
    error: PropTypes.string,
  }).isRequired,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      dateTime: PropTypes.string.isRequired,
      doctorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      reason: PropTypes.string,
    })
  ).isRequired,
  appointmentsMeta: PropTypes.shape({
    status: PropTypes.string.isRequired,
    error: PropTypes.string,
  }).isRequired,
  doctorsById: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
      specialty: PropTypes.string,
    })
  ).isRequired,
  onRetryPatient: PropTypes.func,
  onRetryAppointments: PropTypes.func,
};

DetailPane.defaultProps = {
  patient: null,
};

import { useState } from "react";
import PropTypes from "prop-types";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

function formatDate(dateTimeString) {
  const date = new Date(dateTimeString);
  const now = new Date();
  const isPast = date < now;

  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { date: dateStr, time: timeStr, isPast };
}

function AppointmentCard({ appointment, doctor }) {
  const [expanded, setExpanded] = useState(false);
  const reason = appointment.reason || "General consultation";
  const MAX_LENGTH = 100;
  const isLong = reason.length > MAX_LENGTH;
  const displayReason = expanded || !isLong ? reason : `${reason.substring(0, MAX_LENGTH)}...`;
  const dateInfo = formatDate(appointment.dateTime);

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 2,
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/* Header with status and date */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Icon
                  sx={{
                    color: dateInfo.isPast ? "text.secondary" : "primary.main",
                    fontSize: "1.2rem",
                  }}
                >
                  {dateInfo.isPast ? "event_busy" : "event"}
                </Icon>
                <Chip
                  label={dateInfo.isPast ? "Past" : "Upcoming"}
                  size="small"
                  color={dateInfo.isPast ? "default" : "primary"}
                  variant={dateInfo.isPast ? "outlined" : "filled"}
                />
              </Stack>
              <Typography variant="subtitle1" fontWeight="bold">
                {dateInfo.date}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dateInfo.time}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          {/* Doctor Information */}
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Icon sx={{ color: "primary.main", mt: 0.5 }}>person</Icon>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {doctor?.name || "Unknown doctor"}
              </Typography>
              <Chip
                label={doctor?.specialty || "Specialty unavailable"}
                size="small"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            </Box>
          </Stack>

          {/* Reason Section */}
          {reason && (
            <>
              <Divider />
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Icon sx={{ color: "text.secondary", mt: 0.5 }}>description</Icon>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Reason for Visit
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      color: "text.primary",
                      lineHeight: 1.6,
                      mb: isLong ? 1 : 0,
                    }}
                  >
                    {displayReason}
                  </Typography>
                  {isLong && (
                    <Button
                      size="small"
                      onClick={() => setExpanded(!expanded)}
                      sx={{ mt: 0.5, textTransform: "none", px: 0 }}
                      startIcon={<Icon>{expanded ? "expand_less" : "expand_more"}</Icon>}
                    >
                      {expanded ? "Show less" : "Show more"}
                    </Button>
                  )}
                </Box>
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
    </Paper>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    dateTime: PropTypes.string.isRequired,
    reason: PropTypes.string,
    doctorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  doctor: PropTypes.shape({
    name: PropTypes.string,
    specialty: PropTypes.string,
  }),
};

AppointmentCard.defaultProps = {
  doctor: undefined,
};

export default function AppointmentList({ appointments, appointmentsMeta, doctorsById, onRetry }) {
  const isAppointmentsLoading = appointmentsMeta.status === "loading";

  return (
    <CardContent
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        display: "flex",
        flexDirection: "column",
        flex: "1 1 auto",
        minHeight: 0,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <Icon color="primary" sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>
          calendar_today
        </Icon>
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
          Appointments
        </Typography>
        {appointments.length > 0 && (
          <Chip
            label={`${appointments.length} ${
              appointments.length === 1 ? "appointment" : "appointments"
            }`}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      </Stack>
      <Divider sx={{ mb: 3 }} />

      {isAppointmentsLoading && (
        <Stack spacing={2}>
          <Skeleton variant="rectangular" height={180} />
          <Skeleton variant="rectangular" height={180} />
        </Stack>
      )}

      {appointmentsMeta.status === "error" && (
        <Alert
          severity="error"
          icon={<Icon>error_outline</Icon>}
          action={
            onRetry && (
              <Button color="inherit" size="small" onClick={onRetry}>
                Retry
              </Button>
            )
          }
        >
          <Typography variant="body2" fontWeight={500}>
            Failed to load appointments
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {appointmentsMeta.error}
          </Typography>
        </Alert>
      )}

      {!isAppointmentsLoading &&
        appointmentsMeta.status === "success" &&
        appointments.length === 0 && (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "action.hover",
            }}
          >
            <Icon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}>event_busy</Icon>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Appointments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This patient has no scheduled appointments.
            </Typography>
          </Paper>
        )}

      {!isAppointmentsLoading &&
        appointmentsMeta.status === "success" &&
        appointments.length > 0 && (
          <Stack spacing={2}>
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                doctor={doctorsById[appointment.doctorId]}
              />
            ))}
          </Stack>
        )}
    </CardContent>
  );
}

AppointmentList.propTypes = {
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
  onRetry: PropTypes.func,
};

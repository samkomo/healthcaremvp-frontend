import { useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";

const renderSkeleton = () =>
  Array.from({ length: 6 }).map((_, index) => (
    <Box key={index} sx={{ px: 2, py: 1.5 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mt: 0.5 }} />
        </Box>
      </Stack>
    </Box>
  ));

export default function PatientList({
  patients,
  selectedPatientId,
  onSelect,
  search,
  meta,
  onRetry,
}) {
  const listRef = useRef(null);
  const selectedIndexRef = useRef(-1);
  const itemRefs = useRef({});

  // Update selected index when selection changes
  useEffect(() => {
    if (selectedPatientId && patients.length > 0) {
      selectedIndexRef.current = patients.findIndex((p) => p.id === selectedPatientId);
    }
  }, [selectedPatientId, patients]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (meta.status !== "success" || patients.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (selectedIndexRef.current < patients.length - 1) {
            const nextIndex = selectedIndexRef.current + 1;
            onSelect(patients[nextIndex].id);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (selectedIndexRef.current > 0) {
            const prevIndex = selectedIndexRef.current - 1;
            onSelect(patients[prevIndex].id);
          }
          break;
        case "Home":
          e.preventDefault();
          if (patients.length > 0) {
            onSelect(patients[0].id);
          }
          break;
        case "End":
          e.preventDefault();
          if (patients.length > 0) {
            onSelect(patients[patients.length - 1].id);
          }
          break;
        default:
          break;
      }
    },
    [meta.status, patients, onSelect]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Scroll to selected item
  useEffect(() => {
    if (selectedPatientId && itemRefs.current[selectedPatientId] && listRef.current) {
      const itemRef = itemRefs.current[selectedPatientId];
      const listRect = listRef.current.getBoundingClientRect();
      const itemRect = itemRef.getBoundingClientRect();

      if (itemRect.top < listRect.top || itemRect.bottom > listRect.bottom) {
        itemRef.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedPatientId]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {meta.status === "loading" && (
        <Box sx={{ flex: 1, overflowY: "auto" }}>{renderSkeleton()}</Box>
      )}

      {meta.status === "error" && (
        <Box sx={{ p: 2 }}>
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
              Failed to load patients
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {meta.error}
            </Typography>
          </Alert>
        </Box>
      )}

      {meta.status === "success" && patients.length === 0 && (
        <Paper
          variant="outlined"
          sx={{
            m: 2,
            p: 4,
            textAlign: "center",
            bgcolor: "action.hover",
          }}
        >
          <Icon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}>person_search</Icon>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {search ? "No patients found" : "No patients"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {search ? "Try adjusting your search criteria" : "Patient records will appear here"}
          </Typography>
        </Paper>
      )}

      {meta.status === "success" && patients.length > 0 && (
        <List
          ref={listRef}
          role="listbox"
          aria-label="Patient list"
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            py: 1,
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
          {patients.map((patient, index) => {
            const initials = patient.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            const isSelected = selectedPatientId === patient.id;

            return (
              <Box key={patient.id}>
                <ListItemButton
                  ref={(el) => {
                    itemRefs.current[patient.id] = el;
                  }}
                  selected={isSelected}
                  onClick={() => onSelect(patient.id)}
                  role="option"
                  aria-selected={isSelected}
                  aria-label={`Select patient ${patient.name}, Age ${patient.age}, ${patient.gender}`}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 2,
                    py: 1.5,
                    transition: "all 0.2s ease-in-out",
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                      "& .MuiListItemText-primary": {
                        color: "white",
                        fontWeight: 600,
                      },
                      "& .MuiListItemText-secondary": {
                        color: "rgba(255, 255, 255, 0.8)",
                      },
                      "& .MuiAvatar-root": {
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontWeight: 600,
                      },
                    },
                    "&:hover": {
                      bgcolor: isSelected ? "primary.dark" : "action.hover",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: isSelected ? "rgba(255, 255, 255, 0.2)" : "primary.main",
                        color: isSelected ? "white" : "white",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      }}
                    >
                      {initials}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={isSelected ? 600 : 500}>
                        {patient.name}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <Chip
                          label={`Age ${patient.age}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 20,
                            fontSize: "0.7rem",
                            borderColor: isSelected ? "rgba(255,255,255,0.3)" : "divider",
                            color: isSelected ? "rgba(255,255,255,0.9)" : "text.secondary",
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: isSelected ? "rgba(255,255,255,0.8)" : "text.secondary",
                            textTransform: "capitalize",
                          }}
                        >
                          {patient.gender}
                        </Typography>
                      </Stack>
                    }
                  />
                  {isSelected && <Icon sx={{ ml: 1, fontSize: "1.2rem" }}>check_circle</Icon>}
                </ListItemButton>
                {index !== patients.length - 1 && (
                  <Divider
                    component="li"
                    sx={{
                      mx: 2,
                      borderColor: "divider",
                    }}
                  />
                )}
              </Box>
            );
          })}
        </List>
      )}
    </Box>
  );
}

PatientList.propTypes = {
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      gender: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedPatientId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSelect: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    status: PropTypes.string.isRequired,
    error: PropTypes.string,
  }).isRequired,
  onRetry: PropTypes.func,
};

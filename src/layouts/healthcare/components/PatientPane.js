import { useMemo } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import PatientToolbar from "./PatientToolbar";
import PatientList from "./PatientList";

export default function PatientPane({
  patients,
  selectedPatientId,
  onSelect,
  search,
  onSearchChange,
  meta,
  onRetry,
}) {
  const filteredPatients = useMemo(() => {
    if (!search) return patients;
    return patients.filter((patient) => patient.name.toLowerCase().includes(search.toLowerCase()));
  }, [patients, search]);

  return (
    <Card
      elevation={0}
      sx={{
        width: { xs: "100%", lg: "33.333%" },
        height: {
          xs: "400px",
          sm: "450px",
          md: "500px",
          lg: "100%",
        },
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <PatientToolbar
        search={search}
        onSearchChange={onSearchChange}
        totalCount={patients.length}
        filteredCount={filteredPatients.length}
        meta={meta}
      />
      <PatientList
        patients={filteredPatients}
        selectedPatientId={selectedPatientId}
        onSelect={onSelect}
        search={search}
        meta={meta}
        onRetry={onRetry}
      />
    </Card>
  );
}

PatientPane.propTypes = {
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
  onSearchChange: PropTypes.func.isRequired,
  meta: PropTypes.shape({
    status: PropTypes.string.isRequired,
    error: PropTypes.string,
  }).isRequired,
  onRetry: PropTypes.func,
};

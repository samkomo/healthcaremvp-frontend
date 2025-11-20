import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Icon from "@mui/material/Icon";

function getInitials(name) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PatientHeader({ patient }) {
  if (!patient) return null;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        bgcolor: "primary.main",
        color: "white",
        position: "relative",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 3 }}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Avatar
          sx={{
            width: { xs: 64, sm: 72, md: 80 },
            height: { xs: 64, sm: 72, md: 80 },
            bgcolor: "rgba(255, 255, 255, 0.2)",
            border: "3px solid rgba(255, 255, 255, 0.3)",
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            fontWeight: 600,
          }}
        >
          {getInitials(patient.name)}
        </Avatar>
        <Box sx={{ flexGrow: 1, width: { xs: "100%", sm: "auto" } }}>
          <Typography
            variant="h4"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" } }}
          >
            {patient.name}
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<Icon sx={{ color: "inherit !important" }}>cake</Icon>}
              label={`Age ${patient.age}`}
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 500,
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />
            <Chip
              icon={<Icon sx={{ color: "inherit !important" }}>person</Icon>}
              label={patient.gender}
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 500,
                textTransform: "capitalize",
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

PatientHeader.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    gender: PropTypes.string,
  }),
};

PatientHeader.defaultProps = {
  patient: null,
};

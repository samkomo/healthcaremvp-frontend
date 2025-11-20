import PropTypes from "prop-types";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";

export default function MedicalHistoryCard({ medicalHistory }) {
  return (
    <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: 1.5,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" }, color: "white" }}>
              medical_services
            </Icon>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              Medical History
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Patient background and medical notes
            </Typography>
          </Box>
        </Stack>

        <Divider />

        {medicalHistory ? (
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              bgcolor: "action.hover",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.7,
                color: "text.primary",
              }}
            >
              {medicalHistory}
            </Typography>
          </Paper>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: "center",
              bgcolor: "action.hover",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Icon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}>description</Icon>
            <Typography variant="body2" color="text.secondary">
              No medical history on file.
            </Typography>
          </Paper>
        )}
      </Stack>
    </CardContent>
  );
}

MedicalHistoryCard.propTypes = {
  medicalHistory: PropTypes.string,
};

MedicalHistoryCard.defaultProps = {
  medicalHistory: null,
};

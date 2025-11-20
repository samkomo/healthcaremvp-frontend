import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

export default function PatientToolbar({
  search,
  onSearchChange,
  totalCount,
  filteredCount,
  meta,
}) {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  // Sync local search with prop
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5, md: 2.5 },
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        flexShrink: 0,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
        <Box
          sx={{
            width: { xs: 36, sm: 40 },
            height: { xs: 36, sm: 40 },
            borderRadius: 1.5,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <Icon sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>people</Icon>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Patients
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {meta.status === "success" && (
              <>
                {filteredCount} of {totalCount} {totalCount === 1 ? "patient" : "patients"}
              </>
            )}
          </Typography>
        </Box>
        {meta.status === "success" && totalCount > 0 && (
          <Chip label={totalCount} size="small" color="primary" sx={{ fontWeight: 600 }} />
        )}
      </Stack>

      {/* Search Field */}
      <TextField
        fullWidth
        size="small"
        value={localSearch}
        onChange={(event) => setLocalSearch(event.target.value)}
        placeholder="Search by name... (Press ↑↓ to navigate)"
        variant="outlined"
        role="search"
        aria-label="Search patients"
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: "action.hover",
            "&:hover": {
              bgcolor: "action.selected",
            },
            "&.Mui-focused": {
              bgcolor: "background.paper",
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon sx={{ color: "text.secondary", fontSize: "1.2rem" }}>search</Icon>
            </InputAdornment>
          ),
          endAdornment: localSearch && (
            <InputAdornment position="end">
              <Icon
                sx={{
                  color: "text.secondary",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  "&:hover": { color: "text.primary" },
                }}
                onClick={() => setLocalSearch("")}
                aria-label="Clear search"
              >
                clear
              </Icon>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

PatientToolbar.propTypes = {
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
  filteredCount: PropTypes.number.isRequired,
  meta: PropTypes.shape({
    status: PropTypes.string.isRequired,
    error: PropTypes.string,
  }).isRequired,
};

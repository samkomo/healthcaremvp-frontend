import { createContext, useReducer, useContext, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import api from "services/api";

const initialState = {
  patients: [],
  patientsMeta: { status: "idle", error: null },
  selectedPatientId: null,
  patient: null,
  patientMeta: { status: "idle", error: null },
  appointments: [],
  appointmentsMeta: { status: "idle", error: null },
  doctorsById: {},
  doctorMeta: { status: "idle", error: null },
  filters: { search: "" },
};

function reducer(state, action) {
  switch (action.type) {
    case "PATIENTS_REQUEST":
      return { ...state, patientsMeta: { status: "loading", error: null } };
    case "PATIENTS_SUCCESS": {
      const { patients } = action.payload;
      const selectedPatientId =
        state.selectedPatientId || (patients.length ? patients[0].id : null);
      return {
        ...state,
        patients,
        patientsMeta: { status: "success", error: null },
        selectedPatientId,
      };
    }
    case "PATIENTS_FAILURE":
      return { ...state, patientsMeta: { status: "error", error: action.payload } };
    case "SET_PATIENT_SEARCH":
      return { ...state, filters: { ...state.filters, search: action.payload } };
    case "SET_SELECTED_PATIENT":
      return {
        ...state,
        selectedPatientId: action.payload,
        patient: state.patient?.id === action.payload ? state.patient : null,
        appointments: state.selectedPatientId === action.payload ? state.appointments : [],
      };
    case "PATIENT_REQUEST":
      return { ...state, patientMeta: { status: "loading", error: null } };
    case "PATIENT_SUCCESS":
      return { ...state, patient: action.payload, patientMeta: { status: "success", error: null } };
    case "PATIENT_FAILURE":
      return { ...state, patientMeta: { status: "error", error: action.payload } };
    case "APPOINTMENTS_REQUEST":
      return { ...state, appointmentsMeta: { status: "loading", error: null } };
    case "APPOINTMENTS_SUCCESS":
      return {
        ...state,
        appointments: action.payload,
        appointmentsMeta: { status: "success", error: null },
      };
    case "APPOINTMENTS_FAILURE":
      return { ...state, appointmentsMeta: { status: "error", error: action.payload } };
    case "DOCTORS_SUCCESS": {
      const doctors = action.payload;
      const merged = { ...state.doctorsById };
      doctors.forEach((doc) => {
        merged[doc.id] = doc;
      });
      return { ...state, doctorsById: merged };
    }
    default:
      return state;
  }
}

const HealthcareContext = createContext();

export function HealthcareProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadPatientDetails = useCallback(async (patientId) => {
    if (!patientId) return;
    dispatch({ type: "PATIENT_REQUEST" });
    try {
      const patient = await api.getPatient(patientId);
      dispatch({ type: "PATIENT_SUCCESS", payload: patient });
    } catch (error) {
      dispatch({ type: "PATIENT_FAILURE", payload: error.message });
    }
  }, []);

  const loadAppointments = useCallback(
    async (patientId) => {
      if (!patientId) return;
      dispatch({ type: "APPOINTMENTS_REQUEST" });
      try {
        const appointments = await api.getAppointmentsByPatient(patientId);
        dispatch({ type: "APPOINTMENTS_SUCCESS", payload: appointments });

        const missingDoctorIds = [
          ...new Set(
            appointments.map((appt) => appt.doctorId).filter((id) => id && !state.doctorsById[id])
          ),
        ];

        if (missingDoctorIds.length) {
          const doctors = await Promise.all(missingDoctorIds.map((id) => api.getDoctor(id)));
          dispatch({ type: "DOCTORS_SUCCESS", payload: doctors });
        }
      } catch (error) {
        dispatch({ type: "APPOINTMENTS_FAILURE", payload: error.message });
      }
    },
    [state.doctorsById]
  );

  const selectPatient = useCallback(
    (patientId) => {
      if (!patientId) return;
      dispatch({ type: "SET_SELECTED_PATIENT", payload: patientId });
      loadPatientDetails(patientId);
      loadAppointments(patientId);
    },
    [loadPatientDetails, loadAppointments]
  );

  const loadPatients = useCallback(async () => {
    dispatch({ type: "PATIENTS_REQUEST" });
    try {
      const patients = await api.getPatients();
      dispatch({ type: "PATIENTS_SUCCESS", payload: { patients } });
      if (patients.length) {
        selectPatient(patients[0].id);
      }
    } catch (error) {
      dispatch({ type: "PATIENTS_FAILURE", payload: error.message });
    }
  }, [selectPatient]);

  const setSearch = useCallback((value) => {
    dispatch({ type: "SET_PATIENT_SEARCH", payload: value });
  }, []);

  const value = useMemo(
    () => ({
      state,
      actions: {
        loadPatients,
        selectPatient,
        setSearch,
      },
    }),
    [state, loadPatients, selectPatient, setSearch]
  );

  return <HealthcareContext.Provider value={value}>{children}</HealthcareContext.Provider>;
}

export function useHealthcare() {
  const context = useContext(HealthcareContext);
  if (!context) {
    throw new Error("useHealthcare must be used within HealthcareProvider");
  }
  return context;
}

HealthcareProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

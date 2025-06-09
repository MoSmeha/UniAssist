import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
} from "@mui/material";
import { useAuthStore } from "../../zustand/AuthStore";
import toast from "react-hot-toast";

const CreateAnnouncement = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    announcementType: "",
    targetMajor: "",
    targetSubject: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [majors, setMajors] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const { authUser } = useAuthStore();

  // Fetch majors and subjects from the backend
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const res = await fetch("/api/announcements/majors");
        if (res.ok) {
          const data = await res.json();
          setMajors(data);
          // Set default selected value if available
          if (data.length > 0 && formData.announcementType === "major") {
            setFormData((prev) => ({ ...prev, targetMajor: data[0] }));
          }
        } else {
          toast.error("Failed to load majors");
        }
      } catch (error) {
        console.error("Error fetching majors:", error);
        toast.error("Error fetching majors");
      }
    };

    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/announcements/subjects");
        if (res.ok) {
          const data = await res.json();
          setSubjects(data);
          // Set default selected value if available
          if (data.length > 0 && formData.announcementType === "subject") {
            setFormData((prev) => ({ ...prev, targetSubject: data[0] }));
          }
        } else {
          toast.error("Failed to load subjects");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Error fetching subjects");
      }
    };

    fetchMajors();
    fetchSubjects();
  }, [formData.announcementType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // When changing announcement type, reset the target fields based on the type.
    if (name === "announcementType") {
      setFormData({
        ...formData,
        [name]: value,
        targetMajor: value === "major" && majors.length > 0 ? majors[0] : "",
        targetSubject:
          value === "subject" && subjects.length > 0 ? subjects[0] : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }
    if (!formData.announcementType) {
      newErrors.announcementType = "Please select an announcement type";
    } else if (formData.announcementType === "major" && !formData.targetMajor) {
      newErrors.targetMajor = "Please select a target major";
    } else if (
      formData.announcementType === "subject" &&
      !formData.targetSubject
    ) {
      newErrors.targetSubject = "Please select a target subject";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create a submission object with only the necessary fields
      const submissionData = {
        title: formData.title,
        content: formData.content,
        announcementType: formData.announcementType,
      };

      // Only include the relevant target field based on the announcement type
      if (formData.announcementType === "major") {
        submissionData.targetMajor = formData.targetMajor;
      } else if (formData.announcementType === "subject") {
        submissionData.targetSubject = formData.targetSubject;
      }

      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create announcement");
      }

      toast.success("Announcement created successfully!");

      setFormData({
        title: "",
        content: "",
        announcementType: "",
        targetMajor: "",
        targetSubject: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error(error.message || "Failed to create announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        margin="normal"
        error={!!errors.title}
        helperText={errors.title}
        required
      />

      <TextField
        fullWidth
        label="Content"
        name="content"
        value={formData.content}
        onChange={handleInputChange}
        margin="normal"
        multiline
        rows={4}
        error={!!errors.content}
        helperText={errors.content}
        required
      />

      <FormControl
        fullWidth
        margin="normal"
        error={!!errors.announcementType}
        required
      >
        <InputLabel>Announcement Type</InputLabel>
        <Select
          name="announcementType"
          value={formData.announcementType}
          onChange={handleInputChange}
          label="Announcement Type"
        >
          <MenuItem value="major">Major-specific</MenuItem>
          <MenuItem value="subject">Subject-specific</MenuItem>
        </Select>
        {errors.announcementType && (
          <FormHelperText>{errors.announcementType}</FormHelperText>
        )}
      </FormControl>

      {formData.announcementType === "major" && (
        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.targetMajor}
          required
        >
          <InputLabel>Target Major</InputLabel>
          <Select
            name="targetMajor"
            value={formData.targetMajor || ""}
            onChange={handleInputChange}
            label="Target Major"
          >
            {majors.map((major) => (
              <MenuItem key={major} value={major}>
                {major}
              </MenuItem>
            ))}
          </Select>
          {errors.targetMajor && (
            <FormHelperText>{errors.targetMajor}</FormHelperText>
          )}
        </FormControl>
      )}

      {formData.announcementType === "subject" && (
        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.targetSubject}
          required
        >
          <InputLabel>Target Subject</InputLabel>
          <Select
            name="targetSubject"
            value={formData.targetSubject || ""}
            onChange={handleInputChange}
            label="Target Subject"
          >
            {subjects.map((subject) => (
              <MenuItem key={subject} value={subject}>
                {subject}
              </MenuItem>
            ))}
          </Select>
          {errors.targetSubject && (
            <FormHelperText>{errors.targetSubject}</FormHelperText>
          )}
        </FormControl>
      )}

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Announcement"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateAnnouncement;

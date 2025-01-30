import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';

const defaultFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
  lastInteraction: new Date().toISOString(),
  status: 'potential',
};

export const ClientForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit Client' : 'Add New Client'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="potential">Potential</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

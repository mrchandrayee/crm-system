import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ClientList } from './components/ClientList.js';
import { ClientForm } from './components/ClientForm.js';
import { apiService } from './services/api.js';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(undefined);
  const [notification, setNotification] = useState(null);

  const handleCreateClient = async (clientData) => {
    try {
      await apiService.createClient(clientData);
      setNotification({
        message: 'Client created successfully',
        type: 'success',
      });
      setIsFormOpen(false);
      // Force ClientList to refresh
      const event = new Event('client-updated');
      window.dispatchEvent(event);
    } catch (error) {
      setNotification({
        message: 'Failed to create client',
        type: 'error',
      });
    }
  };

  const handleUpdateClient = async (clientData) => {
    if (!selectedClient) return;

    try {
      await apiService.updateClient(selectedClient.id, clientData);
      setNotification({
        message: 'Client updated successfully',
        type: 'success',
      });
      setIsFormOpen(false);
      setSelectedClient(undefined);
      // Force ClientList to refresh
      const event = new Event('client-updated');
      window.dispatchEvent(event);
    } catch (error) {
      setNotification({
        message: 'Failed to update client',
        type: 'error',
      });
    }
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedClient(undefined);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CRM System
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Client
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <ClientList onEditClient={handleEditClient} />
      </Container>

      <ClientForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={selectedClient ? handleUpdateClient : handleCreateClient}
        initialData={selectedClient}
      />

      {notification && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default App;

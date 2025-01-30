import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Client } from '../types/client';
import { apiService } from '../services/api';

interface ClientListProps {
  onEditClient: (client: Client) => void;
}

export const ClientList: React.FC<ClientListProps> = ({ onEditClient }) => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await apiService.getClients();
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await apiService.deleteClient(id);
        setClients(clients.filter(client => client.id !== id));
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'potential':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Client List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Interaction</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  {client.firstName} {client.lastName}
                </TableCell>
                <TableCell>{client.company}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={client.status}
                    color={getStatusColor(client.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {client.lastInteraction ? formatDate(client.lastInteraction) : 'N/A'}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => onEditClient(client)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClient(client.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

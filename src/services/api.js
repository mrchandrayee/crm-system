import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8787';

export const apiService = {
  // Get all clients
  async getClients() {
    const response = await axios.get(`${API_URL}/api/clients`);
    return response.data;
  },

  // Get a single client by ID
  async getClient(id) {
    const response = await axios.get(`${API_URL}/api/clients/${id}`);
    return response.data;
  },

  // Create a new client
  async createClient(client) {
    const response = await axios.post(`${API_URL}/api/clients`, client);
    return response.data;
  },

  // Update an existing client
  async updateClient(id, client) {
    const response = await axios.put(`${API_URL}/api/clients/${id}`, client);
    return response.data;
  },

  // Delete a client
  async deleteClient(id) {
    await axios.delete(`${API_URL}/api/clients/${id}`);
  },

  // Update client interaction
  async updateClientInteraction(id, notes) {
    const response = await axios.post(`${API_URL}/api/clients/${id}/interaction`, { notes });
    return response.data;
  }
};

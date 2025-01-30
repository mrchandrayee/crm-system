export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  lastInteraction: string;
  status: 'active' | 'inactive' | 'potential';
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormData extends Omit<Client, 'id' | 'createdAt' | 'updatedAt'> {}

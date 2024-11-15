// services/customerService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const getCustomers = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

import axios from 'axios';

const bakend_URL = "http://localhost:8081"

export const getCustomers = async () => {
  try {
    console.log(bakend_URL, "bakend_URL")
    const response = await axios.get(bakend_URL, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

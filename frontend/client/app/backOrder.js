import axios from 'axios';


export const getOrder = async () => {
  try {
    const response = await axios.get("http://localhost:8081", {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

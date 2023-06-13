import axios from 'axios';

export const getHeaders = () => {
  const token = localStorage.getItem('token');
  return { 'authorization': `jwt ${token}` };
};

export const fetchUserId = async () => {
    try {
      const headers = getHeaders();
      const response = await axios.get('http://localhost:8000/user/userinfo', { headers });
      console.log(response.data)
      const id = response.data.user.id;
      return id;
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzer-ID:', error);
      throw error;
    }
};
import axios from 'axios';

const API_URL = '/api/competitions';

export async function getAllCompetitions() {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function getCompetitionById(id) {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
}

export async function createCompetition(data, token) {
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

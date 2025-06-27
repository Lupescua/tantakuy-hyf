import API from './axios';
export async function fetchCompetitionById(id) {
  const res = await API.get(`/competitions/${id}`);
  return res.data;
}

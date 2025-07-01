import API from '@/utils/axios';

const PATH = '/competitions';

export async function getAllCompetitions() {
  try {
    const res = await API.get(PATH);
    return res.data;
  } catch (err) {
    console.error('getAllCompetitions failed', err);
    throw new Error(
      err.response?.data?.error || 'Unable to fetch competitions',
    );
  }
}

export async function getCompetitionById(id) {
  try {
    const res = await API.get(`${PATH}/${id}`);
    return res.data;
  } catch (err) {
    console.error(`getCompetitionById(${id}) failed`, err);
    throw new Error(
      err.response?.data?.error || `Unable to fetch competition ${id}`,
    );
  }
}

export async function createCompetition(payload) {
  try {
    const res = await API.post(PATH, payload);
    return res.data;
  } catch (err) {
    console.error('createCompetition failed', err);
    throw new Error(
      err.response?.data?.error || 'Unable to create competition',
    );
  }
}

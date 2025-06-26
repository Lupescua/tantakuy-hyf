import Participant from '../api/models/Participant';

export async function createParticipant(user = {}) {
  const { userName, email, password } = user;
  if (!email || !userName || !password) {
    throw new Error('userName, email, and password are required!');
  }
  const existingEmail = await Participant.findOne({ email });
  if (existingEmail) throw new Error('Email already in use');

  const existingUserName = await Participant.findOne({ userName });
  if (existingUserName) throw new Error('Username already taken');

  const newParticipant = new Participant({ userName, email, password });

  await newParticipant.save();

  return newParticipant;
}

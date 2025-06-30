'use client';
import EntryForm from '../components/participant/entry-form';
import NavbarLoggedIn from '../components/layouts/NavbarLoggedIn/NavbarLoggedIn';

export default function ParticipantEntryPage() {
  return (
    <div>
      <NavbarLoggedIn />
      <EntryForm />
    </div>
  );
}

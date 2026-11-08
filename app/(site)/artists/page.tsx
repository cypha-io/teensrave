import { redirect } from 'next/navigation';

export default function ArtistsPage() {
  redirect('/get-involved?form=perform');
}

/** How many people one ticket lets in, read from its "Admits 3 Squad" label. */
export function admitsPerTicket(label: string | null | undefined) {
  const match = label?.match(/\d+/);
  const count = match ? Number(match[0]) : 1;
  return count > 0 ? count : 1;
}

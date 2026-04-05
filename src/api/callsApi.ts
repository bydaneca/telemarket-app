const BASE_URL = 'http://10.0.2.2:5083/api';

export const getCalls = async () => {
    const response = await fetch(`${BASE_URL}/calls`);
    const data = await response.json();
    return data;
};

export const createCall = async (payload: {
  restaurantId: number;
  contactName: string;
  contactNumber: string;
  outcome: string;
  notes: string;
  actions: string;
  actionDate?: string;
  callDate: string;
}) => {
  const response = await fetch(`${BASE_URL}/calls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  console.log('Status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.log('Error body:', errorText);
    throw new Error(`API error: ${response.status}`);
  }

  // Handle 204 No Content
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};
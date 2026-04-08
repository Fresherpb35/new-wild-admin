// services/hotelService.js

const API_BASE = `${import.meta.env.VITE_API_URL}/api/hotels`;

// Get all hotels
export const getHotels = async () => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch hotels');
  return res.json();
};

// Create new hotel
export const createHotel = async (hotelData) => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hotelData),
  });
  if (!res.ok) throw new Error('Failed to create hotel');
  return res.json();
};

// Update hotel
export const updateHotel = async (id, hotelData) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hotelData),
  });
  if (!res.ok) throw new Error('Failed to update hotel');
  return res.json();
};

// Delete hotel
export const deleteHotel = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete hotel');
  return res.json();
};
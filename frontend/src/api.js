import axios from 'axios';

const api = axios.create({
    baseURL: 'https://tutorlink-v424.onrender.com/api',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const logoutUser = () => api.post('/auth/logout');
export const updateProfile = (data) => api.put('/auth/profile', data);

export const searchTutors = (query) => api.get(`/tutors?${query}`);
export const getTutor = (id) => api.get(`/tutors/${id}`);
export const getTutorSlots = (id) => api.get(`/tutors/${id}/slots`);
export const addSlot = (data) => api.post('/tutors/slots', data);
export const deleteSlot = (id) => api.delete(`/tutors/slots/${id}`);

export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/my');
export const getIncomingBookings = () => api.get('/bookings/incoming');
export const updateBookingStatus = (id, status, meetingLink = '') => api.patch(`/bookings/${id}/status`, { status, meetingLink });

export default api;
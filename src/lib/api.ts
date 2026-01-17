// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// if (!BASE_URL) {
//   throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
// }

// export const API = {
//   register: `${BASE_URL}/api/register`,
//   login: `${BASE_URL}/api/login`,


//   profile: `${BASE_URL}/api/profile`,
//   updateProfile: `${BASE_URL}/api/update-profile`,
//   changePassword: `${BASE_URL}/api/change-password`,




//   bookings: `${BASE_URL}/api/bookings`,
//   updateBookingStatus: (id: string) => `${BASE_URL}/api/bookings/${id}/status`,
//   updateBooking: (id: string) => `${BASE_URL}/api/bookings/${id}`,
//   rescheduleBooking: (id: string) => `${BASE_URL}/api/bookings/${id}/reschedule`,
//   deleteBooking: (id: string) => `${BASE_URL}/api/bookings/${id}`,
//   showallbookings: `${BASE_URL}/api/showallbookings`,
// };




const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export const API = {
  // Auth routes
  register: `${BASE_URL}/api/register`,
  login: `${BASE_URL}/api/login`,

  // User routes
  profile: `${BASE_URL}/api/profile`,
  updateProfile: `${BASE_URL}/api/update-profile`,

  // Password endpoints
  updatePassword: `${BASE_URL}/api/update-password`,
  changePassword: `${BASE_URL}/api/change-password`,
  forgotPassword: `${BASE_URL}/api/forgot-password`,
  verifyOTP: `${BASE_URL}/api/verify-otp`,
  resetPassword: `${BASE_URL}/api/reset-password`,
  verifyAndResetPassword: `${BASE_URL}/api/verify-reset-password`,

  // Booking routes
  bookings: `${BASE_URL}/api/bookings`,
  showallbookings: `${BASE_URL}/api/showallbookings`,
  
  // Individual booking routes
  getBookingById: (id: string) => `${BASE_URL}/api/bookings/${id}`,
  updateBookingStatus: (id: string) => `${BASE_URL}/api/bookings/${id}/status`,
  updateBookingDetails: (id: string) => `${BASE_URL}/api/bookings/${id}/details`,
  rescheduleBooking: (id: string) => `${BASE_URL}/api/bookings/${id}/reschedule`,
  deleteBooking: (id: string) => `${BASE_URL}/api/bookings/${id}`,
  
  // Base URL for dynamic construction
  baseURL: BASE_URL,
};
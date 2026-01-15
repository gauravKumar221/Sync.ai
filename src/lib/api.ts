const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export const API = {
  register: `${BASE_URL}/api/register`,
  login: `${BASE_URL}/api/login`,
  bookings: `${BASE_URL}/api/bookings`,
  showallbookings: `${BASE_URL}/api/showallbookings`,
  profile: `${BASE_URL}/api/profile`,
  updateProfile: `${BASE_URL}/api/update-profile`,
  changePassword: `${BASE_URL}/api/change-password`
};

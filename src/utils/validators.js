export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
};

export const isValidPhoneNumber = (phoneNumber) => {
  // Basic phone number validation (adjust regex as needed)
  const phoneRegex = /^\+?[\d\s-]{10,14}$/;
  return phoneRegex.test(phoneNumber);
};

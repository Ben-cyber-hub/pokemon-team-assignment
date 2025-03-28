export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const validateEmail = (email: string): boolean => EMAIL_REGEX.test(email);
export const validatePassword = (password: string): boolean => PASSWORD_REGEX.test(password);
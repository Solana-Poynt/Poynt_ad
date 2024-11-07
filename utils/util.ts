//CHECK IF VALUES ARE EITHER EMPTY, NULL OR UNDEFINED
export const areValuesEmpty = (obj: any) => {
  return Object.values(obj).some(
    (value) => value === "" || value === null || value === undefined
  );
};

//VALIDATE INPUTS
export const validateRegistration = (
  email: string,
  password: string | undefined,
  confirmPassword: string | undefined
) => {
  // Email validation using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  let message = "";

  // Check email if provided
  if (email !== undefined && isEmailValid === false) {
    return (message = "Email is invalid");
  }

  // Check password and confirm password only if both are provided
  if (password !== undefined) {
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasSmallLetter = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isPasswordValid =
      hasCapitalLetter && hasSmallLetter && hasNumber && password.length > 6;

    if (isPasswordValid === false) {
      return (message =
        "Password must have capital & small letters with numbers & at least 7 characters");
    }
  }

  if (confirmPassword !== undefined) {
    const isConfirmPasswordValid = password === confirmPassword;

    if (isConfirmPasswordValid === false) {
      return (message = "Passwords don't match");
    }
  }

  return true;
};

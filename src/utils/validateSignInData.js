const validateSignInData = (data) => {
  const errors = {};
  const { email, password } = data;

  if (!email?.trim()) errors.email = "Email is required";
  if (!password?.trim()) errors.password = "Password is required";

  return errors;
};

module.exports = validateSignInData;

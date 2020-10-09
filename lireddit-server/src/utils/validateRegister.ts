export const validateRegister = (
  username: string,
  email: string,
  password: string
) => {
  if (!email.includes('@')) {
    return {
      errors: [
        {
          field: 'email',
          message: 'Invalid email',
        },
      ],
    };
  }

  if (username.length <= 2) {
    return {
      errors: [
        {
          field: 'username',
          message: 'length must be greater than 2',
        },
      ],
    };
  }
  if (username.includes('@')) {
    return {
      errors: [
        {
          field: 'username',
          message: 'Cannot include @ sign',
        },
      ],
    };
  }
  if (password.length <= 3) {
    return {
      errors: [
        {
          field: 'password',
          message: 'length must be greater than 3',
        },
      ],
    };
  }

  return null;
};

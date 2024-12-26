import axios from "axios";

export const loginService = async (email, password, host) => {
  try {
    const response = await axios.post(`${host}/api/auth/login`, {
      email,
      password,
      host,
    });
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

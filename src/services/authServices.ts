import axios from "axios";
import Cookies from "js-cookie";

//https://gateway-auth-service-mahmoud.onrender.com

const login = async (username: string, password: string) => {
  try {
    const {data , status} = await axios.post(
      "https://gateway-service-7n3t.onrender.com/api/login",
      { username, password }
    );
    Cookies.set("token", data.token);
    return status; // Fetch and return user profile after successful login
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw { status: error.response?.status };
    } else {
      throw { status: 'network_error' };
    }
}};

const signup = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      "https://gateway-service-7n3t.onrender.com/api/signup",
      { username, password },
      {
        withCredentials: true,
      }
    );
    return response.data; // Return signup response data
  } catch (error){
    if (axios.isAxiosError(error)) {
      throw { status: error.response?.status };
    } else {
      throw { status: 'network_error' };
    }
}
};

const getUserProfile = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) throw new Error("No token found");
    const response = await axios.get(
      "https://gateway-service-7n3t.onrender.com/api/userprofile"
    );
    return response.data;
  } catch (error) {
    throw(error);
  }
};

export { login, signup, getUserProfile };

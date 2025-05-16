import axios from "axios";

export const registerVisitor = async (formData, token) => {
  return await axios.post("/api/visitors/register", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

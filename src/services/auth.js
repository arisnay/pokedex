import api from "./api";

export const loadUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const res = await api.get("/user/me");
    console.log("Usuario cargado:", res.data);
  } catch (err) {
    console.log("Error cargando usuario");
  }
};
import { ref } from "vue";

export const user = ref(null);

export function setUser(newUser) {
  user.value = newUser;
  localStorage.setItem("user", JSON.stringify(newUser));
}

export function loadUser() {
  const data = localStorage.getItem("user");
  if (data) {
    user.value = JSON.parse(data);
  }
}

export function logout() {
  user.value = null;
  localStorage.removeItem("user");
}
import axios from "axios";

const BASE_URL = "http://localhost:8000";

// Récupérer l'utilisateur connecté
const getUser = () => {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u).username : "inconnu";
};

// Headers avec l'utilisateur connecté
const authHeaders = () => ({
  headers: { "X-Username": getUser() },
});

export const clientsAPI = {
  getAll: () => axios.get(`${BASE_URL}/clients.php`),
  create: (data) => axios.post(`${BASE_URL}/clients.php`, data, authHeaders()),
  delete: (id) =>
    axios.delete(`${BASE_URL}/clients.php?id=${id}`, authHeaders()),
};

export const versementsAPI = {
  getAll: () => axios.get(`${BASE_URL}/versements.php`),
  create: (data) =>
    axios.post(`${BASE_URL}/versements.php`, data, authHeaders()),
  update: (data) =>
    axios.put(`${BASE_URL}/versements.php`, data, authHeaders()),
  delete: (id) =>
    axios.delete(`${BASE_URL}/versements.php?id=${id}`, authHeaders()),
};

export const auditAPI = {
  getAll: () => axios.get(`${BASE_URL}/audit.php`),
};

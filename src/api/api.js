import { API_URL } from "../constants";

export const loginOrRegister = async (mode, data) => {
  const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Authentication failed");
  }

  return response.json();
};

export const getTasks = async (token) => {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 401) {
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
};

export const sendAgentQuery = async (token, message, speechEnabled) => {
  const url = speechEnabled
    ? `${API_URL}/agent/query?voice=true`
    : `${API_URL}/agent/query`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
};

export const getAdminSettings = async (token) => {
  const response = await fetch(`${API_URL}/admin/settings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to load settings");
  }
  return response.json();
};

export const getAdminStats = async (token) => {
  const response = await fetch(`${API_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to load stats");
  }
  return response.json();
};

export const updateAdminSettings = async (token, settings) => {
  const response = await fetch(`${API_URL}/admin/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error("Failed to save settings");
  }
  return response.json();
};

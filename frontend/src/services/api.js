// Mỗi nhóm hàm tương ứng một nhóm endpoint trong docs/openapi.yaml.
import { request } from "./http";

export const taxTypesApi = {
  list: () => request("/tax-types"),
};

export const documentsApi = {
  // params: { search, tax_type, status, page, page_size }
  list: (params) => request("/documents", { query: params }),
  get: (id) => request(`/documents/${encodeURIComponent(id)}`),
};

export const authApi = {
  register: (data) => request("/auth/register", { method: "POST", body: data }),
  login: (data) => request("/auth/login", { method: "POST", body: data }),
};

export const notificationsApi = {
  list: () => request("/notifications", { auth: true }),
};

export const taxCalculationsApi = {
  calculate: (data) => request("/tax-calculations", { method: "POST", body: data }),
};
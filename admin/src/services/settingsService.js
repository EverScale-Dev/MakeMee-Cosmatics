import api from "./api";

const settingsService = {
  // Get all settings
  async getAll() {
    const response = await api.get("/settings");
    return response.data;
  },

  // Get a single setting
  async get(key) {
    const response = await api.get(`/settings/${key}`);
    return response.data;
  },

  // Update a single setting
  async update(key, value) {
    const response = await api.put(`/settings/${key}`, { value });
    return response.data;
  },

  // Update multiple settings
  async updateMany(settings) {
    const response = await api.put("/settings", { settings });
    return response.data;
  },

  // Get admin permissions (which pages admins can access)
  async getAdminPermissions() {
    const response = await api.get("/settings/admin-permissions");
    return response.data;
  },

  // Update admin permissions (super_admin only)
  async updateAdminPermissions(pages) {
    const response = await api.put("/settings/admin-permissions", { pages });
    return response.data;
  },
};

export default settingsService;

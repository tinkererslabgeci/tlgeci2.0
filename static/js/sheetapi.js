const API_ENDPOINT = "/api/bookings/"

export const sheetapi = {
  async get(params = {}) {
    const url = new URL(API_ENDPOINT, window.location.origin);
    Object.keys(params).forEach(k => url.searchParams.set(k, params[k]));

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok)
      throw new Error(`HTTP Error: ${response.status}`);

    const result = await response.json();
    if (result.status >= 400)
      throw new Error(response.data?.error || "failed to fetch data");

    return result;
  },

  async post(payload) {
    const headers = {
      "Content-Type": "application/json",
    };

    const adminKey = sessionStorage.getItem("admin_passkey");
    if (adminKey)
      headers["x-admin-key"] = adminKey;
    else
      throw new Error(`Authorization Error: Unauthorized`);

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok)
      throw new Error(`HTTP Error: ${response.status}`);

    const result = await response.json();
    if (result.status >= 400)
      throw new Error(response.data?.error || "failed to fetch data");

    return result;
  },
};

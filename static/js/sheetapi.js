const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx48NB3B4S5MmLiadjq5UAh7BMNfS2Lj-9T6pc8ZSDmM0NNKvQmJSqW1mmoX-oKMaFwlg/exec";

export const sheetapi = {
  async get() {
    const response = await fetch(SCRIPT_URL, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok)
      throw new Error(`HTTP Error: ${response.status}`);

    const result = await response.json();
    if (result.status >= 400)
      throw new Error(response.data?.error || "failed to fetch data");
    return result;
  },

  async post(payload) {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
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

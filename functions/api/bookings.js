export async function onRequestGet({ env, request }) {
  try {
    const incomingUrl = new URL(request.url);
    const gasUrl = new URL(env.GAS_ENDPOINT);

    incomingUrl.searchParams.forEach((value, key) => {
      gasUrl.searchParams.set(key, value);
    });

    const response = await fetch(gasUrl.toString(), {
      method: "GET",
      redirect: "follow",
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=15, stale-while-revalidate=30",
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const payload = await request.json();
    const action = (payload.action || "").toLowerCase().replace(/[-_]/g, "");

    if (action === "update-status") {
      const providedKey = request.headers.get("x-admin-key");

      if (!providedKey || providedKey !== env.ADMIN_KEY) {
        return new Response(
          JSON.stringify(
            { status: "error", message: "Unauthorized: invalid or missing admin key." }
          ),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const response = await fetch(env.GAS_ENDPOINT, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

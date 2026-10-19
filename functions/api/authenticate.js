export async function onRequestPost({ env, request }) {
  try {
    const keyConfig = env.ADMIN_KEY;
    if (!expectedHash) {
      return new Response(
        JSON.stringify({ success: false, message: "server misconfiguration" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hashes = JSON.parse(keyConfig);
    const body = await request.json();
    const clientHash = body.hash;

    Object.keys(hashes).forEach(k => {
      if (clientHash === hashes[k]) {
        return new Response(
          JSON.stringify({ success: true, message: "authorized", username: k }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    });

    return new Response(
      JSON.stringify({ success: false, message: "invalid passkey"}),
      {
        status: 401,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: err.message}),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const expectedHash = env.ADMIN_HASH;
    if (!expectedHash) {
      return new Response(
        JSON.stringify({ success: false, message: "server misconfiguration" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = await request.json();
    const clientHash = body.hash;

    if (clientHash === expectedHash) {
      return new Response(
        JSON.stringify({ success: true, message: "authorized"}),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "invalid passkey"}),
        {
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
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

export function requireToken(request, env) {
  const expected = env.DRIVE_ASSISTANT_TOKEN;
  if (!expected) {
    return { ok: false, status: 500, error: "Server missing DRIVE_ASSISTANT_TOKEN." };
  }

  const got = request.headers.get("X-Drive-Token") || "";
  if (got !== expected) {
    return { ok: false, status: 401, error: "Unauthorized." };
  }

  return { ok: true };
}

import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("http://mock-server.local/auth", async ({ request }) => {
    const body = await request.clone().json() as { username?: string, password?: string };
    if (body.username !== "meow") return HttpResponse.json({ error: "username", message: "That username doesn't exist." });
    if (body.password !== "mrrp") return HttpResponse.json({ error: "password", message: "Incorrect password." });
    return HttpResponse.json({ token: "nya" });
  }),
  http.get("http://mock-server.local/me", async ({ request }) => {
    switch (request.headers.get("authorization")) {
      case "Bearer nya":
        return HttpResponse.json({ id: 1, username: "meow", sessions: [{ id: 1, createdAt: new Date(), expiry: new Date() }], activeSession: 1, failedLoginLockout: false, permissions: ["users:list"] });
      case "Bearer locked":
        return HttpResponse.json({ error: "locked", message: "Your account is locked, please contact your administrator." });
      case "Bearer expired":
        return HttpResponse.json({ error: "expired", message: "Your session expired, please sign in again." });
      default:
        return HttpResponse.json({ error: "invalid", message: "Your token is invalid, please sign in again." });
    }
  })
];
export const server = setupServer(...handlers);
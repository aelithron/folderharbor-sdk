import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("http://mock-server.local/auth", async ({ request }) => {
    const body = await request.clone().json() as { username?: string, password?: string };
    if (body.username !== "meow") return HttpResponse.json({ error: "username", message: "That username doesn't exist." });
    if (body.password !== "mrrp") return HttpResponse.json({ error: "password", message: "Incorrect password." });
    return HttpResponse.json({ token: "nya" });
  })
];
export const server = setupServer(...handlers);
import { http, HttpResponseResolver } from "msw";
import { setupServer } from "msw/node";
import { beforeAll, afterEach, afterAll } from "vitest";
import { reCreateClient } from "../api/apiClient";

interface serverHandlerProps {
  method:
    | "all"
    | "get"
    | "post"
    | "put"
    | "delete"
    | "patch"
    | "head"
    | "options";
  url: string;
  resolver: HttpResponseResolver;
}

export function setupTestServer(...handlers: Array<serverHandlerProps>) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

  const server = setupServer(
    ...handlers.map(({ method, url, resolver }) => {
      return http[method](`${baseUrl}${url}`, resolver);
    })
  );

  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
    // recreate the client after the server is set up
    // otherwise server won't be able to intercept the request
    reCreateClient(undefined);
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => {
    server.close();
  });
}

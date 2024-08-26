import { createRouter, createWebHistory } from "vue-router";
import { routes } from "../router";
import { flushPromises } from "@vue/test-utils";
import { matchRequestUrl } from "msw";
import { SetupServer } from "msw/node";

export const testRouter = createRouter({
  history: createWebHistory(),
  routes: routes,
});

interface mswServerWaitProps {
  server: SetupServer;
  method: string;
  url: string;
  //request:match happen when a request has a handler
  //response:mocked happen when a mock response is sent
  eventType: "request:match" | "response:mocked";
  flush?: boolean;
  timeoutMs?: number;
}

export async function waitForRequest({
  server,
  method,
  url,
  eventType,
  flush,
  timeoutMs,
}: mswServerWaitProps): Promise<Request> {
  const result = await new Promise<Request>((resolve, reject) => {
    server.events.on(eventType, ({ request }) => {
      const doseMethodMatch =
        request.method.toLowerCase() === method.toLowerCase();
      const doesUrlMatch = matchRequestUrl(new URL(request.url), url);
      if (doseMethodMatch && doesUrlMatch) {
        resolve(request);
      }
    });
    server.events.on("request:unhandled", ({ request: req }) => {
      reject(new Error(`The ${req.method} ${req.url} request was unhandled.`));
    });

    // reject if the request is not matched within the timeout
    if (timeoutMs) {
      setTimeout(() => {
        reject(new Error("Request did not match within the timeout"));
      }, timeoutMs);
    }
  });
  flush && (await flushPromises());
  return result;
}

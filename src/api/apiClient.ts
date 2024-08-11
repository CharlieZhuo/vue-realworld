import createClient, { Client } from "openapi-fetch";
import type { paths } from "./schema"; // generated by openapi-typescript
import { readonly } from "vue";

//read base url from env
const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
if (!baseUrl) {
  throw new Error("VITE_API_BASE_URL is not set");
}

let client: Client<paths> = createClient({ baseUrl });

export function getApiClient() {
    return readonly(client);
}

export function updateClientToken(authToken: string) {
  client = createClient({
    baseUrl,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return client;
}

/**
 * In dev, leave unset so requests stay same-origin and use Vite's proxy (see vite.config.ts).
 * In production, set VITE_API_BASE_URL to your deployed API origin, e.g. https://api.example.com
 *
 * Path prefix (default "/api"). Auth routes are `${prefix}/auth/...` (e.g. /api/auth/signup/).
 * Match your Django `urlpatterns`. In dev, only `/api/...` is proxied to Django.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "" : "http://localhost:8000");

const API_PREFIX = (import.meta.env.VITE_API_PREFIX ?? "/api").replace(/\/$/, "");

const apiPath = (resource: string) => {
  const path = resource.startsWith("/") ? resource : `/${resource}`;
  return API_PREFIX ? `${API_PREFIX}${path}` : path;
};

type QueryValue = string | number | undefined;

const resolveOrigin = () => {
  if (API_BASE_URL) return API_BASE_URL;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:8000";
};

const buildUrl = (path: string, query?: Record<string, QueryValue>) => {
  const url = new URL(path, resolveOrigin());
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
};

const networkErrorMessage = () =>
  "Could not reach the server. In development, run Django on port 8000 and use the Vite dev server so /api is proxied. If you call the API directly, enable CORS on Django or set VITE_API_BASE_URL.";

const getCookie = (name: string) => {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? "";
  return "";
};

const doFetch = (path: string, options: RequestInit, query?: Record<string, QueryValue>) => {
  const csrfToken = getCookie("csrftoken");
  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (csrfToken) {
    headers.set("X-CSRFToken", csrfToken);
  }

  return fetch(buildUrl(path, query), {
    credentials: "include",
    ...options,
    headers,
  });
};

const request = async <T>(
  path: string,
  options: RequestInit = {},
  query?: Record<string, QueryValue>,
): Promise<T> => {
  let response: Response;
  try {
    response = await doFetch(path, options, query);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "Failed to fetch" || msg.includes("NetworkError")) {
      throw new Error(networkErrorMessage());
    }
    throw err;
  }

  if (!response.ok) {
    const raw = await response.text();
    let message = `Request failed (${response.status})`;
    if (raw) {
      try {
        const errorData = JSON.parse(raw) as {
          detail?: unknown;
          [key: string]: unknown;
        };
        if (typeof errorData?.detail === "string") {
          message = errorData.detail;
        } else if (Array.isArray(errorData?.detail)) {
          message = errorData.detail.map(String).join(" ");
        } else if (typeof errorData === "object" && errorData) {
          message = Object.values(errorData)
            .flat()
            .map((v) => String(v))
            .join(" ");
        } else {
          message = `${message}: ${raw.slice(0, 140)}`;
        }
      } catch {
        message = `${message}: ${raw.slice(0, 140)}`;
      }
    }
    if (response.status === 404) {
      throw new Error(
        `${message} — No route at ${path}. In dev, API URLs must start with /api (Vite proxy). Set VITE_API_PREFIX to match Django (e.g. /api/v1).`,
      );
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
};

export type User = {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type PreferencesPayload = {
  diet: string;
  budget: string;
  shopping_frequency_value: number;
  shopping_frequency_unit: "days" | "weeks";
};

export type Recipe = {
  id: number;
  name: string;
  cooking_time?: number;
  servings?: number;
};

export const api = {
  signUp: (payload: SignUpPayload) =>
    request<User>(apiPath("/auth/signup/"), {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginPayload) =>
    request<User>(apiPath("/auth/login/"), {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request<null>(apiPath("/auth/logout/"), {
      method: "POST",
    }),

  listRecipes: (query?: {
    max_cooking_time?: number;
    servings?: number;
    ingredient?: string;
    search?: string;
  }) => request<Recipe[]>(apiPath("/recipes/"), {}, query),

  updatePreferences: (payload: PreferencesPayload) =>
    request<User>(apiPath("/user/preferences/"), {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

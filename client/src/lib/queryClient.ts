import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // For development, use local proxy to avoid CORS issues
  const isDevelopment = import.meta.env.DEV;
  const apiUrl = isDevelopment 
    ? url // Use local proxy in development
    : url.startsWith('/api') 
      ? url.replace('/api', 'https://api.rccmaldives.com/ess')
      : `https://api.rccmaldives.com/ess${url}`;

  console.log('API Request:', method, apiUrl);

  try {
    const res = await fetch(apiUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(data ? {} : {})
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: isDevelopment ? "include" : "omit",
      mode: "cors",
    });

    console.log('API Response:', res.status, res.statusText);
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // For development, use local proxy to avoid CORS issues
    const isDevelopment = import.meta.env.DEV;
    const url = queryKey[0] as string;
    const apiUrl = isDevelopment 
      ? url // Use local proxy in development
      : url.startsWith('/api') 
        ? url.replace('/api', 'https://api.rccmaldives.com/ess')
        : `https://api.rccmaldives.com/ess${url}`;

    console.log('Query Request:', apiUrl);

    try {
      const res = await fetch(apiUrl, {
        credentials: isDevelopment ? "include" : "omit",
        mode: "cors",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        }
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error('Query Request failed:', error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

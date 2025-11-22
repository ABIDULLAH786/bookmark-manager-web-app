type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions {
  limit?: number;
  page?: number;
  method?: HttpMethod;
  body?: any;
}

export const fetcher = async (key: [string, FetchOptions?]): Promise<any> => {
  try {
    const [url, options = {}] = key;
    const { limit, page, method = "GET", body } = options;

    if (!url?.trim()) return [];

    const params = new URLSearchParams();
    if (limit) params.append("_limit", limit.toString());
    if (page) params.append("_page", page.toString());

    const path = params.toString() ? `${url}?${params}` : url;

    const res = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      ...(body && { body: JSON.stringify(body) }),
    });

    // 🚨 HANDLE ERROR PROPERLY
    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);

      throw {
        status: res.status,
        statusText: res.statusText,
        body: errorBody,
      };
    }

    return await res.json();
  } catch (error) {
    console.error("Fetcher Error:", error);
    throw error;
  }
};

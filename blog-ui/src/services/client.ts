export async function apiFetch(
  url: string,
  token: string | null,
  options: RequestInit = {}
) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });

  if(response.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    // Try to parse error message from backend
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.error || "API request failed";
        throw new Error(errorMessage);
      } catch (e) {
        // If already an Error with message, re-throw it
        if (e instanceof Error && e.message !== "API request failed") {
          throw e;
        }
        // Otherwise throw generic error
        throw new Error("API request failed");
      }
    }
    throw new Error("API request failed");
  }

  // Check if response has content before parsing JSON
  // DELETE requests often return 204 No Content or empty body
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }

  // Check if response has any content
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  return response.json();
}

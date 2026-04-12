export function createAuthHeaders(token?: string): Record<string, string> {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`
  };
}

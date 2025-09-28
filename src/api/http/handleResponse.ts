export default async function handleResponse(response: Response) {
  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error("Error to contact the server.");
    }

    throw new Error(await response.text());
  }

  return response.json();
}

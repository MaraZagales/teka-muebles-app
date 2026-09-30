import { API_URL } from '@/config/api';

type ApiErrorResponse = {
  mensaje?: string;
  detalle?: string;
};

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    let message = `La API respondió con el código ${response.status}.`;

    try {
      const error = (await response.json()) as ApiErrorResponse;
      message = error.mensaje ?? message;
    } catch {
      // La respuesta no contenía un error en formato JSON.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}
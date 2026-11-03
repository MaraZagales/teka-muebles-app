import { API_URL } from '@/config/api';

type ApiErrorResponse = {
  mensaje?: string;
  detalle?: string;
};

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export function resolveApiAssetUrl(value: string): string {
  const trimmed = value.trim();
  const ecommercePath = trimmed.match(/\/ecommerce\/.*$/i)?.[0];

  if (ecommercePath) {
    return `${API_URL}${ecommercePath}`;
  }

  if (trimmed.startsWith('/')) {
    return `${API_URL}${trimmed}`;
  }

  return trimmed;
}

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

    throw new ApiRequestError(response.status, message);
  }

  return (await response.json()) as T;
}

export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `La API respondió con el código ${response.status}.`;

    try {
      const error = (await response.json()) as ApiErrorResponse;
      message = error.mensaje ?? message;
    } catch {
      // La respuesta no contenía un error en formato JSON.
    }

    throw new ApiRequestError(response.status, message);
  }

  return (await response.json()) as TResponse;
}

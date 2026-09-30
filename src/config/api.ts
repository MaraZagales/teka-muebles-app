const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    'Falta configurar EXPO_PUBLIC_API_URL en el archivo .env',
  );
}

export const API_URL = apiUrl.replace(/\/$/, '');
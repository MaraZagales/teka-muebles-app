import { apiGet, apiPost } from "@/services/api-client";
import type { CartItem } from "@/store/cart-store";

export type CheckoutBuyer = {
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  notes?: string;
};

export type CheckoutAddress = {
  street: string;
  streetNumber: string;
  floorApartment?: string;
  neighborhood?: string;
  postalCode?: string;
  provinceId: number | null;
  provinceName: string;
  localityId: number | null;
  localityName: string;
};

export type LocationOption = {
  id: number;
  descripcion: string;
};

export type CheckoutResponse = {
  pedidoId: number;
  total: number;
  estado: "Pendiente";
  solicitudYaProcesada: boolean;
  correoEnviado: boolean | null;
  domicilioEntrega: string;
  mensaje: string;
};

type CheckoutRequest = {
  solicitudId: string;
  nombre: string;
  apellido?: string;
  email: string;
  telefono?: string;
  observaciones?: string;
  calle: string;
  altura: string;
  pisoDepto?: string;
  barrio?: string;
  codigoPostal?: string;
  provinciaId: number;
  localidadId: number;
  items: Array<{
    productoId: number;
    cantidad: number;
  }>;
};

export function createPurchaseRequestId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (character) => {
      const random = Math.floor(Math.random() * 16);
      const value = character === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    },
  );
}

export function getPublicProvinces(): Promise<LocationOption[]> {
  return apiGet<LocationOption[]>("/api/ecommerce/ubicaciones/provincias");
}

export function getPublicLocalities(
  provinceId: number,
): Promise<LocationOption[]> {
  return apiGet<LocationOption[]>(
    `/api/ecommerce/ubicaciones/localidades?provinciaId=${provinceId}`,
  );
}

export async function confirmPurchaseRequest(
  requestId: string,
  buyer: CheckoutBuyer,
  address: CheckoutAddress,
  items: CartItem[],
): Promise<CheckoutResponse> {
  if (address.provinceId === null || address.localityId === null) {
    throw new Error("Falta seleccionar la provincia o la localidad.");
  }

  const request: CheckoutRequest = {
    solicitudId: requestId,
    nombre: buyer.name.trim(),
    apellido: buyer.lastName?.trim() || undefined,
    email: buyer.email.trim().toLowerCase(),
    telefono: buyer.phone?.trim() || undefined,
    observaciones: buyer.notes?.trim() || undefined,
    calle: address.street.trim(),
    altura: address.streetNumber.trim(),
    pisoDepto: address.floorApartment?.trim() || undefined,
    barrio: address.neighborhood?.trim() || undefined,
    codigoPostal: address.postalCode?.trim() || undefined,
    provinciaId: address.provinceId,
    localidadId: address.localityId,
    items: items.map((item) => ({
      productoId: item.productId,
      cantidad: item.quantity,
    })),
  };

  return apiPost<CheckoutResponse, CheckoutRequest>(
    "/api/ecommerce/checkout",
    request,
  );
}

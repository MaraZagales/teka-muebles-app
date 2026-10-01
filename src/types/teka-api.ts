export type ApiProduct = {
  productoId: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  tipoProductoId: number;
  tipoProductoNombre: string;
  colorId: number | null;
  colorNombre: string | null;
  codigoHex: string | null;
  unidadMedidaId: number;
  unidadMedidaNombre: string;
  unidadMedidaAbreviatura: string;
  stockMinimo: number;
  activo: boolean;
  fechaAlta: string;
  motivoInactivacionId: number | null;
  motivoInactivacionNombre: string | null;
  observacionInactivacion: string | null;
  fechaInactivacion: string | null;
};

export type ApiSalePrice = {
  precioVentaId: number;
  productoId: number;
  productoCodigo: string | null;
  productoNombre: string | null;
  fechaVigenciaDesde: string;
  fechaVigenciaHasta: string | null;
  precio: number;
  activo: boolean;
};

export type ApiLookup = {
  id: number;
  descripcion: string;
};

export type ApiProductStock = {
  stockProductoId: number;
  productoId: number;
  productoCodigo: string;
  productoNombre: string;
  depositoId: number;
  depositoNombre: string;
  cantidadActual: number;
  stockMinimo: number;
  esStockCritico: boolean;
};

export type ApiCatalogProduct = {
  productoId: number;
  codigo: string;
  nombre: string;
  descripcionComercial: string;
  tipoProductoId: number;
  tipoProductoNombre: string;
  colorId: number | null;
  colorNombre: string | null;
  codigoHex: string | null;
  precio: number;
  anchoCm: number;
  altoCm: number;
  profundidadCm: number;
  depositoId: number;
  cupoOnline: number;
  disponibleOnline: number;
  urlPortada: string;
  destacado: boolean;
  ordenVisual: number;
};

export type ApiCatalogImage = {
  productoImagenId: number;
  urlArchivo: string;
  textoAlternativo: string | null;
  esPrincipal: boolean;
  ordenVisual: number;
};

export type ApiCatalogProductDetail = {
  producto: ApiCatalogProduct;
  imagenes: ApiCatalogImage[];
};

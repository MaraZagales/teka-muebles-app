# TEKA Muebles

Aplicación móvil de comercio electrónico orientada a los clientes de TEKA, una fábrica de muebles ubicada en Córdoba Capital.

Proyecto académico desarrollado de manera incremental con React Native, incorporando nuevas funcionalidades a medida que se trabajan los contenidos de la materia.

## Descripción y problemática

La elección de un mueble requiere consultar imágenes, precios y características para evaluar si se adapta a las necesidades del comprador.

El proyecto busca atender la necesidad de contar con un espacio de consulta accesible desde el celular que reúna esa información y facilite la selección de productos. Se propone desarrollar una aplicación que permita explorar el catálogo de TEKA y, en etapas posteriores, buscar productos, consultar sus detalles, gestionar un carrito y confirmar una solicitud de compra.

La aplicación estará orientada al cliente final. No incluirá la administración interna de inventario, producción o cobros de TEKA.

## Integrantes

* BENETTI, Gabriela Melina.
* PIGINI, Fernando Mariano.
* ZAGALES, Mara Macarena.

## Objetivo

Desarrollar una aplicación móvil que facilite la consulta y selección de muebles de TEKA mediante una interfaz clara, consistente y adaptada al uso desde el celular.

## Features y estado de avance

## Features y estado de avance

| Feature | Estado | Avance actual |
|---|---|---|
| Consultar el catálogo de productos | Implementada | Consume productos, precios y categorías de la API real. Inicio muestra hasta cuatro productos destacados y Catálogo muestra todos los productos activos. |
| Buscar y filtrar productos | Implementada | Permite buscar por nombre, filtrar por categoría, combinar filtros y limpiar la búsqueda. |
| Consultar el detalle de un producto | Implementada | Incluye ruta dinámica, producto, precio vigente, stock, descripción, color, galería de imágenes, medidas temporales y selector de cantidad validado. |
| Gestionar el carrito de compras | Implementada | Permite agregar productos, modificar cantidades, quitar productos, vaciar el carrito y calcular unidades e importe total mediante Zustand. |
| Confirmar una solicitud de compra | Pendiente | Falta implementar los datos del comprador, la revisión del pedido y su confirmación mediante la API. |

Las funcionalidades marcadas como implementadas ya se encuentran integradas en la rama `main`. Las mejoras pendientes, como medidas reales, productos fabricados con recortes, confirmación de compra, visor 3D y realidad aumentada, se encuentran registradas en el plan de acción.

## Primera entrega — Unidad I

La primera versión incluye:

* Pantalla principal relacionada con la temática de TEKA.
* Encabezado con el nombre del proyecto.
* Banner de presentación.
* Categorías con desplazamiento horizontal.
* Listado de productos destacados.
* Sección institucional.
* Datos estáticos definidos dentro del proyecto.
* Componentes reutilizables y comunicación mediante props.

### Aplicación de los contenidos de la unidad

| Contenido                 | Implementación                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| `View`                    | Organización de contenedores, secciones y tarjetas.                                             |
| `Text`                    | Presentación de títulos, categorías, nombres y precios.                                         |
| `Image`                   | Visualización del banner y las fotografías de los productos.                                    |
| `ScrollView`              | Desplazamiento vertical de la pantalla y horizontal de las categorías.                          |
| Datos estáticos           | Productos y categorías definidos en `src/data/products.ts`.                                     |
| Componentes reutilizables | `ProductCard` y `CategoryChip`.                                                                 |
| Props                     | Envío de los datos de cada producto a su tarjeta y del nombre y estado visual a cada categoría. |

## Criterios de diseño

La interfaz utiliza una escala de espaciado basada en múltiplos de cuatro: 4, 8, 12, 16, 20, 24, 32, 40, 48 y 64.

Estos valores se aplican a márgenes, separaciones y rellenos para mantener consistencia visual. Los colores, radios y espacios se centralizan en `src/theme/design-tokens.ts`.

La identidad visual utiliza tonos crema, verde y madera, junto con fotografías destacadas y una distribución pensada para dispositivos móviles.

## Tecnologías

* React Native.
* Expo SDK 57.
* Expo Router.
* TypeScript.
* TanStack Query para consultas y caché de la API.
* Zustand para el estado local del carrito.

## Integración con TEKA Manager

La aplicación utiliza datos reales expuestos por la API de TEKA:

| Información | Endpoint |
| --- | --- |
| Productos | `GET /api/productos` y `GET /api/productos/{id}` |
| Categorías | `GET /api/auxiliares/tipos-producto` |
| Precios | `GET /api/precios-venta` y `GET /api/precios-venta/producto/{id}/vigente` |
| Stock | `GET /api/stock/productos/por-producto/{id}` |

Las fotografías continúan siendo recursos locales asociados al `ProductoId`. La base y la API todavía no poseen una entidad de imágenes de producto; esa ampliación queda registrada como una decisión pendiente.

## Configuración local

1. Copiar `.env.example` con el nombre `.env`.
2. Reemplazar la URL de ejemplo por la dirección de la API accesible desde el dispositivo.

```env
EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:PUERTO
```

No se deben subir archivos `.env` al repositorio.

## Ejecución

```bash
npm install
npx expo start --clear
```

Para probar en Expo Go, la computadora y el celular deben poder acceder a la misma red y a la URL configurada para la API.

La dirección depende del entorno de prueba:

* En Expo Web, si la API se ejecuta en la misma computadora, se puede usar `http://localhost:PUERTO`.
* En un celular físico, se debe usar la dirección IPv4 local de la computadora, por ejemplo `http://192.168.1.20:PUERTO`.
* Si la computadora cambia de red, su dirección IPv4 puede cambiar. En ese caso hay que actualizar el archivo `.env` y reiniciar Expo con `npx expo start --clear`.

## Archivos principales

| Archivo                            | Responsabilidad                                          |
| ---------------------------------- | -------------------------------------------------------- |
| `src/app/_layout.tsx`              | Configuración de la estructura de navegación.            |
| `src/app/index.tsx`                | Pantalla principal de la aplicación.                     |
| `src/app/catalogo.tsx`             | Catálogo, búsqueda y filtros.                             |
| `src/components/action-modal.tsx` | Confirmaciones reutilizables en Expo Web y Expo Go.       |
| `src/components/feedback-toast.tsx` | Avisos breves y no bloqueantes para acciones exitosas.   |
| `src/app/producto/[id].tsx`        | Detalle dinámico del producto.                            |
| `src/app/carrito.tsx`              | Gestión del carrito.                                      |
| `src/components/product-card.tsx`  | Tarjeta reutilizable para presentar un producto.         |
| `src/components/category-chip.tsx` | Componente reutilizable para presentar una categoría.    |
| `src/components/product-gallery.tsx` | Galería reutilizable de imágenes.                       |
| `src/components/quantity-selector.tsx` | Selector validado de cantidades.                      |
| `src/hooks/use-catalog-data.ts`    | Consulta y adaptación del catálogo.                       |
| `src/hooks/use-product-detail.ts`  | Consulta del producto, precio vigente y stock.            |
| `src/store/cart-store.ts`          | Estado y reglas del carrito con Zustand.                  |
| `src/data/products.ts`             | Tipo de producto utilizado por la interfaz.               |
| `src/theme/design-tokens.ts`       | Colores, radios y escala de espaciado.                   |

## Validaciones incorporadas

* No se muestran productos inactivos en el catálogo.
* Un producto sin precio vigente no puede agregarse al carrito.
* Un producto sin stock no puede agregarse al carrito.
* La cantidad mínima es una unidad.
* La cantidad no puede superar el stock informado por la API.
* Agregar nuevamente el mismo producto incrementa su cantidad sin duplicar la línea.
* Las rutas inválidas muestran un estado controlado.
* La confirmación de compra deberá volver a validar precio y stock en el servidor.

## Limitaciones conocidas

* Las imágenes aún no provienen de la API.
* La base actual no contiene medidas físicas, materiales comerciales ni modelos 3D.
* El botón de realidad aumentada se muestra deshabilitado hasta contar con un modelo 3D real del producto.
* La confirmación de compra todavía no está implementada.

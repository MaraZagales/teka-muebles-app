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

| Feature | Estado | Avance actual |
| --- | --- | --- |
| Consultar el catálogo de productos | En desarrollo | Se muestran cuatro productos de demostración con imagen, nombre, categoría y precio. Falta completar el catálogo. |
| Buscar y filtrar productos | Pendiente | Las categorías son visuales: todavía no filtran. La búsqueda no está implementada. |
| Consultar el detalle de un producto | Pendiente | Falta implementar la información ampliada y la navegación desde las tarjetas. |
| Gestionar el carrito de compras | Pendiente | El carrito es visual. Falta agregar productos, modificar cantidades, eliminarlos y calcular el total. |
| Confirmar una solicitud de compra | Pendiente | Falta implementar el formulario de datos, la revisión del pedido y su confirmación. |

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

## Archivos principales

| Archivo                            | Responsabilidad                                          |
| ---------------------------------- | -------------------------------------------------------- |
| `src/app/_layout.tsx`              | Configuración de la estructura de navegación.            |
| `src/app/index.tsx`                | Pantalla principal de la aplicación.                     |
| `src/components/product-card.tsx`  | Tarjeta reutilizable para presentar un producto.         |
| `src/components/category-chip.tsx` | Componente reutilizable para presentar una categoría.    |
| `src/data/products.ts`             | Datos de demostración y definición del tipo de producto. |
| `src/theme/design-tokens.ts`       | Colores, radios y escala de espaciado.                   |




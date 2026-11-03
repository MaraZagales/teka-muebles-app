# Plan de acción — TEKA Muebles

## Criterios obligatorios de desarrollo

- [ ] Validar cada funcionalidad contra los procesos reales de TEKA antes de implementarla.
- [ ] Utilizar los endpoints, campos y reglas existentes sin inventar comportamientos.
- [ ] Diferenciar claramente oportunidad, cliente, carrito, pedido, venta y cobro.
- [ ] Identificar el origen real de cada dato mostrado.
- [ ] Evitar datos hardcodeados, excepto recursos visuales justificados.
- [ ] Implementar cada pantalla con un objetivo funcional definido.
- [ ] Probar el circuito completo antes de considerar terminada una feature.
- [ ] Registrar cualquier decisión funcional pendiente en este plan.

## Estado general del proyecto

- [x] Primera entrega realizada.
- [x] Repositorio creado en GitHub.
- [x] Proyecto actualizado a las versiones recomendadas de Expo SDK 57.
- [x] Expo Doctor validado: 21/21 controles.
- [x] TypeScript validado sin errores.
- [x] Rama `feature/catalogo-busqueda` creada.
- [x] Rama publicada en GitHub.
- [x] Catálogo, búsqueda y filtros.
- [x] Detalle de producto.
- [x] Integración inicial con la API.
- [ ] Productos fabricados con recortes.
- [x] Carrito de compras.
- [x] Confirmación de solicitud de compra como pedido pendiente.
- [ ] Visor 3D.
- [ ] Realidad aumentada.
- [ ] Documentación final del código.
- [ ] Revisión final del README.

---

# Feature 1 — Catálogo, búsqueda y filtros

## Preparación

- [x] Crear la rama `feature/catalogo-busqueda`.
- [x] Actualizar dependencias de Expo SDK 57.
- [x] Ejecutar `npx expo-doctor`.
- [x] Ejecutar `npx tsc --noEmit`.
- [x] Probar la aplicación en Expo Go.
- [x] Guardar y subir la actualización de dependencias.

## Componentes

- [x] Instalar `@expo/vector-icons`.
- [x] Crear el componente `SearchBar`.
- [x] Convertir `CategoryChip` en un componente interactivo.
- [x] Adaptar `ProductCard` para que pueda recibir una acción al presionarlo.
- [x] Crear un componente `EmptyState` para búsquedas sin resultados.
- [x] Crear un modal reutilizable para confirmar acciones destructivas.
- [x] Crear un toast reutilizable para informar acciones exitosas sin interrumpir la navegación.
- [x] Revisar si necesitamos un encabezado reutilizable.
- [x] Crear un encabezado reutilizable AppHeader.
- [x] Crear un pie reutilizable AppFooter.
- [x] Centralizar la información del negocio en business-info.ts.

## Integración con datos reales de TEKA

- [x] Crear los tipos correspondientes al catálogo público de la API.
- [x] Configurar la URL base de la API.
- [x] Crear el servicio del catálogo público y su detalle.
- [x] Instalar y configurar TanStack Query.
- [x] Unificar producto, precio, disponibilidad, medidas e imágenes para la interfaz.
- [x] Mostrar estados de carga, error y sin resultados.
- [x] Derivar las categorías desde los productos publicados por la API.
- [x] Integrar el catálogo inicial con la API.
- [x] Configurar CORS para Expo Web.
- [x] Probar la conexión desde Expo Web.
- [x] Probar la conexión desde el celular físico.

## Pantalla de catálogo

- [x] Crear `src/app/catalogo.tsx`.
- [x] Agregar el título y la descripción de la pantalla.
- [x] Agregar el buscador.
- [x] Mostrar las categorías de forma visible y adaptable, sin desplazamiento horizontal.
- [x] Mostrar productos mediante `FlatList`.
- [x] Configurar `keyExtractor`.
- [x] Configurar `renderItem`.
- [x] Mostrar dos columnas con `numColumns`.
- [x] Filtrar productos por categoría.
- [x] Buscar productos por nombre.
- [x] Combinar búsqueda y categoría.
- [x] Mostrar la cantidad de resultados.
- [x] Mostrar un estado vacío cuando no existan coincidencias.
- [x] Limitar la pantalla de Inicio a un máximo de cuatro productos.
- [x] Definir cómo se identifican los productos destacados.
- [x] Mostrar todos los productos únicamente en la pantalla Catálogo.
- [x] Mantener Inicio como una pantalla resumida y comercial.
- [x] Mostrar en Inicio únicamente productos marcados como destacados por la API.
- [x] Mostrar en Inicio un máximo de cuatro productos destacados.
- [x] Aplicar búsqueda y categorías sobre todos los productos publicados y disponibles.
- [x] Reemplazar las galerías locales por imágenes provistas por la API.
- [x] Eliminar el catálogo manual de imágenes y medidas.

## Navegación

- [x] Convertir “Ver colección” en un botón funcional.
- [x] Convertir “Ver todas” en un enlace funcional.
- [x] Navegar desde Inicio hacia Catálogo con Expo Router.
- [x] Verificar el botón para volver.
- [x] Confirmar que Inicio continúa funcionando igual.

## Diseño

- [x] Conservar la paleta crema, verde y madera.
- [x] Usar valores de `design-tokens.ts`.
- [x] Mantener espacios basados en múltiplos de cuatro.
- [x] Mantener radios y tipografías consistentes.
- [x] Verificar tamaños táctiles mínimos en los componentes implementados.
- [ ] Probar en diferentes tamaños de celular.
- [ ] Verificar textos largos y nombres de productos.
- [ ] Verificar accesibilidad básica.

## Validaciones técnicas

- [x] Ejecutar `npx tsc --noEmit`.
- [x] Ejecutar `npx expo-doctor`.
- [x] Probar búsqueda por nombre.
- [x] Probar búsqueda con mayúsculas y minúsculas.
- [x] Probar cada categoría.
- [x] Probar búsqueda y categoría simultáneamente.
- [x] Probar una búsqueda sin coincidencias.
- [x] Limpiar la búsqueda.
- [x] Probar navegación desde Inicio.
- [x] Revisar que no existan errores en la consola.
- [x] Ejecutar `git status`.
- [x] Revisar todos los cambios con `git diff`.

## Documentación de la feature

- [ ] Registrar los componentes aplicados de la Clase 2.
- [ ] Explicar el uso de `TextInput`.
- [ ] Explicar el uso de `TouchableOpacity`.
- [ ] Explicar el uso de `FlatList`.
- [ ] Explicar `data`, `renderItem` y `keyExtractor`.
- [ ] Explicar el uso de `useState`.
- [ ] Explicar las props de los componentes reutilizables.
- [ ] Guardar los archivos donde se encuentra cada concepto.
- [x] Actualizar el estado de la feature en el README.
- [x] Actualizar la sección de contenidos aplicados del README.

## Cierre de la rama

- [x] Realizar el commit funcional.
- [x] Subir la rama a GitHub.
- [x] Crear un Pull Request.
- [x] Revisar los archivos modificados.
- [x] Integrar la rama en `main`.
- [x] Actualizar el repositorio local.
- [ ] Eliminar la rama cuando ya no sea necesaria.

---

# Feature 2 — Detalle del producto

- [x] Crear la rama `feature/detalle-producto-carrito`.
- [x] Crear la ruta dinámica `producto/[id].tsx`.
- [x] Navegar desde `ProductCard`.
- [x] Consultar el detalle público por ID mediante la API.
- [x] Obtener precio vigente y disponibilidad efectiva desde el contrato público.
- [x] Mostrar galería, nombre, categoría y precio.
- [x] Mostrar descripción y color disponibles en la base.
- [x] Mantener el código del producto como dato interno, sin exponerlo al comprador.
- [x] Incorporar ancho, alto y profundidad al modelo Producto, procedimientos y API.
- [x] Reemplazar las medidas locales por medidas reales provistas por la API.
- [x] Agregar un selector de cantidad validado.
- [x] Agregar el botón funcional “Agregar al carrito”.
- [x] Informar con un toast no bloqueante cuando se agrega un producto.
- [x] Mostrar “Ver cómo queda en tu espacio” deshabilitado hasta contar con un modelo 3D real.
- [x] Contemplar producto inexistente o ID inválido.
- [x] Contemplar productos sin precio, sin stock, sin descripción o sin imágenes.
- [x] Probar navegación y botón para volver.
- [x] Ejecutar TypeScript, Expo Doctor y exportación web.
- [ ] Registrar los conceptos aplicados.
- [x] Actualizar el README.
- [ ] Crear el Pull Request e integrar en `main`.

---

# Feature 3 — API y TanStack Query

- [x] Confirmar la versión vigente de la API de TEKA.
- [x] Confirmar la URL y los endpoints disponibles.
- [x] Instalar TanStack Query.
- [x] Configurar `QueryClientProvider`.
- [x] Crear el servicio de productos.
- [x] Crear los tipos de respuesta de la API.
- [x] Crear el hook `useCatalogData`.
- [x] Implementar `queryKey`.
- [x] Implementar `queryFn`.
- [x] Mostrar `ActivityIndicator`.
- [x] Mostrar estado de error.
- [x] Agregar una acción para reintentar.
- [x] Combinar productos y precios.
- [x] Resolver la asociación con las imágenes.
- [x] Configurar la URL mediante una variable de entorno.
- [x] Probar desde el celular físico.

---

# Feature 4 — Productos fabricados con recortes

- [ ] Analizar los datos reales del módulo Recortes.
- [ ] Definir cómo identificar un producto fabricado con recortes.
- [ ] Crear la rama `feature/productos-recortes`.
- [ ] Agregar un indicador en `ProductCard`.
- [ ] Crear la colección “Hechos con recortes”.
- [ ] Agregar el filtro correspondiente.
- [ ] Mostrar información de sustentabilidad en el detalle.
- [ ] Evitar exponer información interna de producción.
- [ ] Probar la experiencia completa.
- [ ] Actualizar el README.
- [ ] Crear el Pull Request e integrar en `main`.

---

# Feature 5 — Carrito con Zustand

- [x] Desarrollar el carrito dentro de la rama `feature/detalle-producto-carrito`.
- [x] Instalar Zustand.
- [x] Crear `cart-store.ts`.
- [x] Agregar productos.
- [x] Evitar productos duplicados.
- [x] Incrementar cantidades.
- [x] Disminuir cantidades.
- [x] Evitar cantidades menores a uno.
- [x] Evitar superar el stock informado al agregar el producto.
- [x] Eliminar productos.
- [x] Vaciar el carrito.
- [x] Implementar confirmaciones con un `Modal` reutilizable de React Native, compatible con Expo Web y Expo Go.
- [x] Corregir el diálogo para evitar botones HTML anidados en Expo Web.
- [x] Reubicar “Quitar producto” dentro de la tarjeta para evitar desbordes en pantallas angostas.
- [x] Calcular unidades totales.
- [x] Calcular el importe total.
- [x] Actualizar el indicador del encabezado.
- [x] Crear la pantalla del carrito.
- [x] Mostrar el estado de carrito vacío.
- [ ] Registrar los conceptos de Zustand.
- [x] Actualizar el README.
- [x] Probar el circuito completo del carrito en Expo Go.
- [x] Volver a probar “Eliminar producto” y “Vaciar carrito” en Expo Web.
- [ ] Crear el Pull Request e integrar en `main`.

## Mejora visual compartida

- [x] Reducir la presencia visual del footer en todas las pantallas.
- [x] Agregar el WhatsApp comercial con enlace directo.
- [ ] Confirmar dirección, teléfono y enlaces comerciales antes de publicar la aplicación.
- [ ] Probar WhatsApp, Instagram, ubicación y tienda en Expo Web y Expo Go.

---

# Feature 6 — Confirmación de compra

- [x] Crear la rama `feature/checkout-solicitud-compra`.
- [x] Crear el formulario del comprador.
- [x] Utilizar `TextInput` controlados.
- [x] Validar campos obligatorios.
- [x] Validar correo y teléfono.
- [x] Incorporar calle, altura, piso/departamento, barrio y código postal.
- [x] Cargar provincias y localidades desde endpoints públicos de la API.
- [x] Vincular por correo con un cliente activo o crear un cliente ecommerce nuevo.
- [x] Reutilizar o crear el domicilio de entrega del cliente.
- [x] Mostrar los errores de manera consistente.
- [x] Mostrar el resumen de la compra.
- [x] Registrar un `Pedido` pendiente mediante `POST /api/ecommerce/checkout`.
- [x] Mantener la confirmación comercial fuera de `POST /api/ventas`.
- [x] Mantener la solicitud pendiente sin reservar ni descontar stock.
- [x] Guardar en el pedido una copia del domicilio utilizado.
- [x] Mostrar el resultado y el estado del correo de confirmación.
- [x] Manejar errores del servidor e idempotencia de reintentos.
- [x] Vaciar el carrito solamente después de registrar la solicitud.
- [x] Actualizar el README.
- [ ] Probar el circuito completo contra API, SQL Server y SMTP reales.
- [ ] Crear el Pull Request e integrar en `main`.

---

# Feature 7 — Previsualización del ambiente con APIs nativas

- [x] Confirmar compatibilidad de `expo-camera` y `expo-image-picker` con Expo SDK 57 y Expo Go.
- [x] Instalar y configurar `expo-camera`.
- [x] Solicitar y manejar el permiso de cámara.
- [x] Capturar una fotografía del ambiente desde la app.
- [x] Instalar y configurar `expo-image-picker`.
- [x] Solicitar y manejar el acceso a la galería.
- [x] Permitir elegir una imagen existente y controlar su cancelación.
- [x] Crear una ruta dinámica de previsualización para cada producto.
- [x] Superponer la imagen real del producto obtenida desde la API.
- [x] Permitir arrastrar el producto y modificar su escala.
- [x] Mantener las fotografías localmente, sin enviarlas a la API.
- [x] Documentar que la composición es 2D y no una medición real del ambiente.
- [x] Actualizar el README.
- [ ] Probar cámara, galería y permisos rechazados en Expo Go sobre un celular físico.
- [ ] Crear el Pull Request e integrar en `main`.

## Evolución futura: visor 3D y realidad aumentada

- [ ] Conseguir modelos 3D de los muebles.
- [ ] Confirmar formatos, escala y medidas reales.
- [ ] Evaluar una solución con detección de pisos y paredes.
- [ ] Determinar si requiere un development build fuera de Expo Go.

---

# Documentación final para estudiar el proyecto

- [ ] Explicar el objetivo funcional de la aplicación.
- [ ] Explicar la estructura de carpetas.
- [ ] Explicar cada pantalla.
- [ ] Explicar cada componente reutilizable.
- [ ] Explicar props y estado local.
- [ ] Explicar Expo Router.
- [ ] Explicar `FlatList`.
- [ ] Explicar TanStack Query.
- [ ] Explicar Zustand.
- [ ] Explicar la integración con la API.
- [ ] Explicar el carrito.
- [ ] Explicar las validaciones.
- [ ] Explicar los productos hechos con recortes.
- [ ] Explicar el visor 3D y la realidad aumentada.
- [ ] Relacionar cada concepto con las presentaciones de clase.
- [ ] Indicar en qué archivo se encuentra cada concepto.
- [ ] Incorporar ejemplos pequeños del código real.
- [ ] Crear un glosario.
- [ ] Generar el documento final en formato DOCX.

---

# Revisión final del README

- [x] Revisar el nombre y la descripción.
- [x] Revisar los integrantes.
- [x] Actualizar todas las features.
- [x] Actualizar el estado real de cada feature.
- [x] Documentar las tecnologías utilizadas.
- [x] Documentar la estructura principal.
- [x] Documentar las variables de entorno.
- [x] Documentar la conexión con la API.
- [x] Documentar la ejecución con Expo Go.
- [ ] Documentar el development build si se utiliza.
- [x] Documentar las limitaciones conocidas.
- [ ] Agregar capturas de las pantallas terminadas.
- [ ] Verificar que otra persona pueda instalar y ejecutar el proyecto.
- [x] Documentar la configuración del archivo `.env` en el README.
- [ ] Evaluar y realizar el despliegue de la API y la base de datos.
- [ ] Reemplazar la URL local por una URL pública con HTTPS.

## Definición pendiente — clientes y oportunidades comerciales

- [x] Al confirmar la solicitud se reutiliza o crea un cliente invitado por correo.
- [ ] Definir cómo identificar a un cliente existente desde la app.
- [x] Evitar duplicados de cliente activo mediante correo normalizado y rechazar ambigüedades.
- [ ] Revisar el alta de clientes mediante `POST /api/clientes`.
- [x] Solicitar nombre y correo; apellido, teléfono y observaciones son opcionales.
- [ ] Definir si una consulta o intención de compra genera una oportunidad comercial.
- [ ] Registrar oportunidades mediante `POST /api/oportunidades`.
- [ ] Definir el canal de venta correspondiente a la aplicación móvil.
- [ ] Definir cómo representar los productos de interés dentro de la oportunidad.
- [x] El carrito se convierte en Pedido pendiente; todavía no crea una venta ni un cobro.
- [x] Permitir confirmar como invitado sin registrar una cuenta ecommerce.
- [ ] Diseñar las pantallas del flujo de identificación y registro.
- [x] Integrar el servidor de correo existente para confirmar la recepción de la solicitud.
- [x] Eliminar catálogos hardcodeados del front y usar el catálogo público como única fuente.
- [ ] Documentar la ejecución local, configuración del `.env` y CORS.
- [x] Publicar solo productos activos con publicación, precio, ficha, tres imágenes y disponibilidad efectiva.
- [x] Diferenciar producto activo de producto publicado en la aplicación.
- [x] Almacenar archivos bajo `wwwroot/ecommerce/productos/{productoId}` y resolver su host desde la configuración de la app.
- [x] Auditar las galerías locales y su asociación con los ProductoId reales.
- [x] Incorporar imágenes reales para los productos sin galería local: 29, 33, 34, 35, 36, 40, 51, 52, 53, 54 y 56.
- [x] Crear renders ilustrativos temporales para los productos originales sin fotografía, manteniendo la identidad visual de TEKA.
- [ ] Reemplazar los renders temporales por fotografías reales antes de publicar la aplicación.
- [x] Incorporar portada y galería en la respuesta de la API.
- [x] Reemplazar las imágenes locales por imágenes provistas por la API.

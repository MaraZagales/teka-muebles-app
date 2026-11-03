import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { ApiRequestError } from "@/services/api-client";
import {
  confirmPurchaseRequest,
  createPurchaseRequestId,
  getPublicLocalities,
  getPublicProvinces,
  type CheckoutAddress,
  type CheckoutBuyer,
  type CheckoutResponse,
  type LocationOption,
} from "@/services/checkout-service";
import { useCartStore } from "@/store/cart-store";
import { colors, radii, spacing } from "@/theme/design-tokens";

type FormErrors = Partial<
  Record<
    | "name"
    | "email"
    | "phone"
    | "notes"
    | "street"
    | "streetNumber"
    | "provinceId"
    | "localityId",
    string
  >
>;

function formatPrice(value: number): string {
  return `$ ${Math.round(value).toLocaleString("es-AR")}`;
}

function validateForm(
  buyer: CheckoutBuyer,
  address: CheckoutAddress,
): FormErrors {
  const errors: FormErrors = {};
  const email = buyer.email.trim();

  if (buyer.name.trim().length < 2) {
    errors.name = "Ingresá un nombre de al menos 2 caracteres.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Ingresá un correo válido.";
  }

  if (buyer.phone && buyer.phone.trim().length > 30) {
    errors.phone = "El teléfono no puede superar los 30 caracteres.";
  }

  if (buyer.notes && buyer.notes.trim().length > 250) {
    errors.notes = "Las observaciones no pueden superar los 250 caracteres.";
  }

  if (address.street.trim().length < 2) {
    errors.street = "Ingresá una calle de al menos 2 caracteres.";
  }

  if (address.streetNumber.trim().length < 1) {
    errors.streetNumber = "Ingresá la altura del domicilio.";
  }

  if (address.provinceId === null) {
    errors.provinceId = "Seleccioná una provincia.";
  }

  if (address.localityId === null) {
    errors.localityId = "Seleccioná una localidad.";
  }

  return errors;
}

export default function CheckoutScreen() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const requestId = useRef(createPurchaseRequestId()).current;
  const [buyer, setBuyer] = useState<CheckoutBuyer>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [address, setAddress] = useState<CheckoutAddress>({
    street: "",
    streetNumber: "",
    floorApartment: "",
    neighborhood: "",
    postalCode: "",
    provinceId: null,
    provinceName: "",
    localityId: null,
    localityName: "",
  });
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [localities, setLocalities] = useState<LocationOption[]>([]);
  const [locationSelector, setLocationSelector] = useState<
    "province" | "locality" | null
  >(null);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationsError, setLocationsError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CheckoutResponse | null>(null);

  useEffect(() => {
    let active = true;

    getPublicProvinces()
      .then((values) => {
        if (active) setProvinces(values);
      })
      .catch((error) => {
        if (active) {
          setLocationsError(
            error instanceof ApiRequestError
              ? error.message
              : "No pudimos cargar las provincias.",
          );
        }
      })
      .finally(() => {
        if (active) setLocationsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const total = items.reduce(
    (amount, item) => amount + item.price * item.quantity,
    0,
  );
  const selectorOptions =
    locationSelector === "province" ? provinces : localities;
  const selectorTitle =
    locationSelector === "province" ? "Elegir provincia" : "Elegir localidad";

  function updateBuyer<K extends keyof CheckoutBuyer>(
    field: K,
    value: CheckoutBuyer[K],
  ) {
    setBuyer((current) => ({ ...current, [field]: value }));
    if (field !== "lastName") {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    setRequestError(null);
  }

  function updateAddress<K extends keyof CheckoutAddress>(
    field: K,
    value: CheckoutAddress[K],
  ) {
    setAddress((current) => ({ ...current, [field]: value }));
    if (
      field === "street" ||
      field === "streetNumber" ||
      field === "provinceId" ||
      field === "localityId"
    ) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    setRequestError(null);
  }

  async function selectProvince(option: LocationOption) {
    setAddress((current) => ({
      ...current,
      provinceId: option.id,
      provinceName: option.descripcion,
      localityId: null,
      localityName: "",
    }));
    setErrors((current) => ({
      ...current,
      provinceId: undefined,
      localityId: undefined,
    }));
    setLocationSelector(null);
    setLocalities([]);
    setLocationsLoading(true);
    setLocationsError(null);

    try {
      setLocalities(await getPublicLocalities(option.id));
    } catch (error) {
      setLocationsError(
        error instanceof ApiRequestError
          ? error.message
          : "No pudimos cargar las localidades.",
      );
    } finally {
      setLocationsLoading(false);
    }
  }

  function selectLocality(option: LocationOption) {
    setAddress((current) => ({
      ...current,
      localityId: option.id,
      localityName: option.descripcion,
    }));
    setErrors((current) => ({ ...current, localityId: undefined }));
    setLocationSelector(null);
  }

  async function submit() {
    if (submitting) return;

    if (items.length === 0) {
      setRequestError("El carrito está vacío. Agregá al menos un producto.");
      return;
    }

    const validationErrors = validateForm(buyer, address);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setRequestError("Revisá los datos marcados antes de continuar.");
      return;
    }

    setSubmitting(true);
    setRequestError(null);

    try {
      const response = await confirmPurchaseRequest(
        requestId,
        buyer,
        address,
        items,
      );
      setResult(response);
      clearCart();
    } catch (error) {
      setRequestError(
        error instanceof ApiRequestError
          ? error.message
          : "No pudimos registrar el pedido. Revisá la conexión e intentá nuevamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <AppHeader />
        <ScrollView contentContainerStyle={styles.successContent}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={46} color={colors.white} />
            </View>
            <Text style={styles.successKicker}>PEDIDO RECIBIDO</Text>
            <Text style={styles.successTitle}>Pedido #{result.pedidoId}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {result.estado.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.successMessage}>{result.mensaje}</Text>
            <Text style={styles.successTotal}>
              Total de referencia: {formatPrice(result.total)}
            </Text>
            <View style={styles.deliveryNotice}>
              <Ionicons
                name="location-outline"
                size={22}
                color={colors.primaryDark}
              />
              <View style={styles.deliveryNoticeContent}>
                <Text style={styles.deliveryNoticeTitle}>
                  Domicilio de entrega
                </Text>
                <Text style={styles.deliveryNoticeText}>
                  {result.domicilioEntrega}
                </Text>
              </View>
            </View>
            <View style={styles.mailNotice}>
              <Ionicons
                name={
                  result.correoEnviado === false
                    ? "alert-circle-outline"
                    : "mail-outline"
                }
                size={22}
                color={colors.primaryDark}
              />
              <Text style={styles.mailNoticeText}>
                {result.correoEnviado === true
                  ? `Enviamos el detalle a ${buyer.email.trim().toLowerCase()}.`
                  : result.correoEnviado === false
                    ? "El pedido quedó registrado, aunque el correo no pudo enviarse."
                    : `El pedido ya estaba registrado. Revisá el correo ${buyer.email
                        .trim()
                        .toLowerCase()}.`}
              </Text>
            </View>
            <Text style={styles.disclaimer}>
              El pedido todavía no representa una venta confirmada. TEKA se
              comunicará para validar disponibilidad, entrega y forma de pago.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.replace("/catalogo")}
              accessibilityRole="button"
              accessibilityLabel="Volver al catálogo"
            >
              <Text style={styles.primaryButtonText}>VOLVER AL CATÁLOGO</Text>
            </TouchableOpacity>
          </View>

          <AppFooter />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <AppHeader showBack />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.kicker}>ÚLTIMO PASO</Text>
            <Text style={styles.title}>Confirmar pedido</Text>
            <Text style={styles.description}>
              Dejanos tus datos para que TEKA pueda contactarte y confirmar la
              compra.
            </Text>
          </View>

          <View style={styles.notice}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={colors.primaryDark}
            />
            <Text style={styles.noticeText}>
              No se realizará ningún cobro desde la app. Recibirás un correo con
              el pedido pendiente y TEKA se comunicará para confirmarlo.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Datos del comprador</Text>

            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={[
                styles.input,
                errors.name ? styles.inputError : undefined,
              ]}
              value={buyer.name}
              onChangeText={(value) => updateBuyer("name", value)}
              placeholder="Tu nombre"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              textContentType="givenName"
              maxLength={100}
              editable={!submitting}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <Text style={styles.label}>Apellido</Text>
            <TextInput
              style={styles.input}
              value={buyer.lastName}
              onChangeText={(value) => updateBuyer("lastName", value)}
              placeholder="Tu apellido"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              textContentType="familyName"
              maxLength={100}
              editable={!submitting}
            />

            <Text style={styles.label}>Correo electrónico *</Text>
            <TextInput
              style={[
                styles.input,
                errors.email ? styles.inputError : undefined,
              ]}
              value={buyer.email}
              onChangeText={(value) => updateBuyer("email", value)}
              placeholder="nombre@correo.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              maxLength={150}
              editable={!submitting}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={[
                styles.input,
                errors.phone ? styles.inputError : undefined,
              ]}
              value={buyer.phone}
              onChangeText={(value) => updateBuyer("phone", value)}
              placeholder="Ej.: 351 555 0000"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              maxLength={30}
              editable={!submitting}
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}

            <Text style={styles.label}>Observaciones</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.notes ? styles.inputError : undefined,
              ]}
              value={buyer.notes}
              onChangeText={(value) => updateBuyer("notes", value)}
              placeholder="Horario de contacto u otra aclaración"
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={250}
              editable={!submitting}
            />
            <Text style={styles.characterCount}>
              {buyer.notes?.length ?? 0}/250
            </Text>
            {errors.notes && (
              <Text style={styles.errorText}>{errors.notes}</Text>
            )}
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Domicilio de entrega</Text>
            <Text style={styles.sectionHint}>
              Se guardará en TEKA Manager y quedará vinculado al cliente del
              pedido.
            </Text>

            <Text style={styles.label}>Calle *</Text>
            <TextInput
              style={[
                styles.input,
                errors.street ? styles.inputError : undefined,
              ]}
              value={address.street}
              onChangeText={(value) => updateAddress("street", value)}
              placeholder="Ej.: Av. Colón"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              textContentType="streetAddressLine1"
              maxLength={120}
              editable={!submitting}
            />
            {errors.street && (
              <Text style={styles.errorText}>{errors.street}</Text>
            )}

            <Text style={styles.label}>Altura *</Text>
            <TextInput
              style={[
                styles.input,
                errors.streetNumber ? styles.inputError : undefined,
              ]}
              value={address.streetNumber}
              onChangeText={(value) => updateAddress("streetNumber", value)}
              placeholder="Ej.: 1234"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
              maxLength={20}
              editable={!submitting}
            />
            {errors.streetNumber && (
              <Text style={styles.errorText}>{errors.streetNumber}</Text>
            )}

            <Text style={styles.label}>Piso / departamento</Text>
            <TextInput
              style={styles.input}
              value={address.floorApartment}
              onChangeText={(value) => updateAddress("floorApartment", value)}
              placeholder="Ej.: 2° B"
              placeholderTextColor={colors.textMuted}
              maxLength={50}
              editable={!submitting}
            />

            <Text style={styles.label}>Barrio</Text>
            <TextInput
              style={styles.input}
              value={address.neighborhood}
              onChangeText={(value) => updateAddress("neighborhood", value)}
              placeholder="Ej.: General Paz"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              maxLength={100}
              editable={!submitting}
            />

            <Text style={styles.label}>Código postal</Text>
            <TextInput
              style={styles.input}
              value={address.postalCode}
              onChangeText={(value) => updateAddress("postalCode", value)}
              placeholder="Ej.: X5000"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
              maxLength={20}
              editable={!submitting}
            />

            <Text style={styles.label}>Provincia *</Text>
            <TouchableOpacity
              style={[
                styles.selector,
                errors.provinceId ? styles.inputError : undefined,
              ]}
              onPress={() => setLocationSelector("province")}
              disabled={
                submitting || locationsLoading || provinces.length === 0
              }
              accessibilityRole="button"
              accessibilityLabel="Seleccionar provincia"
            >
              <Text
                style={
                  address.provinceName
                    ? styles.selectorText
                    : styles.selectorPlaceholder
                }
              >
                {address.provinceName || "Seleccionar provincia"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.text} />
            </TouchableOpacity>
            {errors.provinceId && (
              <Text style={styles.errorText}>{errors.provinceId}</Text>
            )}

            <Text style={styles.label}>Localidad *</Text>
            <TouchableOpacity
              style={[
                styles.selector,
                errors.localityId ? styles.inputError : undefined,
              ]}
              onPress={() => setLocationSelector("locality")}
              disabled={
                submitting ||
                locationsLoading ||
                address.provinceId === null ||
                localities.length === 0
              }
              accessibilityRole="button"
              accessibilityLabel="Seleccionar localidad"
            >
              <Text
                style={
                  address.localityName
                    ? styles.selectorText
                    : styles.selectorPlaceholder
                }
              >
                {address.localityName || "Seleccionar localidad"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.text} />
            </TouchableOpacity>
            {errors.localityId && (
              <Text style={styles.errorText}>{errors.localityId}</Text>
            )}

            {locationsLoading && (
              <View style={styles.locationStatus}>
                <ActivityIndicator size="small" color={colors.primaryDark} />
                <Text style={styles.locationStatusText}>
                  Cargando ubicaciones…
                </Text>
              </View>
            )}
            {locationsError && (
              <Text style={styles.errorText}>{locationsError}</Text>
            )}
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen del pedido</Text>
            {items.map((item) => (
              <View key={item.productId} style={styles.itemRow}>
                <View style={styles.itemDescription}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>
                    Cantidad: {item.quantity}
                  </Text>
                </View>
                <Text style={styles.itemSubtotal}>
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total de referencia</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
            <Text style={styles.totalHint}>
              El precio y la disponibilidad se validarán nuevamente al registrar
              el pedido.
            </Text>
          </View>

          {requestError && (
            <View style={styles.requestError} accessibilityRole="alert">
              <Ionicons name="alert-circle-outline" size={21} color="#8F2D2D" />
              <Text style={styles.requestErrorText}>{requestError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, submitting && styles.buttonDisabled]}
            onPress={submit}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Confirmar el pedido"
          >
            {submitting ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.primaryButtonText}>CONFIRMAR PEDIDO</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Volver al carrito"
          >
            <Text style={styles.secondaryButtonText}>VOLVER AL CARRITO</Text>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <AppFooter />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        visible={locationSelector !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setLocationSelector(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectorTitle}</Text>
              <TouchableOpacity
                onPress={() => setLocationSelector(null)}
                accessibilityRole="button"
                accessibilityLabel="Cerrar selector"
              >
                <Ionicons name="close" size={26} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {selectorOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.modalOption}
                  onPress={() =>
                    locationSelector === "province"
                      ? void selectProvince(option)
                      : selectLocality(option)
                  }
                  accessibilityRole="button"
                >
                  <Text style={styles.modalOptionText}>
                    {option.descripcion}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
  header: {
    marginBottom: spacing[5],
  },
  kicker: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
    marginBottom: spacing[1],
  },
  title: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "900",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    marginTop: spacing[2],
  },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
    borderRadius: radii.medium,
    padding: spacing[4],
    backgroundColor: "#E8EEE6",
    marginBottom: spacing[5],
  },
  noticeText: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
  },
  formCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.large,
    padding: spacing[5],
    backgroundColor: colors.surface,
    marginBottom: spacing[5],
  },
  summaryCard: {
    borderRadius: radii.large,
    padding: spacing[5],
    backgroundColor: colors.primaryDark,
    marginBottom: spacing[5],
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: spacing[4],
  },
  sectionHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: -spacing[2],
    marginBottom: spacing[4],
  },
  summaryTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: spacing[4],
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: spacing[2],
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.small,
    paddingHorizontal: spacing[4],
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 15,
    marginBottom: spacing[4],
  },
  inputError: {
    borderColor: "#B94747",
    marginBottom: spacing[1],
  },
  selector: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[3],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.small,
    paddingHorizontal: spacing[4],
    backgroundColor: colors.background,
    marginBottom: spacing[4],
  },
  selectorText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  selectorPlaceholder: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 15,
  },
  locationStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginTop: spacing[1],
  },
  locationStatusText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  textArea: {
    minHeight: 100,
    paddingTop: spacing[3],
    textAlignVertical: "top",
    marginBottom: spacing[1],
  },
  characterCount: {
    alignSelf: "flex-end",
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: spacing[3],
  },
  errorText: {
    color: "#9D3030",
    fontSize: 12,
    marginBottom: spacing[3],
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.16)",
    paddingVertical: spacing[3],
  },
  itemDescription: {
    flex: 1,
  },
  itemName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  itemQuantity: {
    color: colors.whiteMuted,
    fontSize: 12,
    marginTop: spacing[1],
  },
  itemSubtotal: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing[3],
    paddingTop: spacing[4],
  },
  totalLabel: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
  totalValue: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "900",
  },
  totalHint: {
    color: colors.whiteMuted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: spacing[3],
  },
  requestError: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[2],
    borderWidth: 1,
    borderColor: "#D7A8A8",
    borderRadius: radii.small,
    padding: spacing[3],
    backgroundColor: "#F8EAEA",
    marginBottom: spacing[4],
  },
  requestErrorText: {
    flex: 1,
    color: "#8F2D2D",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },
  primaryButton: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.small,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[4],
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
  secondaryButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: radii.small,
    marginTop: spacing[3],
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  footerContainer: {
    marginTop: spacing[8],
  },
  successContent: {
    width: "100%",
    maxWidth: 720,
    flexGrow: 1,
    alignSelf: "center",
    justifyContent: "center",
    padding: spacing[4],
  },
  successCard: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.large,
    padding: spacing[6],
    backgroundColor: colors.surface,
    marginBottom: spacing[8],
  },
  successIcon: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    marginBottom: spacing[5],
  },
  successKicker: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  successTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginTop: spacing[1],
  },
  statusBadge: {
    borderRadius: radii.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    backgroundColor: "#EFE4CD",
    marginTop: spacing[3],
  },
  statusText: {
    color: "#6E5222",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  successMessage: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: spacing[5],
  },
  successTotal: {
    color: colors.primaryDark,
    fontSize: 17,
    fontWeight: "900",
    marginTop: spacing[4],
  },
  deliveryNotice: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.small,
    padding: spacing[4],
    backgroundColor: colors.background,
    marginTop: spacing[5],
  },
  deliveryNoticeContent: {
    flex: 1,
  },
  deliveryNoticeTitle: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
  },
  deliveryNoticeText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing[1],
  },
  mailNotice: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
    borderRadius: radii.small,
    padding: spacing[4],
    backgroundColor: "#E8EEE6",
    marginTop: spacing[5],
  },
  mailNoticeText: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },
  disclaimer: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginVertical: spacing[5],
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(20, 24, 20, 0.45)",
  },
  modalCard: {
    width: "100%",
    maxWidth: 720,
    maxHeight: "72%",
    alignSelf: "center",
    borderTopLeftRadius: radii.large,
    borderTopRightRadius: radii.large,
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
    backgroundColor: colors.surface,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing[5],
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  modalOption: {
    minHeight: 50,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing[3],
  },
  modalOptionText: {
    color: colors.text,
    fontSize: 15,
  },
});

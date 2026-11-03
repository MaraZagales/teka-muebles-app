import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  PanResponder,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { EmptyState } from '@/components/empty-state';
import { useProductDetail } from '@/hooks/use-product-detail';
import { ApiRequestError } from '@/services/api-client';
import { colors, radii, spacing } from '@/theme/design-tokens';

type Position = {
  x: number;
  y: number;
};

function parseProductId(value: string | string[] | undefined): number | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  const parsed = Number(candidate);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default function ProductPreviewScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const productId = parseProductId(id);
  const { data, isLoading, isError, error, refetch } =
    useProductDetail(productId);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const dragStartRef = useRef<Position>({ x: 0, y: 0 });
  const positionRef = useRef<Position>({ x: 0, y: 0 });
  const [backgroundUri, setBackgroundUri] = useState<string | null>(null);
  const [backgroundSource, setBackgroundSource] = useState<
    'camera' | 'gallery' | null
  >(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [takingPicture, setTakingPicture] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) + Math.abs(gesture.dy) > 2,
        onPanResponderGrant: () => {
          dragStartRef.current = positionRef.current;
        },
        onPanResponderMove: (_, gesture) => {
          const nextPosition = {
            x: dragStartRef.current.x + gesture.dx,
            y: dragStartRef.current.y + gesture.dy,
          };
          positionRef.current = nextPosition;
          setPosition(nextPosition);
        },
      }),
    [],
  );

  function resetProductPosition() {
    const initialPosition = { x: 0, y: 0 };
    positionRef.current = initialPosition;
    setPosition(initialPosition);
    setScale(1);
  }

  async function openCamera() {
    setMessage(null);

    const permission = cameraPermission?.granted
      ? cameraPermission
      : await requestCameraPermission();

    if (!permission.granted) {
      setMessage(
        permission.canAskAgain
          ? 'Necesitamos permiso para usar la cámara y fotografiar tu ambiente.'
          : 'El permiso de cámara está bloqueado. Habilitalo desde los ajustes del teléfono.',
      );
      return;
    }

    setCameraReady(false);
    setCameraOpen(true);
  }

  async function takePicture() {
    if (!cameraRef.current || !cameraReady || takingPicture) return;

    setTakingPicture(true);
    setMessage(null);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });

      if (!photo?.uri) {
        setMessage('No pudimos obtener la foto. Intentá nuevamente.');
        return;
      }

      setBackgroundUri(photo.uri);
      setBackgroundSource('camera');
      resetProductPosition();
      setCameraOpen(false);
    } catch {
      setMessage(
        'No pudimos tomar la foto. Revisá la cámara e intentá nuevamente.',
      );
    } finally {
      setTakingPicture(false);
    }
  }

  async function pickImage() {
    setMessage(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setMessage(
        permission.canAskAgain
          ? 'Necesitamos permiso para elegir una foto de tu galería.'
          : 'El acceso a la galería está bloqueado. Habilitalo desde los ajustes del teléfono.',
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });

      if (result.canceled) return;

      const selectedUri = result.assets[0]?.uri;
      if (!selectedUri) {
        setMessage('No pudimos leer la imagen seleccionada.');
        return;
      }

      setBackgroundUri(selectedUri);
      setBackgroundSource('gallery');
      resetProductPosition();
    } catch {
      setMessage('No pudimos abrir la galería. Intentá nuevamente.');
    }
  }

  function changeScale(step: number) {
    setScale((current) =>
      Math.min(1.8, Math.max(0.55, Number((current + step).toFixed(2)))),
    );
  }

  if (cameraOpen) {
    return (
      <SafeAreaView style={styles.cameraScreen}>
        <StatusBar barStyle="light-content" />
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          mode="picture"
          onCameraReady={() => setCameraReady(true)}
          onMountError={() => {
            setMessage('La cámara no pudo iniciarse en este dispositivo.');
            setCameraOpen(false);
          }}
        />

        <View style={styles.cameraTopBar}>
          <TouchableOpacity
            style={styles.cameraRoundButton}
            onPress={() => setCameraOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Cerrar cámara"
          >
            <Ionicons name="close" size={28} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.cameraTitleContainer}>
            <Text style={styles.cameraTitle}>Fotografiá tu ambiente</Text>
            <Text style={styles.cameraSubtitle}>
              Buscá un encuadre amplio y con buena luz.
            </Text>
          </View>
        </View>

        <View style={styles.cameraBottomBar}>
          <TouchableOpacity
            style={[
              styles.captureOuter,
              (!cameraReady || takingPicture) && styles.disabled,
            ]}
            onPress={() => void takePicture()}
            disabled={!cameraReady || takingPicture}
            accessibilityRole="button"
            accessibilityLabel="Tomar fotografía"
          >
            {takingPicture ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <View style={styles.captureInner} />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (productId === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AppHeader showBack />
        <View style={styles.centeredState}>
          <EmptyState
            title="Producto no encontrado"
            description="El enlace de la previsualización no es válido."
            actionLabel="VOLVER AL CATÁLOGO"
            onAction={() => router.replace('/catalogo')}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AppHeader showBack />
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={colors.primaryDark} />
          <Text style={styles.stateText}>Preparando la previsualización…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    const productNotFound =
      error instanceof ApiRequestError && error.status === 404;

    return (
      <SafeAreaView style={styles.safeArea}>
        <AppHeader showBack />
        <View style={styles.centeredState}>
          <EmptyState
            title={
              productNotFound
                ? 'Producto no encontrado'
                : 'No pudimos preparar la previsualización'
            }
            description={
              productNotFound
                ? 'El producto ya no está disponible.'
                : 'Revisá la conexión con la API e intentá nuevamente.'
            }
            actionLabel={productNotFound ? 'VOLVER AL CATÁLOGO' : 'REINTENTAR'}
            onAction={
              productNotFound
                ? () => router.replace('/catalogo')
                : () => void refetch()
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  const { product } = data;
  const productImage = product.images?.[0] ?? product.image;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <AppHeader showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
      >
        <View style={styles.content}>
          <Text style={styles.kicker}>PREVISUALIZACIÓN</Text>
          <Text style={styles.title}>Probá {product.name} en tu espacio</Text>
          <Text style={styles.description}>
            Sacá una foto del ambiente o elegí una de tu galería. Después
            arrastrá el mueble y ajustá su tamaño para comparar proporciones.
          </Text>

          <View style={styles.sourceActions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => void openCamera()}
              accessibilityRole="button"
              accessibilityLabel="Sacar foto del ambiente"
            >
              <Ionicons name="camera-outline" size={21} color={colors.white} />
              <Text style={styles.primaryButtonText}>USAR CÁMARA</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => void pickImage()}
              accessibilityRole="button"
              accessibilityLabel="Elegir foto de la galería"
            >
              <Ionicons
                name="images-outline"
                size={21}
                color={colors.primaryDark}
              />
              <Text style={styles.secondaryButtonText}>ELEGIR DE GALERÍA</Text>
            </TouchableOpacity>
          </View>

          {message && (
            <View style={styles.messageCard} accessibilityRole="alert">
              <Ionicons name="alert-circle-outline" size={21} color="#8F2D2D" />
              <Text style={styles.messageText}>{message}</Text>
              {(cameraPermission?.canAskAgain === false ||
                message.includes('ajustes')) && (
                <TouchableOpacity
                  onPress={() => void Linking.openSettings()}
                  accessibilityRole="button"
                >
                  <Text style={styles.settingsLink}>ABRIR AJUSTES</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {backgroundUri ? (
            <>
              <View style={styles.previewCanvas}>
                <Image
                  source={{ uri: backgroundUri }}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                  accessibilityLabel="Ambiente elegido"
                />

                {productImage && (
                  <View
                    style={[
                      styles.productOverlay,
                      {
                        transform: [
                          { translateX: position.x },
                          { translateY: position.y },
                          { scale },
                        ],
                      },
                    ]}
                    {...panResponder.panHandlers}
                  >
                    <Image
                      source={productImage}
                      style={styles.productImage}
                      resizeMode="contain"
                      accessibilityLabel={product.name}
                    />
                  </View>
                )}

                <View style={styles.sourceBadge}>
                  <Ionicons
                    name={
                      backgroundSource === 'camera'
                        ? 'camera-outline'
                        : 'images-outline'
                    }
                    size={15}
                    color={colors.white}
                  />
                  <Text style={styles.sourceBadgeText}>
                    {backgroundSource === 'camera' ? 'CÁMARA' : 'GALERÍA'}
                  </Text>
                </View>
              </View>

              <View style={styles.controlsCard}>
                <View style={styles.controlCopy}>
                  <Text style={styles.controlTitle}>Ajustar producto</Text>
                  <Text style={styles.controlHint}>
                    Arrastralo sobre la imagen y usá los controles de tamaño.
                  </Text>
                </View>
                <View style={styles.scaleControls}>
                  <TouchableOpacity
                    style={styles.scaleButton}
                    onPress={() => changeScale(-0.15)}
                    disabled={scale <= 0.55}
                    accessibilityRole="button"
                    accessibilityLabel="Reducir producto"
                  >
                    <Ionicons name="remove" size={22} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={styles.scaleValue}>
                    {Math.round(scale * 100)}%
                  </Text>
                  <TouchableOpacity
                    style={styles.scaleButton}
                    onPress={() => changeScale(0.15)}
                    disabled={scale >= 1.8}
                    accessibilityRole="button"
                    accessibilityLabel="Aumentar producto"
                  >
                    <Ionicons name="add" size={22} color={colors.text} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetProductPosition}
                  accessibilityRole="button"
                  accessibilityLabel="Centrar producto"
                >
                  <Ionicons
                    name="refresh-outline"
                    size={18}
                    color={colors.primaryDark}
                  />
                  <Text style={styles.resetButtonText}>RESTABLECER</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.emptyPreview}>
              <View style={styles.emptyPreviewIcon}>
                <Ionicons
                  name="scan-outline"
                  size={42}
                  color={colors.primaryDark}
                />
              </View>
              <Text style={styles.emptyPreviewTitle}>Elegí un ambiente</Text>
              <Text style={styles.emptyPreviewText}>
                La foto se procesa únicamente en tu dispositivo y no se envía a
                TEKA Manager.
              </Text>
            </View>
          )}

          <View style={styles.disclaimerCard}>
            <Ionicons
              name="information-circle-outline"
              size={21}
              color={colors.primaryDark}
            />
            <Text style={styles.disclaimerText}>
              Esta herramienta es una referencia visual 2D. No reemplaza la
              medición real del ambiente ni constituye realidad aumentada con
              detección de superficies.
            </Text>
          </View>

          <AppFooter />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    paddingBottom: spacing[6],
  },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[5],
  },
  kicker: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginBottom: spacing[2],
  },
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '900',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing[2],
  },
  sourceActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginTop: spacing[5],
    marginBottom: spacing[4],
  },
  primaryButton: {
    minWidth: 170,
    minHeight: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    borderRadius: radii.small,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing[4],
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  secondaryButton: {
    minWidth: 190,
    minHeight: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: radii.small,
    paddingHorizontal: spacing[4],
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[2],
    borderWidth: 1,
    borderColor: '#D7A8A8',
    borderRadius: radii.small,
    padding: spacing[3],
    backgroundColor: '#F8EAEA',
    marginBottom: spacing[4],
  },
  messageText: {
    flex: 1,
    minWidth: 190,
    color: '#8F2D2D',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  settingsLink: {
    color: '#8F2D2D',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  previewCanvas: {
    width: '100%',
    aspectRatio: 3 / 4,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: radii.large,
    backgroundColor: colors.imagePlaceholder,
  },
  productOverlay: {
    width: 190,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    borderRadius: radii.medium,
    backgroundColor: 'rgba(255,255,255,0.22)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  sourceBadge: {
    position: 'absolute',
    top: spacing[3],
    left: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    borderRadius: radii.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: 'rgba(41,37,36,0.72)',
  },
  sourceBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  controlsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[3],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.medium,
    padding: spacing[4],
    backgroundColor: colors.surface,
    marginTop: spacing[3],
  },
  controlCopy: {
    flex: 1,
    minWidth: 210,
  },
  controlTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  controlHint: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: spacing[1],
  },
  scaleControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  scaleButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    backgroundColor: colors.background,
  },
  scaleValue: {
    minWidth: 46,
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  resetButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.small,
    paddingHorizontal: spacing[3],
  },
  resetButtonText: {
    color: colors.primaryDark,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  emptyPreview: {
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radii.large,
    padding: spacing[6],
    backgroundColor: colors.surface,
  },
  emptyPreviewIcon: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    backgroundColor: '#E5EEE3',
    marginBottom: spacing[4],
  },
  emptyPreviewTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  emptyPreviewText: {
    maxWidth: 380,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: spacing[2],
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    borderRadius: radii.medium,
    padding: spacing[4],
    backgroundColor: '#E8EEE6',
    marginTop: spacing[4],
    marginBottom: spacing[8],
  },
  disclaimerText: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  centeredState: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  stateText: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: spacing[3],
  },
  cameraScreen: {
    flex: 1,
    backgroundColor: '#111111',
  },
  cameraTopBar: {
    position: 'absolute',
    top: spacing[4],
    left: spacing[4],
    right: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  cameraRoundButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  cameraTitleContainer: {
    flex: 1,
    borderRadius: radii.medium,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  cameraTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
  cameraSubtitle: {
    color: colors.whiteMuted,
    fontSize: 11,
    marginTop: spacing[1],
  },
  cameraBottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing[8],
    alignItems: 'center',
  },
  captureOuter: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    borderRadius: radii.full,
    backgroundColor: 'rgba(0,0,0,0.24)',
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: radii.full,
    backgroundColor: colors.white,
  },
  disabled: {
    opacity: 0.5,
  },
});

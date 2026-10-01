import { Ionicons } from '@expo/vector-icons';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { businessInfo } from '@/config/business-info';
import { colors, radii, spacing } from '@/theme/design-tokens';

type FooterLinkProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  url: string;
};

function FooterLink({ icon, label, url }: FooterLinkProps) {
  return (
    <TouchableOpacity
      style={styles.link}
      onPress={() => void Linking.openURL(url)}
      activeOpacity={0.8}
      accessibilityRole="link"
      accessibilityLabel={label}
    >
      <View style={styles.linkIcon}>
        <Ionicons name={icon} size={18} color={colors.accent} />
      </View>
      <Text style={styles.linkText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.footer}>
      <View style={styles.brandBlock}>
        <Text style={styles.brand}>{businessInfo.name}</Text>
        <Text style={styles.tagline}>{businessInfo.tagline}</Text>
      </View>

      <View style={styles.links}>
        <FooterLink
          icon="logo-whatsapp"
          label={businessInfo.whatsappLabel}
          url={businessInfo.whatsappUrl}
        />
        <FooterLink
          icon="logo-instagram"
          label={businessInfo.instagramLabel}
          url={businessInfo.instagramUrl}
        />
        <FooterLink
          icon="location-outline"
          label="Cómo llegar"
          url={businessInfo.mapsUrl}
        />
        <FooterLink
          icon="globe-outline"
          label="Tienda online"
          url={businessInfo.websiteUrl}
        />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>
          Córdoba Capital
        </Text>
        <Text style={styles.bottomText}>
          © {currentYear} TEKA
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderRadius: radii.medium,
    padding: spacing[4],
    backgroundColor: colors.primaryDark,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  brand: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
  },
  tagline: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[3],
  },
  link: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: radii.full,
    paddingRight: spacing[3],
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  linkText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  bottomRow: {
    paddingTop: spacing[3],
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[4],
  },
  bottomText: {
    color: colors.whiteMuted,
    fontSize: 10,
  },
});

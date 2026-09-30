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
      <Text style={styles.brand}>{businessInfo.name}</Text>
      <Text style={styles.tagline}>{businessInfo.tagline}</Text>
      <Text style={styles.description}>
        {businessInfo.description}
      </Text>

      <View style={styles.links}>
        <FooterLink
          icon="location-outline"
          label={businessInfo.address}
          url={businessInfo.mapsUrl}
        />
        <FooterLink
          icon="logo-instagram"
          label={businessInfo.instagramLabel}
          url={businessInfo.instagramUrl}
        />
        <FooterLink
          icon="globe-outline"
          label={businessInfo.websiteLabel}
          url={businessInfo.websiteUrl}
        />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>
          Córdoba, Argentina
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
    borderRadius: radii.large,
    padding: spacing[6],
    backgroundColor: colors.primaryDark,
  },
  brand: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
  },
  tagline: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginTop: spacing[1],
  },
  description: {
    maxWidth: 480,
    color: colors.whiteMuted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: spacing[4],
  },
  links: {
    gap: spacing[3],
    marginTop: spacing[6],
    marginBottom: spacing[6],
  },
  link: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  linkText: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  bottomRow: {
    borderTopWidth: 1,
    borderTopColor: colors.primary,
    paddingTop: spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[4],
  },
  bottomText: {
    color: colors.whiteMuted,
    fontSize: 11,
  },
});

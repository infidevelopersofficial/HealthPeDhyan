import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { theme } from '../constants/theme';

export default function ProfileScreen() {
  const handleLinkPress = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🌿</Text>
        <Text style={styles.appName}>HealthPeDhyan</Text>
        <Text style={styles.tagline}>Make Informed Food Choices</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionText}>
          HealthPeDhyan helps you make healthier food choices by providing
          detailed nutritional information and ingredient analysis.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>🏠 Browse healthy products</Text>
          <Text style={styles.featureItem}>🛒 Shop by category</Text>
          <Text style={styles.featureItem}>📷 Scan product labels</Text>
          <Text style={styles.featureItem}>📰 Read health articles</Text>
          <Text style={styles.featureItem}>🏅 Health score ratings</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Links</Text>
        <TouchableOpacity
          style={styles.link}
          onPress={() => handleLinkPress('https://healthpedhyan.com')}
        >
          <Text style={styles.linkText}>🌐 Visit Website</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => handleLinkPress('https://healthpedhyan.com/contact')}
        >
          <Text style={styles.linkText}>✉️ Contact Us</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>© 2024 HealthPeDhyan</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
  },
  logo: {
    fontSize: 64,
    marginBottom: theme.spacing.sm,
  },
  appName: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  tagline: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  section: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sectionText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  featureList: {
    gap: theme.spacing.sm,
  },
  featureItem: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  link: {
    paddingVertical: theme.spacing.sm,
  },
  linkText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    marginTop: 'auto',
  },
  version: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginBottom: 4,
  },
  copyright: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
});

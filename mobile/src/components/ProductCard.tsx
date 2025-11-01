import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Product } from '../types';
import { theme } from '../constants/theme';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.md * 3) / 2;

export function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {product.heroImage ? (
          <Image
            source={{ uri: product.heroImage }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        {/* Health Score Badge */}
        {product.healthScore > 0 && (
          <View style={[styles.scoreBadge, getScoreStyle(product.healthScore)]}>
            <Text style={styles.scoreText}>{product.healthScore}</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        {/* Brand */}
        {product.brand && (
          <Text style={styles.brand} numberOfLines={1}>
            {product.brand.name}
          </Text>
        )}

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        {/* Health Badges */}
        <View style={styles.badgesContainer}>
          {product.isPalmOilFree && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🌴 No Palm Oil</Text>
            </View>
          )}
          {product.isLowSugar && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🍯 Low Sugar</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getScoreStyle(score: number) {
  if (score >= 80) {
    return { backgroundColor: theme.colors.success };
  } else if (score >= 60) {
    return { backgroundColor: theme.colors.warning };
  } else {
    return { backgroundColor: theme.colors.error };
  }
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.surfaceDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  scoreBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    ...theme.typography.h4,
    color: theme.colors.background,
    fontWeight: '700',
  },
  infoContainer: {
    padding: theme.spacing.sm,
  },
  brand: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  title: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
    minHeight: 36,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
});

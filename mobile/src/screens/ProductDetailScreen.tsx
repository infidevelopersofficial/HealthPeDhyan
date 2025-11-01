import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Product, RootStackParamList } from '../types';
import { getProduct } from '../services/api';
import { Loading } from '../components/Loading';
import { ErrorView } from '../components/ErrorView';
import { theme } from '../constants/theme';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen() {
  const route = useRoute<ProductDetailRouteProp>();
  const { slug } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProduct(slug);
      setProduct(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const handleAffiliatePress = async (url: string, merchant: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  if (loading) {
    return <Loading message="Loading product..." />;
  }

  if (error || !product) {
    return <ErrorView message={error || 'Product not found'} onRetry={fetchProduct} />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Image */}
      {product.heroImage ? (
        <Image
          source={{ uri: product.heroImage }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.content}>
        {/* Brand */}
        {product.brand && (
          <Text style={styles.brand}>{product.brand.name}</Text>
        )}

        {/* Title */}
        <Text style={styles.title}>{product.title}</Text>

        {/* Health Score */}
        {product.healthScore > 0 && (
          <View style={styles.scoreContainer}>
            <View style={[styles.scoreBadge, getScoreStyle(product.healthScore)]}>
              <Text style={styles.scoreText}>{product.healthScore}</Text>
            </View>
            <Text style={styles.scoreLabel}>Health Score</Text>
          </View>
        )}

        {/* Health Badges */}
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Health Badges</Text>
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
            {product.isArtificialColorFree && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🎨 No Artificial Colors</Text>
              </View>
            )}
            {product.isWholeGrain && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🌾 Whole Grain</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        {product.shortSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.description}>{product.shortSummary}</Text>
          </View>
        )}

        {/* Ingredients */}
        {product.ingredientsText && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.description}>{product.ingredientsText}</Text>
          </View>
        )}

        {/* Allergens */}
        {product.allergensText && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergens</Text>
            <Text style={[styles.description, styles.allergensText]}>
              {product.allergensText}
            </Text>
          </View>
        )}

        {/* Affiliate Links */}
        {product.affiliateLinks && product.affiliateLinks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Buy Online</Text>
            {product.affiliateLinks
              .filter((link) => link.isActive)
              .map((link) => (
                <TouchableOpacity
                  key={link.id}
                  style={styles.affiliateButton}
                  onPress={() => handleAffiliatePress(link.url, link.merchant)}
                >
                  <Text style={styles.affiliateButtonText}>
                    Buy on {link.merchant}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        )}
      </View>
    </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  placeholderImage: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.surfaceDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
  },
  content: {
    padding: theme.spacing.md,
  },
  brand: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  scoreBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  scoreText: {
    ...theme.typography.h2,
    color: theme.colors.background,
    fontWeight: '700',
  },
  scoreLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  badgesSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  badgeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  allergensText: {
    color: theme.colors.error,
    fontWeight: '500',
  },
  affiliateButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  affiliateButtonText: {
    ...theme.typography.body,
    color: theme.colors.background,
    fontWeight: '600',
  },
});

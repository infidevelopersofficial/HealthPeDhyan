import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Article } from '../types';
import { theme } from '../constants/theme';

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
}

export function ArticleCard({ article, onPress }: ArticleCardProps) {
  // Format date
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Cover Image */}
      {article.coverImage ? (
        <Image
          source={{ uri: article.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>📰</Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Category */}
        {article.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>

        {/* Excerpt */}
        {article.excerpt && (
          <Text style={styles.excerpt} numberOfLines={3}>
            {article.excerpt}
          </Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {publishedDate && (
            <Text style={styles.date}>{publishedDate}</Text>
          )}
          {article.author?.name && (
            <Text style={styles.author}>By {article.author.name}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.surfaceDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  content: {
    padding: theme.spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  categoryText: {
    ...theme.typography.caption,
    color: theme.colors.background,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  excerpt: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  author: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
});

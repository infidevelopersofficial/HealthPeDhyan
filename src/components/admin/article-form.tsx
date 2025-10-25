'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ArticleFormProps {
  article?: any;
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      excerpt: formData.get('excerpt'),
      bodyMarkdown: formData.get('bodyMarkdown'),
      coverImage: formData.get('coverImage'),
      videoUrl: formData.get('videoUrl'),
      category: formData.get('category'),
      tags: formData.get('tags'),
      status: formData.get('status'),
      publishedAt: formData.get('status') === 'PUBLISHED' ? new Date().toISOString() : null,
    };

    try {
      const url = article ? `/api/admin/articles/${article.id}` : '/api/admin/articles';
      const method = article ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/articles');
        router.refresh();
      } else {
        alert('Error saving article');
      }
    } catch (error) {
      alert('Error saving article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={article?.title}
              required
              placeholder="Article title"
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={article?.slug}
              required
              placeholder="article-slug"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <textarea
              id="excerpt"
              name="excerpt"
              defaultValue={article?.excerpt || ''}
              rows={2}
              className="flex w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
              placeholder="Brief summary for previews"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                defaultValue={article?.category || ''}
                className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select a category</option>
                <option value="Ingredients 101">Ingredients 101</option>
                <option value="Label Literacy">Label Literacy</option>
                <option value="Kids Lunchbox">Kids Lunchbox</option>
                <option value="Healthy Swaps">Healthy Swaps</option>
                <option value="Research Dives">Research Dives</option>
              </select>
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                name="status"
                defaultValue={article?.status || 'DRAFT'}
                required
                className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={article?.tags || ''}
              placeholder="palm oil, nutrition, health"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              name="coverImage"
              defaultValue={article?.coverImage || ''}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="videoUrl">Video URL (YouTube, Vimeo, etc.)</Label>
            <Input
              id="videoUrl"
              name="videoUrl"
              defaultValue={article?.videoUrl || ''}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="mt-1 text-xs text-neutral-500">
              Add a video to make your article more engaging
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="bodyMarkdown">Article Body (Markdown) *</Label>
          <textarea
            id="bodyMarkdown"
            name="bodyMarkdown"
            defaultValue={article?.bodyMarkdown || ''}
            required
            rows={20}
            className="flex w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-mono"
            placeholder="Write your article in Markdown..."
          />
          <p className="mt-2 text-xs text-neutral-500">
            Supports Markdown formatting: **bold**, *italic*, # headers, - lists, etc.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : article ? 'Update Article' : 'Create Article'}
        </Button>
      </div>
    </form>
  );
}

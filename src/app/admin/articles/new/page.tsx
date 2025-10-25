import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { ArticleForm } from '@/components/admin/article-form';

export default async function NewArticlePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Write New Article</h1>
        <p className="mt-2 text-neutral-600">Create a new blog post with optional video content</p>
      </div>

      <ArticleForm />
    </div>
  );
}

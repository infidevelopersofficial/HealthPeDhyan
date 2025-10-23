import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
  title: 'Evidence Library',
  description:
    'Scientific research and credible sources backing our health recommendations and standards.',
});

export default async function EvidencePage() {
  const evidence = await prisma.evidence.findMany({
    orderBy: { year: 'desc' },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-neutral-900">Evidence Library</h1>
        <p className="mt-2 text-lg text-neutral-600">
          Peer-reviewed research and authoritative sources supporting our standards
        </p>
      </div>

      <div className="space-y-6">
        {evidence.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {item.publisher} {item.year && `· ${item.year}`}
                  </CardDescription>
                </div>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
              </div>
            </CardHeader>
            {item.summary && (
              <CardContent>
                <p className="text-neutral-600">{item.summary}</p>
                {item.tagsJson && (item.tagsJson as any).tags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {((item.tagsJson as any).tags as string[]).map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

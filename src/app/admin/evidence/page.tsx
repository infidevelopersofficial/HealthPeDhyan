import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EvidencePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Evidence Library</h1>
        <p className="mt-2 text-neutral-600">Manage scientific evidence and research</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            Evidence library management interface will be available here. You can manage scientific papers, studies, and research references.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

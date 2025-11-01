import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BadgesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Badges</h1>
        <p className="mt-2 text-neutral-600">Manage health badges for products</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            Badge management interface will be available here. You can manage badges like "Palm Oil Free", "Low Sugar", etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

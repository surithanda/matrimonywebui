import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Invalid Profile Mode
          </h2>
          <p className="text-gray-500 mb-8">
            The profile mode you requested is not valid. Please use either 'createprofile' or 'updateprofile'.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/createprofile">
                Create Profile
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/updateprofile">
                Update Profile
              </Link>
            </Button>
          </div>
          
          <div className="pt-4">
            <Button asChild variant="ghost">
              <Link href="/dashboard">
                ← Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
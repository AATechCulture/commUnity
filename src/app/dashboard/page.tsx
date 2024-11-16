import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProtectedPage } from "@/components/ProtectedPage";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <ProtectedPage>
      {session.user.role === 'ORGANIZATION' ? (
        redirect('/dashboard/organization')
      ) : (
        redirect('/dashboard/participant')
      )}
    </ProtectedPage>
  );
} 
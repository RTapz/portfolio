import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminGate } from "@/components/admin/AdminGate";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black" data-admin>
      <AdminGate>
        <AdminDashboard />
      </AdminGate>
    </main>
  );
}

import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
        <nav className="space-y-2">
          <Link href="/admin" className="block hover:underline">Dashboard</Link>
          <Link href="/admin/polls" className="block hover:underline">Manage Polls</Link>
          <Link href="/admin/create" className="block hover:underline">Create Poll</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}

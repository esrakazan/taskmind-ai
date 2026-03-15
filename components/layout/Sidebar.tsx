import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-6">TaskMind AI</h2>

      <nav className="flex flex-col gap-4">
<Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
<Link href="/projects" className="hover:text-gray-300">Projects</Link>
<Link href="/tasks" className="hover:text-gray-300">Tasks</Link>
<Link href="/ai" className="hover:text-gray-300">AI Assistant</Link>
      </nav>
    </aside>
  );
}
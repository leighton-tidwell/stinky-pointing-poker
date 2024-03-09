import { Home } from "lucide-react";

export default function SessionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="m-auto p-8 md:w-3/4 md:p-2">
      <div className="mb-4 flex items-center border-b-2 border-b-blue-400">
        <span className="flex-1 text-lg font-extrabold">
          Stinky Pointing Poker
        </span>
        <a href="/" className="flex items-center gap-2 text-blue-500">
          <Home size={20} /> Home
        </a>
      </div>
      {children}
    </div>
  );
}

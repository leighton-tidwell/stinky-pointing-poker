import { Home } from "lucide-react";
import Link from "next/link";

export default function SessionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="m-auto p-8 pt-2 md:w-3/4 md:p-2">
      <div className="mb-4 flex items-center border-b-2 border-b-blue-400 pb-2 md:pt-2">
        <div className="flex flex-1 flex-col">
          <span className="text-xl font-extrabold">Stinky Pointing Poker</span>
          <span className="text-sm">
            Created by ol&apos;{" "}
            <a
              title="Star it on Github"
              target="_blank"
              href="https://github.com/leighton-tidwell/stinky-pointing-poker"
              className="font-bold text-blue-500 underline"
            >
              Tidwellius
            </a>
          </span>
        </div>
        <Link href="/" className="flex items-center gap-2 text-blue-500">
          Home <Home size={20} />
        </Link>
      </div>
      {children}
    </div>
  );
}

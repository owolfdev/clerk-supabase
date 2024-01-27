import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/data-fetch" className="underline">
        Supabase Data Fetch Test
      </Link>
    </div>
  );
}

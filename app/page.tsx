import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <Link href="/data-fetch" className="underline">
        Supabase Data Fetch Test
      </Link>
      {/* <Link href="/data-fetch-client-side" className="underline">
        Supabase Data Fetch from client side Test
      </Link> */}
    </div>
  );
}

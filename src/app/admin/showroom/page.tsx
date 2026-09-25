// This file is a Server Component (no "use client"), so it can read any
// env var — including ones without the NEXT_PUBLIC_ prefix — because it
// only ever runs on the server. The value below is just a plain string by
// the time it reaches the client component; it is never bundled into
// client JS the way a NEXT_PUBLIC_* var would be.
import ShowroomClient from "./showroom-client";

export default function ShowroomPage() {
  const imageBaseUrl = process.env.LARAVEL_API_URL || "http://localhost:8000";

  return <ShowroomClient imageBaseUrl={imageBaseUrl} />;
}

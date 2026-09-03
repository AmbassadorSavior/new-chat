import { redirect } from "next/navigation";

/**
 * The Oppora product frontend is a static multi-page application
 * served from /public (index.html, explore.html, ...). This route only
 * exists as a fallback in case the App Router claims "/" ahead of the
 * static file — visitors are sent straight to the Oppora homepage.
 */
export default function Home() {
  redirect("/index.html");
}

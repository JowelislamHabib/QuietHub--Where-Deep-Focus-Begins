import Link from "next/link";
import {
  RiArrowLeftLine,
  RiFocus3Line,
  RiHome4Line,
  RiHotelLine,
} from "react-icons/ri";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden bg-stone-50 px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/4 size-72 rounded-full bg-indigo-300/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-1/4 size-64 rounded-full bg-violet-200/25 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center gap-8 text-center">
        <p
          aria-hidden
          className="pointer-events-none select-none font-heading text-[7rem] font-bold leading-none tracking-tighter text-indigo-100 sm:text-[9rem]"
        >
          404
        </p>

        <div className="-mt-24 grid gap-4 sm:-mt-28">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <RiFocus3Line className="size-7" aria-hidden />
          </span>

          <div className="grid gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Lost your focus?
            </h1>
            <p className="text-sm leading-relaxed text-stone-500 sm:text-base">
              Page not here — moved, removed, or URL typo. Pick a path below
              and get back to deep work.
            </p>
          </div>
        </div>

        <nav
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center"
          aria-label="Helpful links"
        >
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <RiHome4Line className="size-4" aria-hidden />
            Back to home
          </Link>
          <Link
            href="/rooms"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-6 text-sm font-medium text-stone-700 shadow-sm ring-1 ring-stone-900/5 transition-colors hover:border-indigo-200 hover:text-indigo-700"
          >
            <RiHotelLine className="size-4" aria-hidden />
            Browse rooms
          </Link>
        </nav>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-400 transition-colors hover:text-indigo-600"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Go back
        </Link>
      </div>
    </section>
  );
}

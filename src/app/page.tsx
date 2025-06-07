import type { Event } from "@/models/event.model";

import { getDictionary } from "@/lib/getDictionary";
import { getLocale } from "@/lib/getLocale";
import Image from "next/image";
import Link from "next/link";

import { fetchApprovedPublicEvents } from "@/services/event.services";

export default async function Home() {
  let totalEvents = 0;
  let totalBibsSold = 0;

  // Get locale and dictionary
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);

  try {
    const events: Event[] = await fetchApprovedPublicEvents();
    totalEvents = events.length;
    totalBibsSold = events.reduce(
      (sum, event) => sum + (event.bibsSold || 0),
      0,
    );
  } catch (error) {
    console.error("Failed to fetch event data for KPIs:", error);
  }

  return (
    <div className="font-[family-name:var(--font-geist-sans)] text-[var(--text-dark)]">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 md:py-24 bg-[var(--primary-pastel)]">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          {dictionary.home.hero.title}
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/90">
          {dictionary.home.hero.subtitle}
        </p>
        <Link className="btn btn-primary text-lg px-8 py-3" href="/events">
          {dictionary.home.hero.browseEventsButton}
        </Link>
      </section>

      {/* KPIs Section - Bento Box Style */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-[var(--text-dark)]">
            {dictionary.home.impact.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bento Box for Active Events */}
            <div className="bento-box flex flex-col items-center justify-center text-center">
              <h3 className="text-4xl font-bold text-[var(--accent-sporty)] mb-2">
                {totalEvents}
              </h3>
              <p className="text-xl text-[var(--text-dark)]">
                {dictionary.home.impact.activeEvents}
              </p>
            </div>
            {/* Bento Box for Bibs Exchanged */}
            <div className="bento-box flex flex-col items-center justify-center text-center">
              <h3 className="text-4xl font-bold text-[var(--accent-sporty)] mb-2">
                {totalBibsSold}
              </h3>
              <p className="text-xl text-[var(--text-dark)]">
                {dictionary.home.impact.bibsExchanged}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action / How it works (Simplified) */}
      <section className="py-12 px-4 bg-[var(--secondary-pastel)]/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-[var(--text-dark)]">
            {dictionary.home.callToAction.title}
          </h2>
          <p className="text-lg mb-8 text-[var(--text-dark)]/80">
            {dictionary.home.callToAction.description}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link className="btn btn-secondary" href="/faq">
              {dictionary.home.callToAction.learnMoreButton}
            </Link>
            {/* Future: Link to Sign Up or specific user roles */}
            {/* <Link href="/sign-up" className="btn btn-primary">
              Get Started
            </Link> */}
          </div>
        </div>
      </section>

      {/* Original Next.js info section - can be kept for reference or removed */}
      {/*
      <section className="p-8 pb-20 items-center justify-items-center bg-gray-100 dark:bg-gray-700">
        <main className="flex flex-col gap-[32px] items-center sm:items-start max-w-2xl mx-auto">
          <Image
            className="dark:invert mx-auto"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2 tracking-[-.01em]">
              Get started by editing{" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                src/app/page.tsx
              </code>
            </li>
            <li className="tracking-[-.01em]">
              Save and see your changes instantly.
            </li>
          </ol>
        </main>
      </section>
      */}
    </div>
  );
}

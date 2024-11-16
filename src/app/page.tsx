import Link from "next/link";
import { auth } from "@/lib/auth";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative isolate">
      {/* Background gradient */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Discover Amazing Events
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Join exciting events, meet new people, and create unforgettable memories. Your next adventure starts here.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all duration-300"
              >
                View Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full bg-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all duration-300"
                >
                  Get Started
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-purple-600 transition-all duration-300"
                >
                  Create an account <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/global/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BibUp - Your Race Bib Marketplace",
  description: "Buy and sell race bibs easily with BibUp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        >
          <header className="bg-white shadow-md">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                  BibUp
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <SignedIn>
                  <a href="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                  <a href="/races" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Races</a>
                  <a href="/dashboard/my-bibs" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">My Bibs</a>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <a href="/races" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Races</a>
                  <SignInButton mode="modal">
                    <button className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                     <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
              </div>
            </nav>
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

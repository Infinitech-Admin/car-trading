import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF980D]";

export default function Footer() {
  return (
    <>
      <footer className="border-t bg-[#080b0f]/90 text-white border-[#BF980D]">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          {/* Main Footer */}
          <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
            {/* Brand */}
            <div className="lg:col-span-1">
              {/* Logo */}
              <Link
                href="/"
                aria-label="AutoTrade home"
                className={`inline-block ${focusRing}`}
              >
                <Image
                  src="/logo.png"
                  alt="AutoTrade"
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain sm:h-12"
                />
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-400">
                Premium vehicles, transparent transactions, and a better way to
                find your next drive.
              </p>

              {/* Socials */}
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all duration-300 hover:border-[#BF980D]/50 hover:bg-[#BF980D]/10 hover:text-[#BF980D]"
                >
                  <FacebookIcon className="size-4" />
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all duration-300 hover:border-[#BF980D]/50 hover:bg-[#BF980D]/10 hover:text-[#BF980D]"
                >
                  <InstagramIcon className="size-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                Explore
              </h3>

              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <Link
                    href="/showroom"
                    className="text-zinc-400 transition-colors hover:text-[#BF980D]"
                  >
                    Browse Inventory
                  </Link>
                </li>

                <li>
                  <Link
                    href="/sell-trade"
                    className="text-zinc-400 transition-colors hover:text-[#BF980D]"
                  >
                    Sell / Trade Car
                  </Link>
                </li>

                <li>
                  <Link
                    href="/about"
                    className="text-zinc-400 transition-colors hover:text-[#BF980D]"
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="text-zinc-400 transition-colors hover:text-[#BF980D]"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                Services
              </h3>

              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <Link
                    href="/showroom"
                    className="text-zinc-400 transition-colors hover:text-[#BF980D]"
                  >
                    Vehicle Sales
                  </Link>
                </li>

                <li>
                  <Link
                    href="/sell-trade"
                    className="text-zinc-400 transition-colors hover:text-[#BF980D]"
                  >
                    Vehicle Trade-In
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="text-zinc-400 transition-colors hover:text-[#BF980D]"
                  >
                    Test Drive
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                Contact
              </h3>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#BF980D]" />

                  <a
                    href=""
                    className="flex items-center gap-3 text-zinc-400 transition-colors hover:text-[#BF980D]"
                  >
                    Your showroom address
                    <br />
                    Your City, Philippines
                  </a>
                </div>

                <a
                  href="tel:"
                  className="flex items-center gap-3 text-zinc-400 transition-colors hover:text-[#BF980D]"
                >
                  <Phone className="size-4 text-[#BF980D]" />
                  +63 000 000 0000
                </a>

                <a
                  href="mailto:"
                  className="flex items-center gap-3 text-zinc-400 transition-colors hover:text-[#BF980D]"
                >
                  <Mail className="size-4 text-[#BF980D]" />
                  hello@autotrade.com
                </a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-center text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="space-y-1">
              <p>
                &copy; {new Date().getFullYear()} AutoTrade. All rights
                reserved.
              </p>
              <span>
                Powered by{" "}
                <Link
                  href="https://www.infinitechphil.com/"
                  className="transition-colors hover:text-[#BF980D]"
                >
                  Infinitech Advertising Corporation
                </Link>
              </span>
            </div>

            <div className="flex justify-center gap-5 sm:justify-end">
              <Link
                href="/privacy-policy"
                className="transition-colors hover:text-[#BF980D]"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms-and-conditions"
                className="transition-colors hover:text-[#BF980D]"
              >
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

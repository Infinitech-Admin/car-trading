"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Mail,
    MapPin,
    Phone,
    CarFront,
    X,
} from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
)

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF980D]";

const legalCopy = {
    privacy: {
        title: "Privacy Policy",
        body: [
            "At AutoTrade, we value your trust and are committed to protecting your personal information. We collect details you provide when contacting us, requesting a valuation, or browsing our inventory.",
            "This information may be used to respond to enquiries, process vehicle transactions, improve our services, and communicate relevant updates. We do not sell your personal data to third parties for marketing purposes.",
            "We may use secure third-party tools to help operate our website, manage customer interactions, and improve the user experience. These partners are expected to handle your information with appropriate safeguards.",
            "You have the right to request access to, correction of, or deletion of your personal data, subject to legal and operational requirements. If you have any concerns, please contact our team directly.",
        ],
    },
    terms: {
        title: "Terms & Conditions",
        body: [
            "By using the AutoTrade website, you agree to interact with our platform in a lawful and respectful manner. All content, imagery, and information presented here are intended for general information and marketing purposes only.",
            "Vehicle listings, prices, availability, and specifications may change without notice. We make every effort to keep information accurate, but final pricing and availability are subject to confirmation at the time of sale or trade-in.",
            "Any enquiry, test drive, sale, or trade-in arrangement is subject to verification, documentation, and acceptance by AutoTrade. We reserve the right to decline or withdraw offers at our discretion when required by policy, legality, or business considerations.",
            "Customers are responsible for ensuring that the information they provide is accurate and complete. AutoTrade shall not be liable for losses arising from reliance on outdated or incorrect information provided by third parties or by users of the site.",
        ],
    },
} as const;

export default function Footer() {
    const [activeModal, setActiveModal] = useState<"privacy" | "terms" | null>(null);

    return (
        <>
            <footer className="border-t bg-[#080b0f]/90 text-white border-[#BF980D]">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                {/* Main Footer */}
                <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        {/* Logo */}
                        <Link href="/" className={`group flex items-center gap-2.5 sm:gap-3 ${focusRing}`}>
                            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#BF980D] text-black shadow-[0_10px_30px_rgba(191,152,13,0.22)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_35px_rgba(191,152,13,0.35)]">
                                <CarFront size={21} strokeWidth={2.5} />
                            </div>

                            <div className="leading-none">
                                <div className="text-base font-black tracking-tight text-white sm:text-lg">
                                    Auto<span className="text-zinc-400">Trade</span>
                                </div>

                                <div className="mt-1 text-[8px] font-medium uppercase tracking-[0.25em] text-[#BF980D] sm:text-[9px]">
                                    Automotive
                                </div>
                            </div>
                        </Link>

                        <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-400">
                            Premium vehicles, transparent transactions, and a
                            better way to find your next drive.
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
                                className="transition-colors hover:text-[#BF980D]">
                                Infinitech Advertising Corporation
                            </Link>
                        </span>
                    </div>

                    <div className="flex justify-center gap-5 sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setActiveModal("privacy")}
                            className="transition-colors hover:text-[#BF980D]"
                        >
                            Privacy Policy
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveModal("terms")}
                            className="transition-colors hover:text-[#BF980D]"
                        >
                            Terms & Conditions
                        </button>
                    </div>
                </div>
            </div>
        </footer>

        {activeModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-[28px] border border-[#BF980D]/20 bg-[#120f0d] shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                        <h3 className="text-xl font-bold text-white">{legalCopy[activeModal].title}</h3>
                        <button
                            type="button"
                            aria-label="Close dialog"
                            onClick={() => setActiveModal(null)}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-all hover:border-[#BF980D] hover:text-[#F3D77A] ${focusRing}`}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto px-5 py-5 text-sm leading-7 text-zinc-300 sm:px-6">
                        {legalCopy[activeModal].body.map((paragraph) => (
                            <p key={paragraph} className="mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
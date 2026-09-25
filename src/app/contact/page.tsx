"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clock3, Mail, MapPin, Phone, Send } from "lucide-react";

import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";

const contactOptions = [
    {
        icon: Phone,
        title: "Call us",
        value: "+63 000 000 0000",
        href: "tel:",
    },
    {
        icon: Mail,
        title: "Email",
        value: "hello@autotrade.com",
        href: "mailto:",
    },
    {
        icon: MapPin,
        title: "Visit us",
        value: "Your showroom address, Your City, Philippines",
        href: "",
    },
];

const hours = [
    { day: "Monday - Friday", time: "9:00 AM - 7:00 PM" },
    { day: "Saturday", time: "10:00 AM - 6:00 PM" },
    { day: "Sunday", time: "By appointment" },
];

const privacyCopy = {
    title: "Privacy Policy",
    body: [
        "At AutoTrade, we value your trust and are committed to protecting your personal information. We collect details you provide when contacting us, requesting a valuation, or browsing our inventory.",
        "This information may be used to respond to enquiries, process vehicle transactions, improve our services, and communicate relevant updates. We do not sell your personal data to third parties for marketing purposes.",
        "We may use secure third-party tools to help operate our website, manage customer interactions, and improve the user experience. These partners are expected to handle your information with appropriate safeguards.",
        "You have the right to request access to, correction of, or deletion of your personal data, subject to legal and operational requirements. If you have any concerns, please contact our team directly.",
    ],
};

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    lookingFor: string;
    message: string;
};

export default function Contact() {
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [privacyError, setPrivacyError] = useState("");
    const [activeModal, setActiveModal] = useState<"privacy" | null>(null);
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        lookingFor: "",
        message: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormData | "privacy", string>>>({});

    const handleFieldChange = (
        field: keyof FormData,
        value: string,
    ) => {
        setFormData((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: "" }));
    };

    const validateForm = () => {
        const nextErrors: Partial<Record<keyof FormData | "privacy", string>> = {};

        if (!formData.firstName.trim()) {
            nextErrors.firstName = "First name is required.";
        }

        if (!formData.lastName.trim()) {
            nextErrors.lastName = "Last name is required.";
        }

        if (!formData.email.trim()) {
            nextErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            nextErrors.email = "Please enter a valid email address.";
        }

        if (!formData.phone.trim()) {
            nextErrors.phone = "Phone number is required.";
        }

        if (!formData.message.trim()) {
            nextErrors.message = "Please include a brief message.";
        }

        if (!acceptedPrivacy) {
            nextErrors.privacy = "Please agree to the privacy policy before submitting your enquiry.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setPrivacyError("");
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#191610] text-white">
                <section className="relative overflow-hidden border-b border-[#BF980D]/20 bg-[#0d0b09]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(191,152,13,0.18),transparent_50%)]" />

                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                        <div className="max-w-3xl">
                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-px w-10 bg-[#BF980D]" />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#BF980D]">
                                    Contact us
                                </span>
                            </div>

                            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Let’s find your
                                <span className="block text-[#BF980D]">next ideal drive.</span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                                Tell us what you’re looking for, and our team will guide you toward a vehicle that feels right for your life, your budget, and your driving style.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="space-y-5">
                            {contactOptions.map(({ icon: Icon, title, value, href }) => (
                                <a
                                    key={title}
                                    href={href}
                                    target={href.startsWith("http") ? "_blank" : undefined}
                                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                                    className="group flex items-start gap-4 rounded-[24px] border border-white/10 bg-[#120f0d] p-5 transition-all duration-300 hover:border-[#BF980D]/50 hover:bg-[#15120f]"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#BF980D]/30 bg-[#BF980D]/10 text-[#BF980D]">
                                        <Icon size={20} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                                            {title}
                                        </p>
                                        <p className="mt-2 text-lg font-semibold text-white transition-colors group-hover:text-[#F3D77A]">
                                            {value}
                                        </p>
                                    </div>
                                </a>
                            ))}

                            <div className="rounded-[24px] border border-white/10 bg-[#120f0d] p-5">
                                <div className="mb-4 flex items-center gap-3 text-[#BF980D]">
                                    <Clock3 size={18} />
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em]">
                                        Opening hours
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {hours.map((item) => (
                                        <div key={item.day} className="flex items-center justify-between gap-4 border-t border-white/10 pt-3 text-sm text-zinc-300 first:border-t-0 first:pt-0">
                                            <span>{item.day}</span>
                                            <span className="font-medium text-white">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[30px] border border-[#BF980D]/20 bg-[#120f0d] p-5 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:p-7">
                            <div className="mb-6 flex items-center gap-3 text-[#BF980D]">
                                <Send size={18} />
                                <span className="text-xs font-semibold uppercase tracking-[0.28em]">
                                    Enquire now
                                </span>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <label className="block">
                                        <span className="mb-2 flex items-center gap-1 text-sm text-zinc-300">
                                            First name
                                            <span className="text-[#f7b5a8]" aria-label="required">*</span>
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(event) => handleFieldChange("firstName", event.target.value)}
                                            placeholder="John"
                                            aria-invalid={Boolean(errors.firstName)}
                                            className="w-full rounded-2xl border border-white/10 bg-[#0f0d0a] px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#BF980D] focus:outline-none"
                                        />
                                        {errors.firstName ? (
                                            <span className="mt-2 block text-sm text-[#f7b5a8]">{errors.firstName}</span>
                                        ) : null}
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 flex items-center gap-1 text-sm text-zinc-300">
                                            Last name
                                            <span className="text-[#f7b5a8]" aria-label="required">*</span>
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(event) => handleFieldChange("lastName", event.target.value)}
                                            placeholder="Smith"
                                            aria-invalid={Boolean(errors.lastName)}
                                            className="w-full rounded-2xl border border-white/10 bg-[#0f0d0a] px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#BF980D] focus:outline-none"
                                        />
                                        {errors.lastName ? (
                                            <span className="mt-2 block text-sm text-[#f7b5a8]">{errors.lastName}</span>
                                        ) : null}
                                    </label>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <label className="block">
                                        <span className="mb-2 flex items-center gap-1 text-sm text-zinc-300">
                                            Email
                                            <span className="text-[#f7b5a8]" aria-label="required">*</span>
                                        </span>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(event) => handleFieldChange("email", event.target.value)}
                                            placeholder="john@email.com"
                                            aria-invalid={Boolean(errors.email)}
                                            className="w-full rounded-2xl border border-white/10 bg-[#0f0d0a] px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#BF980D] focus:outline-none"
                                        />
                                        {errors.email ? (
                                            <span className="mt-2 block text-sm text-[#f7b5a8]">{errors.email}</span>
                                        ) : null}
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 flex items-center gap-1 text-sm text-zinc-300">
                                            Phone
                                            <span className="text-[#f7b5a8]" aria-label="required">*</span>
                                        </span>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(event) => handleFieldChange("phone", event.target.value)}
                                            placeholder="(555) 123-4567"
                                            aria-invalid={Boolean(errors.phone)}
                                            className="w-full rounded-2xl border border-white/10 bg-[#0f0d0a] px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#BF980D] focus:outline-none"
                                        />
                                        {errors.phone ? (
                                            <span className="mt-2 block text-sm text-[#f7b5a8]">{errors.phone}</span>
                                        ) : null}
                                    </label>
                                </div>

                                <label className="block">
                                    <span className="mb-2 block text-sm text-zinc-300">Looking for</span>
                                    <input
                                        type="text"
                                        value={formData.lookingFor}
                                        onChange={(event) => handleFieldChange("lookingFor", event.target.value)}
                                        placeholder="Luxury SUV, sedan, electric vehicle..."
                                        className="w-full rounded-2xl border border-white/10 bg-[#0f0d0a] px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#BF980D] focus:outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 flex items-center gap-1 text-sm text-zinc-300">
                                        Message
                                        <span className="text-[#f7b5a8]" aria-label="required">*</span>
                                    </span>
                                    <textarea
                                        rows={5}
                                        required
                                        value={formData.message}
                                        onChange={(event) => handleFieldChange("message", event.target.value)}
                                        placeholder="Tell us about your ideal vehicle, budget, and timeline..."
                                        aria-invalid={Boolean(errors.message)}
                                        className="w-full resize-none rounded-2xl border border-white/10 bg-[#0f0d0a] px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#BF980D] focus:outline-none"
                                    />
                                    {errors.message ? (
                                        <span className="mt-2 block text-sm text-[#f7b5a8]">{errors.message}</span>
                                    ) : null}
                                </label>

                                <label className="flex items-center gap-3 text-sm text-zinc-300">
                                    <input
                                        type="checkbox"
                                        required
                                        checked={acceptedPrivacy}
                                        onChange={(event) => {
                                            setAcceptedPrivacy(event.target.checked);
                                            if (event.target.checked) {
                                                setPrivacyError("");
                                                setErrors((current) => ({ ...current, privacy: "" }));
                                            }
                                        }}
                                        className="h-4 w-4 rounded border-white/20 bg-[#0f0d0a] text-[#BF980D] focus:ring-[#BF980D]"
                                    />
                                    <span>
                                        I agree to the{" "}
                                        <button
                                            type="button"
                                            onClick={() => setActiveModal("privacy")}
                                            className="font-medium text-[#BF980D] transition-colors hover:text-[#F3D77A]"
                                        >
                                            Privacy Policy
                                        </button>{" "}
                                        and consent to being contacted about my vehicle enquiry.
                                    </span>
                                </label>

                                {errors.privacy || privacyError ? (
                                    <p className="text-sm text-[#f7b5a8]">{errors.privacy || privacyError}</p>
                                ) : null}

                                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm text-zinc-400">
                                        We usually respond within 1 business day.
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={!acceptedPrivacy}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#BF980D] px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#d4ad20] disabled:cursor-not-allowed disabled:bg-[#4f441a] disabled:text-[#d1d1d1]"
                                    >
                                        Send inquiry
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                <section className="relative overflow-hidden bg-black border-t border-[#BF980D]/30 backdrop-blur-2xl backdrop-[#BF980D]/10 py-14 text-center">
                    {/* Background glow */}
                    <div className="absolute left-1/2 top-1/2 h-[450px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#BF980D]/10 blur-[130px]" />

                    <div className="relative mx-auto max-w-4xl px-5 sm:px-6">
                        <div className="mb-5 flex items-center justify-center gap-3">
                            <span className="h-px w-10 bg-[#BF980D]" />
                            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#BF980D]">
                                Visit the Collections
                            </span>
                            <span className="h-px w-10 bg-[#BF980D]" />
                        </div>

                        <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Book your{" "}
                            <span className="block text-[#BF980D]">
                                Next Journey
                            </span>
                        </h2>

                        <p className="mt-5 text-sm leading-7 text-[var(--muted)] sm:text-base">
                            Explore our inventory, compare models side by side, and speak with an expert about the right fit for your next move.
                        </p>

                        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link
                                href="/showroom"
                                className="inline-flex items-center justify-center rounded-full bg-[#BF980D] px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#d4ad20] hover:shadow-[0_0_30px_rgba(191,152,13,0.25)]"
                            >
                                Visit Showroom
                            </Link>

                            <Link
                                href="/sell-trade"
                                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#BF980D]/50 hover:bg-white/10"
                            >
                                Sell / Trade Car
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {activeModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-[28px] border border-[#BF980D]/20 bg-[#120f0d] shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                            <h3 className="text-xl font-bold text-white">{privacyCopy.title}</h3>
                            <button
                                type="button"
                                aria-label="Close privacy policy"
                                onClick={() => setActiveModal(null)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-all hover:border-[#BF980D] hover:text-[#F3D77A]"
                            >
                                ×
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 text-sm leading-7 text-zinc-300 sm:px-6">
                            {privacyCopy.body.map((paragraph) => (
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

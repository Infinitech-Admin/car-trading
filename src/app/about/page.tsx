"use client";

import Link from "next/link";
import {
    ArrowRight,
    Award,
    BadgeCheck,
    CarFront,
    ShieldCheck,
    Sparkles,
    Users,
} from "lucide-react";

import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import CTA from "../../components/home/cta";

const stats = [
    { value: "12+", label: "Years of expertise" },
    { value: "1,200+", label: "Vehicles sold" },
    { value: "4.9/5", label: "Average client rating" },
    { value: "98%", label: "Repeat & referral buyers" },
];

const values = [
    {
        icon: ShieldCheck,
        title: "Honest guidance",
        description:
            "We believe the right purchase starts with transparency, clear information, and no pressure. Every recommendation is grounded in your needs, not just the inventory in front of us.",
    },
    {
        icon: BadgeCheck,
        title: "Quality first",
        description:
            "Every car we present is carefully inspected so you can move forward with confidence, whether you're buying your first car or upgrading for the next chapter.",
    },
    {
        icon: Users,
        title: "Client-focused service",
        description:
            "From showroom visits to financing conversations, our team works with patience and precision to make the process feel simple and personal.",
    },
    {
        icon: Sparkles,
        title: "Premium experience",
        description:
            "We combine standout vehicles with thoughtful service, creating a buying experience that feels polished, relaxed, and genuinely professional.",
    },
];

export default function About() {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#191610] text-white">
                <section className="relative overflow-hidden border-b border-[#BF980D]/20 bg-[#0d0b09]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(191,152,13,0.18),transparent_50%)]" />

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pt-24">
                        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                            <div>
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="h-px w-10 bg-[#BF980D]" />
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#BF980D]">
                                        Our story
                                    </span>
                                </div>

                                <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                                    Premium cars,
                                    <span className="block text-[#BF980D]">personality, and trust.</span>
                                </h1>

                                <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
                                    AutoTrade was built for drivers who want more than a transaction.
                                    We bring together exceptional vehicles, honest advice, and a smoother path to ownership.
                                </p>
                            </div>

                            <div className="rounded-[30px] border border-white/10 bg-[#120f0d] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-7">
                                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                                            AutoTrade
                                        </p>
                                        <h2 className="mt-2 text-2xl font-black text-white">Driven by standards</h2>
                                    </div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#BF980D]/15 text-[#BF980D]">
                                        <CarFront size={22} />
                                    </div>
                                </div>

                                <div className="mt-6 space-y-5 text-lg leading-7 text-zinc-300">
                                    <p>
                                        We started with a simple belief: car buying should feel clear, confident, and personal.
                                        That means no rushed decisions, no confusing pricing, and no guesswork when it comes to quality.
                                    </p>
                                    <p>
                                        Today, we help drivers discover the right vehicle for their lifestyle, budget, and ambitions with a process that feels smooth from first enquiry to final handover.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-[24px] border border-white/10 bg-[#120f0d] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                                >
                                    <div className="text-3xl font-black text-[#BF980D] sm:text-4xl">{stat.value}</div>
                                    <p className="mt-3 text-md text-zinc-300">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 lg:items-center">
                        <div className="rounded-[30px] border border-[#BF980D]/20 bg-[#120f0d] p-6 sm:p-8">
                            <div className="mb-6 flex items-center gap-3 text-[#BF980D]">
                                <Award size={20} />
                                <span className="text-xs font-semibold uppercase tracking-[0.28em]">
                                    Our promise
                                </span>
                            </div>

                            <h3 className="text-3xl font-black tracking-tight text-white">
                                Thoughtful service at every step.
                            </h3>

                            <ul className="mt-6 space-y-4 text-sm leading-7 text-zinc-300">
                                {[
                                    "Curated inventory selected for quality, appearance, and value.",
                                    "Friendly professionals who listen first and guide clearly.",
                                    "Simple, upfront communication from first enquiry to delivery.",
                                ].map((item) => (
                                    <li key={item} className="flex gap-3">
                                        <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#BF980D]/15 text-[#BF980D]">
                                            <BadgeCheck size={12} />
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(191,152,13,0.18),transparent_45%)] p-6 sm:p-8">
                            <div className="relative">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#BF980D]">
                                    The AutoTrade difference
                                </p>
                                <h3 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                                    We make buying feel confident, not complicated.
                                </h3>
                                <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
                                    Whether you're shopping for a first luxury car, a practical family SUV, or a performance-backed weekend drive, we help you find something that fits your life beautifully.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mb-5 flex items-center justify-center gap-3">
                                <span className="h-px w-10 bg-[#BF980D]" />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#BF980D]">
                                    Why drivers choose us
                                </span>
                                <span className="h-px w-10 bg-[#BF980D]" />
                            </div>

                            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                                A car buying experience built around you.
                            </h2>
                        </div>

                        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            {values.map((value) => {
                                const Icon = value.icon;

                                return (
                                    <div
                                        key={value.title}
                                        className="group rounded-[26px] border border-white/10 bg-[#120f0d] p-6 transition-all duration-300 hover:border-[#BF980D]/50 hover:bg-[#15120f] hover:shadow-[0_15px_50px_rgba(0,0,0,0.25)]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#BF980D]/30 bg-[#BF980D]/10 text-[#BF980D] transition-all duration-300 group-hover:border-[#BF980D]/60 group-hover:bg-[#BF980D]/20">
                                                <Icon size={22} />
                                            </div>

                                            <h3 className="text-md font-bold leading-tight text-white sm:text-xl">
                                                {value.title}
                                            </h3>
                                        </div>

                                        <p className="mt-5 text-md leading-7 text-zinc-400">
                                            {value.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <CTA />
            </main>
            <Footer />
        </>
    );
}

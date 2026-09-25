"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useCart } from "@/context/cart-context";

const getPriceValue = (price: string) => Number(price.replace(/[₱,]/g, ""));

const formatPrice = (value: number) =>
  `₱${value.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
};

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
};

const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-[#BF980D]";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + getPriceValue(item.price) * item.quantity,
        0,
      ),
    [items],
  );
  const reservationFee = items.length > 0 ? 5000 : 0;
  const total = subtotal + reservationFee;

  const handleChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!form.address.trim())
      nextErrors.address = "Delivery / pickup address is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0 || !validate()) return;

    setIsSubmitting(true);

    // Simulated submission — replace with a real API call when a backend is wired up.
    window.setTimeout(() => {
      const generatedOrderNumber = `AT-${Date.now().toString().slice(-8)}`;
      setOrderNumber(generatedOrderNumber);
      setIsSubmitting(false);
      setIsSubmitted(true);
      clearCart();
    }, 900);
  };

  if (isSubmitted) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#191610] px-4 text-white">
          <div className="w-full max-w-lg rounded-[28px] border border-[#BF980D]/30 bg-[#120f0d] px-6 py-12 text-center shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#BF980D]/40 bg-[#BF980D]/10">
              <CheckCircle2 className="text-[#BF980D]" size={30} />
            </div>

            <h1 className="mt-6 text-3xl font-black tracking-tight text-white">
              Reservation confirmed
            </h1>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Thank you! Your order{" "}
              <span className="font-semibold text-[#F3D77A]">
                {orderNumber}
              </span>{" "}
              has been received. A sales advisor will reach out shortly to
              confirm details and next steps.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/showroom"
                className="inline-flex items-center justify-center rounded-full bg-[#BF980D] px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#d4ad20]"
              >
                Continue browsing
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-[#BF980D]/60 hover:bg-white/10"
              >
                Back to home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#191610] px-4 text-white">
          <div className="w-full max-w-md rounded-[28px] border border-dashed border-white/15 bg-[#120f0d] px-6 py-14 text-center">
            <p className="text-xl font-semibold text-white">
              Your cart is empty
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Add a vehicle to your cart before proceeding to checkout.
            </p>
            <Link
              href="/showroom"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#BF980D] px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#d4ad20]"
            >
              Browse showroom
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#191610] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#BF980D] transition-colors hover:text-[#dbc15b]"
          >
            <ArrowLeft size={16} />
            Back to cart
          </Link>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#BF980D]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#BF980D]">
              Reservation Details
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Checkout
          </h1>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-[28px] border border-white/10 bg-[#120f0d] p-6 sm:p-8"
            >
              <h2 className="text-lg font-bold text-white">
                Contact information
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400"
                  >
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    placeholder="Juan Dela Cruz"
                    className={inputClasses}
                    aria-invalid={Boolean(errors.fullName)}
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="you@email.com"
                    className={inputClasses}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400"
                  >
                    Phone number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="09XX XXX XXXX"
                    className={inputClasses}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400"
                  >
                    Delivery / pickup address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange("address")}
                    placeholder="Street, City, Province"
                    className={inputClasses}
                    aria-invalid={Boolean(errors.address)}
                  />
                  {errors.address && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400"
                  >
                    Additional notes{" "}
                    <span className="text-zinc-600">(optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    value={form.notes}
                    onChange={handleChange("notes")}
                    placeholder="Preferred schedule, financing questions, trade-in details..."
                    rows={3}
                    className={`${inputClasses} resize-none`}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-zinc-400">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-[#BF980D]"
                />
                This is a reservation request, not a final sale. A sales advisor
                will confirm pricing, availability, and financing details before
                any payment is processed.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#BF980D] px-5 py-3.5 text-sm font-bold text-black transition-all hover:bg-[#d8b53c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Submitting..."
                  : `Confirm reservation • ${formatPrice(total)}`}
              </button>
            </form>

            {/* Order summary */}
            <div className="rounded-[28px] border border-[#BF980D]/20 bg-[#120f0d] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-white">Your order</h2>

              <div className="mt-5 space-y-4 border-b border-white/10 pb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-[#0d0d0d]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#BF980D]">
                      {formatPrice(getPriceValue(item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-b border-white/10 pb-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-semibold text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Reservation fee</span>
                  <span className="font-semibold text-white">
                    {formatPrice(reservationFee)}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-base font-semibold text-white">
                  Total due today
                </span>
                <span className="text-2xl font-black text-[#BF980D]">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

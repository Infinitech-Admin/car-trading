"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useMemo } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useCart } from "@/context/cart-context";

const getPriceValue = (price: string) => Number(price.replace(/[₱,]/g, ""));

const formatPrice = (value: number) =>
  `₱${value.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems } =
    useCart();

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#191610] text-white">
        <section className="border-b border-[#BF980D]/20 bg-[#0d0b09]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <Link
              href="/showroom"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#BF980D] transition-colors hover:text-[#dbc15b]"
            >
              <ArrowLeft size={16} />
              Continue browsing
            </Link>

            <div className="mt-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#BF980D]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#BF980D]">
                Your Selection
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Your Cart
            </h1>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              {totalItems > 0
                ? `${totalItems} vehicle${totalItems === 1 ? "" : "s"} reserved for review`
                : "No vehicles added yet"}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/15 bg-[#120f0d] px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#BF980D]/30 bg-[#BF980D]/10">
                <ShoppingBag className="text-[#BF980D]" size={26} />
              </div>
              <p className="mt-6 text-xl font-semibold text-white">
                Your cart is empty
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Browse the showroom and add a vehicle to get started.
              </p>
              <Link
                href="/showroom"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#BF980D] px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#d4ad20]"
              >
                Browse showroom
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
              {/* Cart items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-[26px] border border-white/10 bg-[#12110f] p-4 sm:flex-row sm:items-center sm:p-5"
                  >
                    <Link
                      href={`/showroom/car/${item.id}`}
                      className="relative h-32 w-full shrink-0 overflow-hidden rounded-2xl bg-[#0d0d0d] sm:h-24 sm:w-36"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="144px"
                        className="object-contain p-2"
                      />
                    </Link>

                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                        {item.year} • {item.type}
                      </p>
                      <Link
                        href={`/showroom/car/${item.id}`}
                        className="mt-1 block text-xl font-semibold text-white transition-colors hover:text-[#F3D77A]"
                      >
                        {item.name}
                      </Link>
                      <span className="mt-1 block text-base font-black text-[#BF980D]">
                        {item.price}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 p-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-[#BF980D]/10 hover:text-[#F3D77A]"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-[#BF980D]/10 hover:text-[#F3D77A]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition-colors hover:text-red-400"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-zinc-500 transition-colors hover:text-red-400"
                >
                  Clear entire cart
                </button>
              </div>

              {/* Summary */}
              <div className="rounded-[28px] border border-[#BF980D]/20 bg-[#120f0d] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] lg:sticky lg:top-24">
                <h2 className="text-lg font-bold text-white">Order summary</h2>

                <div className="mt-5 space-y-3 border-b border-white/10 pb-5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">
                      Subtotal ({totalItems} item{totalItems === 1 ? "" : "s"})
                    </span>
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
                    Estimated total
                  </span>
                  <span className="text-2xl font-black text-[#BF980D]">
                    {formatPrice(total)}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-zinc-500">
                  Final pricing is confirmed with a sales advisor. The
                  reservation fee secures your vehicle pending inspection and
                  paperwork.
                </p>

                <Link
                  href="/checkout"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#BF980D] px-5 py-3.5 text-sm font-bold text-black transition-all hover:bg-[#d8b53c]"
                >
                  Proceed to checkout
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/showroom"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#BF980D] hover:bg-[#BF980D]/10"
                >
                  Continue browsing
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

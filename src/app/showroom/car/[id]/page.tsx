"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Gauge,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
  Star,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useCart } from "@/context/cart-context";
import {
  MEDIA_BASE_URL,
  fetchVehicle,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type Vehicle,
} from "@/lib/api";

type Slide = {
  type: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
  length?: "short" | "long";
  duration?: string;
  /** The vehicle's main/cover photo (shown "contained" instead of cropped). */
  isCover?: boolean;
};

/** Ilagay ang logo.png sa /public/logo.png */
const LOGO_SRC = "/logo.png";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF980D]";

function CarGallery({ carName, slides }: { carName: string; slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const pointerStartX = useRef<number | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const last = slides.length - 1;
  const safeIndex = Math.min(index, last);
  const activeSlide = slides[safeIndex];

  const goNext = () =>
    setIndex((current) => (current >= last ? 0 : current + 1));
  const goPrevious = () =>
    setIndex((current) => (current <= 0 ? last : current - 1));

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
    }
    if (event.key === "Home") {
      event.preventDefault();
      setIndex(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      setIndex(last);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
    setIsDragging(true);
    setDragX(0);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null || !isDragging) return;
    setDragX(event.clientX - pointerStartX.current);
  };

  const finishPointerGesture = (event?: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;

    const delta =
      event && typeof event.clientX === "number"
        ? event.clientX - pointerStartX.current
        : dragX;
    const threshold = 60;

    if (Math.abs(delta) >= threshold) {
      if (delta < 0) goNext();
      else goPrevious();
    }

    pointerStartX.current = null;
    setDragX(0);
    setIsDragging(false);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) =>
    finishPointerGesture(event);

  const handlePointerCancel = () => {
    pointerStartX.current = null;
    setDragX(0);
    setIsDragging(false);
  };

  const togglePlayback = () => {
    const video = videoRefs.current[safeIndex];
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const activeThumb = thumbRefs.current[safeIndex];
    if (activeThumb)
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });

    slides.forEach((slide, i) => {
      const video = videoRefs.current[i];
      if (!video || slide.type !== "video") return;

      if (i !== safeIndex) {
        video.pause();
        video.currentTime = 0;
        return;
      }

      if (slide.length === "short") {
        video.play().catch(() => {});
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex]);

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0f0d0a] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-5 lg:p-6">
      {/* Media */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${carName} photos and videos`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`relative overflow-hidden rounded-[22px] bg-[#111111] ${focusRing}`}
      >
        {/* Sliding area */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className={`touch-pan-y select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          <div
            className="flex will-change-transform"
            style={{
              transform: `translate3d(calc(${-safeIndex * 100}% + ${dragX}px), 0, 0)`,
              transition: isDragging
                ? "none"
                : "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {slides.map((slide, i) => (
              <div
                key={`${i}-${slide.src}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slides.length}`}
                aria-hidden={i !== safeIndex}
                className="relative h-[300px] w-full shrink-0 sm:h-[420px] md:h-[480px] lg:h-[560px]"
              >
                {slide.isCover && (
                  <div className="absolute inset-x-8 bottom-5 h-10 rounded-full bg-[#BF980D]/20 blur-3xl sm:inset-x-16" />
                )}

                {slide.type === "image" ? (
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={i === 0}
                    unoptimized
                    sizes="(min-width: 1024px) 60vw, (min-width: 640px) 90vw, 100vw"
                    draggable={false}
                    className={`relative z-10 ${slide.isCover ? "object-contain p-4 sm:p-6" : "object-cover"}`}
                  />
                ) : (
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={slide.src}
                    poster={slide.poster}
                    muted
                    loop={slide.length === "short"}
                    playsInline
                    controls={slide.length === "long"}
                    preload="metadata"
                    className="relative z-10 h-full w-full object-cover"
                  />
                )}

                {slide.type === "video" && slide.duration && (
                  <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-md">
                    {slide.length === "long" ? "Full walkthrough" : "Clip"} ·{" "}
                    {slide.duration}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <>
            {/* PREVIOUS BUTTON */}
            <button
              type="button"
              onClick={goPrevious}
              aria-label="Previous item"
              className={`absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-xl transition-all duration-300 hover:border-[#BF980D] hover:bg-[#BF980D] hover:text-black active:scale-95 sm:left-4 sm:h-11 sm:w-11 ${focusRing}`}
            >
              <ArrowLeft size={18} />
            </button>

            {/* NEXT BUTTON */}
            <button
              type="button"
              onClick={goNext}
              aria-label="Next item"
              className={`absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-xl transition-all duration-300 hover:border-[#BF980D] hover:bg-[#BF980D] hover:text-black active:scale-95 sm:right-4 sm:h-11 sm:w-11 ${focusRing}`}
            >
              <ArrowRight size={18} />
            </button>
          </>
        )}

        {/* PLAY/PAUSE (long video only — short clips autoplay/loop silently) */}
        {activeSlide.type === "video" && activeSlide.length === "long" && (
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className={`absolute bottom-3 left-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-xl transition-all duration-300 hover:border-[#BF980D] hover:bg-[#BF980D] hover:text-black active:scale-95 sm:bottom-4 sm:left-4 ${focusRing}`}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        )}

        {/* COUNTER */}
        <div className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md sm:bottom-4 sm:right-4">
          {safeIndex + 1} / {slides.length}
        </div>

        {/* Swipe hint */}
        {safeIndex === 0 && slides.length > 1 && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-zinc-300 backdrop-blur-md sm:block">
            Swipe to explore
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {slides.length > 1 && (
        <div
          ref={stripRef}
          className="relative mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-4 sm:gap-3"
        >
          {slides.map((slide, i) => {
            const isActive = i === safeIndex;
            const hasPoster = slide.type === "video" && !!slide.poster;

            return (
              <button
                key={`${i}-${slide.src}`}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show item ${i + 1}`}
                aria-current={isActive}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border bg-[#111111] transition-all duration-300 sm:h-20 sm:w-28 ${isActive ? "border-[#BF980D] opacity-100 ring-1 ring-[#BF980D]/30" : "border-white/10 opacity-50 hover:border-white/20 hover:opacity-100"} ${focusRing}`}
              >
                {slide.type === "image" && (
                  <Image
                    src={slide.src}
                    alt=""
                    fill
                    unoptimized
                    sizes="112px"
                    className={
                      slide.isCover ? "object-contain p-1" : "object-cover"
                    }
                  />
                )}

                {slide.type === "video" && (
                  <>
                    {/* Logo fallback (kita kung walang poster / hindi pa loaded ang video frame) */}
                    <Image
                      src={LOGO_SRC}
                      alt=""
                      fill
                      unoptimized
                      sizes="112px"
                      className="object-contain p-3 opacity-70"
                    />

                    {/* Poster kung meron, kung wala, first frame ng video */}
                    {hasPoster ? (
                      <Image
                        src={slide.poster!}
                        alt=""
                        fill
                        unoptimized
                        sizes="112px"
                        className="object-cover"
                      />
                    ) : (
                      <video
                        src={`${slide.src}#t=0.5`}
                        muted
                        playsInline
                        preload="metadata"
                        tabIndex={-1}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                      />
                    )}

                    <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
                      <Play size={16} className="fill-white text-white" />
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CarDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [car, setCar] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setLoadError("Vehicle ID is missing.");
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setLoadError(null);

    fetchVehicle(id, { signal: controller.signal })
      .then(({ data }) => {
        setCar(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (isAbortError(err)) return;
        const apiErr = err as ApiError;
        setCar(null);
        setLoadError(
          apiErr.status === 404
            ? "The vehicle you’re looking for may have been sold or moved. Explore our current inventory and we’ll help you find a great alternative."
            : apiErr.message ||
                "We couldn’t load this vehicle details page right now. Please try again or browse the showroom.",
        );
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [id, reloadKey]);

  const carImage = car ? resolveMediaUrl(car.image, MEDIA_BASE_URL) : "";

  // Cover image first, then everything uploaded to the gallery.
  const slides = useMemo<Slide[]>(() => {
    if (!car) return [];

    const gallery: Slide[] = (car.galleryMedia ?? []).map((m) => ({
      type: m.type,
      src: resolveMediaUrl(m.src, MEDIA_BASE_URL),
      poster: m.poster ? resolveMediaUrl(m.poster, MEDIA_BASE_URL) : undefined,
      alt: m.alt || `${car.name} ${m.type}`,
      length: m.length ?? undefined,
      duration: m.duration ?? undefined,
    }));

    return carImage
      ? [
          {
            type: "image",
            src: carImage,
            alt: `${car.name} main view`,
            isCover: true,
          },
          ...gallery,
        ]
      : gallery;
  }, [car, carImage]);

  const unavailable = !car || car.status !== "available" || car.stock <= 0;

  const handleAddToCart = () => {
    if (!car || unavailable) return;

    addToCart({
      id: car.id,
      name: car.name,
      price: car.price,
      image: carImage,
      year: car.year,
      type: car.type,
      stock: car.stock,
    });

    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#191610] px-4 text-white">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#120f0d] px-6 py-12 text-center shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#BF980D]/30 bg-[#BF980D]/10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#BF980D]/40 border-t-[#BF980D]" />
            </div>
            <p className="mt-6 text-2xl font-bold text-white">
              Loading vehicle
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Preparing the latest details for you.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loadError || !car) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#191610] px-4 text-white">
          <div className="w-full max-w-lg rounded-[28px] border border-red-500/30 bg-[#160f0f] px-6 py-12 text-center shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#BF980D]">
              Vehicle unavailable
            </p>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white">
              We couldn’t find this car
            </h1>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              {loadError ||
                "The vehicle you’re looking for may have been sold or moved. Explore our current inventory and we’ll help you find a great alternative."}
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/showroom"
                className="inline-flex items-center justify-center rounded-full bg-[#BF980D] px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#d4ad20]"
              >
                Browse showroom
              </Link>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-[#BF980D]/60 hover:bg-white/10"
              >
                <RotateCcw size={16} />
                Retry
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const statusLabel =
    car.status === "sold"
      ? "Sold"
      : car.status === "reserved"
        ? "Reserved"
        : car.stock <= 0
          ? "Out of stock"
          : "Not available";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#191610] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* Back */}
          <Link
            href="/showroom"
            className={`inline-flex items-center gap-2 text-sm font-medium text-[#BF980D] transition-colors hover:text-[#dbc15b] ${focusRing}`}
          >
            <ArrowLeft size={16} />
            Back to showroom
          </Link>

          {/* Vehicle Area */}
          <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8 lg:items-start">
            {/* Gallery */}
            {slides.length > 0 ? (
              <CarGallery key={car.id} carName={car.name} slides={slides} />
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-[28px] border border-white/10 bg-[#0f0d0a] text-sm text-zinc-500 sm:h-[420px] lg:h-[560px]">
                No photos available yet
              </div>
            )}

            {/* Vehicle Info */}
            <aside className="rounded-[28px] border border-[#BF980D]/20 bg-[#120f0d] p-5 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:p-6 lg:sticky lg:top-24">
              {/* Badge */}
              <div className="mb-4 flex items-center justify-between gap-3">
                {car.badge ? (
                  <span className="rounded-full border border-[#BF980D]/40 bg-[#BF980D]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F3D77A]">
                    {car.badge}
                  </span>
                ) : (
                  <span />
                )}

                <span className="flex items-center gap-1 text-xs text-[#F3D77A] sm:text-sm">
                  <Star size={14} fill="currentColor" />
                  Featured
                </span>
              </div>

              {/* Vehicle Type */}
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 sm:text-sm">
                {car.year} • {car.type}
              </p>

              {/* Name */}
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                {car.name}
              </h1>

              {/* Price */}
              <div className="mt-5 flex flex-wrap items-end gap-2 sm:mt-6 sm:gap-3">
                <span className="text-3xl font-black text-[#BF980D] sm:text-4xl">
                  {car.price}
                </span>
                <span className="pb-1 text-xs text-zinc-500 sm:text-sm">
                  Starting price
                </span>
              </div>

              {/* Specifications */}
              <div className="mt-6 space-y-3 border-y border-white/10 py-5 text-sm sm:mt-7 sm:py-6 sm:text-base">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">Mileage</span>
                  <span className="text-right font-semibold text-white">
                    {car.mileage}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">Engine</span>
                  <span className="text-right font-semibold text-white">
                    {car.engine}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">Power</span>
                  <span className="text-right font-semibold text-white">
                    {car.horsepower}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">Transmission</span>
                  <span className="text-right font-semibold text-white">
                    {car.transmission}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">Availability</span>
                  <span
                    className={`text-right font-semibold ${
                      unavailable ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {unavailable ? statusLabel : `${car.stock} in stock`}
                  </span>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                disabled={unavailable}
                onClick={handleAddToCart}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#BF980D] px-5 py-3.5 text-sm font-bold text-black transition-all hover:bg-[#d8b53c] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#BF980D] ${focusRing}`}
              >
                {unavailable
                  ? statusLabel
                  : justAdded
                    ? "Added to cart ✓"
                    : "Add to Cart"}
              </button>

              {/* CTA */}
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Link
                  href="/contact"
                  className={`inline-flex items-center justify-center rounded-full bg-[#BF980D] px-5 py-3.5 text-sm font-bold text-black transition-all hover:bg-[#d8b53c] ${focusRing}`}
                >
                  Book a test drive
                </Link>

                <Link
                  href="/showroom"
                  className={`inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#BF980D] hover:bg-[#BF980D]/10 ${focusRing}`}
                >
                  Browse more cars
                </Link>
              </div>
            </aside>
          </div>

          <section className="mt-8 rounded-[28px] border border-white/10 bg-[#100e0c] p-5 sm:mt-12 sm:p-8">
            <div className="mb-5 flex items-center gap-3 sm:mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#BF980D]/10">
                <Sparkles className="text-[#BF980D]" size={18} />
              </div>

              <h2 className="text-xl font-bold text-white">
                Vehicle highlights
              </h2>
            </div>

            {/* Description */}
            {car.description && (
              <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-zinc-300 sm:text-base">
                {car.description}
              </p>
            )}

            {/* Specs Grid */}
            <div className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Engine */}
              <div className="rounded-2xl border border-white/10 bg-[#171410] p-4 transition-colors hover:border-[#BF980D]/30">
                <Gauge className="text-[#BF980D]" size={18} />
                <p className="mt-3 text-sm text-zinc-500">Engine</p>
                <p className="mt-1 text-lg font-bold text-white">
                  {car.engine}
                </p>
              </div>

              {/* Transmission */}
              <div className="rounded-2xl border border-white/10 bg-[#171410] p-4 transition-colors hover:border-[#BF980D]/30">
                <Settings2 className="text-[#BF980D]" size={18} />
                <p className="mt-3 text-sm text-zinc-500">Transmission</p>
                <p className="mt-1 text-lg font-bold text-white">
                  {car.transmission}
                </p>
              </div>

              {/* Location */}
              <div className="rounded-2xl border border-white/10 bg-[#171410] p-4 transition-colors hover:border-[#BF980D]/30">
                <MapPin className="text-[#BF980D]" size={18} />
                <p className="mt-3 text-sm text-zinc-500">Location</p>
                <p className="mt-1 text-lg font-bold text-white">
                  {car.location}
                </p>
              </div>

              {/* Fuel */}
              <div className="rounded-2xl border border-white/10 bg-[#171410] p-4 transition-colors hover:border-[#BF980D]/30">
                <Sparkles className="text-[#BF980D]" size={18} />
                <p className="mt-3 text-sm text-zinc-500">Fuel</p>
                <p className="mt-1 text-lg font-bold text-white">{car.fuel}</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

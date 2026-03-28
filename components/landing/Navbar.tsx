"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06070A]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-30 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 md:px-8 xl:px-10">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          onClick={closeMenu}
        >
          <Image
            src="/logo-nexoru.png"
            alt="Nexoru"
            width={120}
            height={48}
            priority
            className="h-11 w-auto shrink-0 opacity-95 drop-shadow-[0_0_18px_rgba(124,58,237,0.35)] sm:h-11 md:h-12"
          />

          <span className="truncate text-[24px] font-semibold tracking-[0.14em] text-white sm:text-[28px] md:text-[32px] xl:text-[34px]">
            NEXORU
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <a
            href="#soluciones"
            className="text-sm text-white/80 transition hover:text-white"
          >
            Soluciones
          </a>
          <a
            href="#como-funciona"
            className="text-sm text-white/80 transition hover:text-white"
          >
            Cómo funciona
          </a>
          <a
            href="#casos"
            className="text-sm text-white/80 transition hover:text-white"
          >
            Casos de uso
          </a>
          <a
            href="#pricing"
            className="text-sm text-white/80 transition hover:text-white"
          >
            Pricing
          </a>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="https://app.nexoru.ai/onboarding/start"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#7C3AED]/30 bg-[#7C3AED] px-5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.35)] transition hover:bg-[#6D28D9]"
          >
            Diseñar mi sistema
          </Link>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 block h-[2px] w-5 rounded-full bg-white transition ${
                isOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-[2px] w-5 rounded-full bg-white transition ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] block h-[2px] w-5 rounded-full bg-white transition ${
                isOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 bg-[#06070A]/95 lg:hidden">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2 px-4 py-4 sm:px-6 md:px-8">
            <a
              href="#soluciones"
              onClick={closeMenu}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/5 hover:text-white"
            >
              Soluciones
            </a>
            <a
              href="#como-funciona"
              onClick={closeMenu}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/5 hover:text-white"
            >
              Cómo funciona
            </a>
            <a
              href="#casos"
              onClick={closeMenu}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/5 hover:text-white"
            >
              Casos de uso
            </a>
            <a
              href="#pricing"
              onClick={closeMenu}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/5 hover:text-white"
            >
              Pricing
            </a>

            <Link
              href="https://app.nexoru.ai/onboarding/start"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="mt-2 inline-flex h-12 items-center justify-center rounded-full border border-[#7C3AED]/30 bg-[#7C3AED] px-5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.35)] transition hover:bg-[#6D28D9]"
            >
              Diseñar mi sistema
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
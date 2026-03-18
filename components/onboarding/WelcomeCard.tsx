import Link from "next/link";

export default function WelcomeCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <span className="mb-4 inline-block rounded-full bg-[#E8EBF8] px-3 py-1 text-sm font-medium text-[#3A3D91]">
        Onboarding Nexoru
      </span>

      <h2 className="mb-4 text-3xl font-semibold text-[#2B2F36]">
        Diseña tu sistema Nexoru
      </h2>

      <p className="mb-6 max-w-2xl text-base leading-7 text-[#4A4F57]">
        En menos de 15 minutos definiremos la base operativa de tu negocio y te
        recomendaremos la mejor implementación.
      </p>

      <div className="mb-8 rounded-xl bg-[#F5F6F8] p-4 text-sm text-[#4A4F57]">
        Tiempo estimado: 15 minutos
      </div>

      <Link
        href="/onboarding/business-profile"
        className="inline-block rounded-xl bg-[#2B2F36] px-6 py-3 text-white transition hover:bg-[#1f2329]"
      >
        Comenzar
      </Link>
    </div>
  );
}
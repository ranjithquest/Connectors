'use client';
import { Persona, PersonaSize } from '@fluentui/react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)] px-10 py-12">
      <div className="max-w-3xl w-full">
        <h1 className="text-[40px] font-bold text-[#111] mb-4 leading-tight">
          Boilerplate
        </h1>
        <p className="text-[16px] text-[#323130] leading-relaxed mb-5 max-w-xl">
          This template was created just for you to quickly prototype. Please connect with the{' '}
          <strong>Connectors Design team</strong> to add any pages on this.
        </p>
        <a href="/onboarding" className="inline-flex items-center gap-1.5 mb-5 text-[14px] text-[#0078d4] hover:underline font-medium">
          New here? View the onboarding guide →
        </a>
        <div className="mb-6 flex items-center gap-4">
          <span className="text-[13px] text-[#605e5c]">Contact:</span>
          <Persona
            text="Ranjith Ravi"
            size={PersonaSize.size32}
            hidePersonaDetails={false}
          />
          <Persona
            text="Rohan Baruah"
            size={PersonaSize.size32}
            hidePersonaDetails={false}
          />
        </div>
        <div className="rounded-2xl overflow-hidden border border-[#e1e1e1]">
          <img src="/fluent-banner.webp" alt="Fluent UI" className="w-full object-cover" />
        </div>
      </div>
    </div>
  );
}

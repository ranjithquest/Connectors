'use client';

import { useState, useRef } from 'react';
import { PrimaryButton, DefaultButton } from '@fluentui/react';
import { ChromeCloseIcon } from '@fluentui/react-icons-mdl2';
import type { ConnectorCatalogItem } from '@/lib/gallery-data';

// ─── Detail data types ────────────────────────────────────────────────────────

export type ConnectorDetail = {
  overview: string | string[];
  features: string[];
  learnLinks: { label: string; url: string }[];
  supportUrl: string;
  supportLabel?: string;
};

export const CONNECTOR_DETAILS: Record<string, ConnectorDetail> = {
  box: {
    overview: 'The Box Connector for Microsoft Graph allows Box and Microsoft customers to index Box data so it appears in Microsoft 365 experiences. By enabling this integration, Microsoft 365 users can discover Box content from Microsoft Search, Microsoft 365 app, or Microsoft Copilot.',
    features: [
      'Ability to search Box data across Microsoft 365 intelligent experiences (Microsoft 365 App, Bing at Work, SharePoint).',
      'Leverage Microsoft Copilot with Box content to save time on actions such as: quickly synthesizing and summarizing Box documents to draw insights from collaborators, asking questions of Box content to derive major milestones on an existing project, and getting up to speed more quickly on conversations and learnings.',
      'Access Microsoft Copilot capabilities with Box content across Microsoft Teams, Microsoft365.com and copilot.microsoft.com.',
    ],
    learnLinks: [
      { label: 'Integrate with Microsoft 365 Copilot via the Box Copilot Connector', url: 'https://support.box.com/hc/en-us/articles/28306221323027-Integrate-with-Microsoft-365-Copilot-via-the-Box-Copilot-Connector' },
      { label: 'Box Copilot Connector FAQ', url: 'https://support.box.com/hc/en-us/articles/28236240406035-Box-Copilot-Connector-FAQ' },
    ],
    supportUrl: 'https://support.box.com/hc/en-us',
    supportLabel: 'Go to Box support',
  },
  'cb-insights': {
    overview: "The CB Insights Graph Connector for Microsoft 365 Copilot brings CB Insights' proprietary data and research into Microsoft Search, Copilot, and your Microsoft 365 applications. By providing trusted, global business data and insights within Copilot, you can supercharge your most important decisions. Track and compare companies. Follow technical markets as they emerge and mature. Stay up to date with your competitors' activities in the market",
    features: [
      "Ask Copilot your toughest questions - Markets, Companies, Sales Strategies. It's all possible",
      'Activate the CB Insight Market Intelligence declarative agent to ensure you are only pulling double-validated business info into your answers',
      'If you are a CB Insights Strategy Workstation user, you will have direct citations within Copilot and Microsoft Search which will allow you to dig even deeper into the markets and companies you care about',
      'Simple to turn your generated business insights into boardroom ready PowerPoint presentations, Word documents, and Excel spreadsheets',
    ],
    learnLinks: [
      { label: 'CB Insights Graph Connector overview', url: 'https://www.cbinsights.com/copilot-connector/' },
    ],
    supportUrl: 'https://support.cbinsights.com/hc/en-us',
    supportLabel: 'Go to CB Insights support',
  },
  'sp-global-ai-ready-data': {
    overview: [
      'The AI Ready Data dataset encompasses a comprehensive array of textual content across publications produced by in-house editorial and research teams, including market reports, news articles, rationales, commentaries, fundamentals analyses, outlooks, and more - all in an LLM-friendly format prepared for seamless integration with AI systems.',
      "Customers can effortlessly leverage AI Ready Data for their Retrieval-Augmented Generation (RAG) solutions, enhancing their analytical capabilities and driving informed decision-making. This dataset removes restrictions as you integrate your choice of large language models (LLMs), to uncover patterns, correlations, and insights across commodities. Our flexibility aids processing and understanding data to suit your organizations, and you can utilize the provided data embeddings or set your own as per your preference. Additionally, you can integrate with your own vector database and leverage various internal and external data sources to enrich the dataset.",
    ],
    features: [
      'Unstructured data in an AI-ready format broken down into documents and segments with LLM-friendly metadata',
      'Flexible data delivery',
      'Easy customization of your own search and relevancy-boosting algorithms',
      'Ease of discovery of relevant content for your end users',
    ],
    learnLinks: [
      { label: 'S&P Global Commodity Insights and Copilot Brochure', url: 'https://view.highspot.com/viewer/6ed7f21cec14d7276bd8b5c509b6cf92#1' },
      { label: 'Microsoft Connector for Copilot Activation Brief, AI Ready Data', url: 'https://view.highspot.com/viewer/c9bb5dde7c14c1d7d66621984a446977#1' },
    ],
    supportUrl: 'https://www.spglobal.com/en/enterprise/about/contact-us.html',
    supportLabel: 'Go to S&P Global AI Ready Data support',
  },
};

// ─── ISVPanel ─────────────────────────────────────────────────────────────────

interface ISVPanelProps {
  connector: ConnectorCatalogItem;
  onAdd: (name: string) => void;
  onClose: () => void;
}

export default function ISVPanel({ connector, onAdd, onClose }: ISVPanelProps) {
  const detail = CONNECTOR_DETAILS[connector.id];
  const [imgFailed, setImgFailed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);

  if (!detail) return null;

  function scrollToLearn() {
    if (scrollRef.current && learnRef.current) {
      scrollRef.current.scrollTo({ top: learnRef.current.offsetTop - 24, behavior: 'smooth' });
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-[48px] right-0 bottom-0 z-[70] flex flex-col overflow-hidden bg-white dark:bg-[#212121] shadow-2xl" style={{ width: '80%' }}>

        {/* Header */}
        <div className="px-8 pt-6 pb-0 flex-shrink-0">
          <div className="flex justify-end mb-4">
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d] transition-colors text-[#616161] dark:text-[#adadad] hover:text-[#242424] dark:hover:text-[#d6d6d6]">
              <ChromeCloseIcon style={{ fontSize: 12 }} />
            </button>
          </div>

          {/* Logo + name */}
          <div className="flex items-center gap-4 mb-5">
            {connector.logoUrl && !imgFailed ? (
              <div className="w-[72px] h-[72px] rounded-[8px] overflow-hidden flex items-center justify-center shrink-0 border border-[#e1e1e1] dark:border-[#3d3d3d]" style={{ backgroundColor: connector.logoBg ?? '#ffffff' }}>
                <img src={connector.logoUrl} alt={connector.name} className="w-full h-full object-contain" onError={() => setImgFailed(true)} />
              </div>
            ) : (
              <div className="w-[72px] h-[72px] rounded-[8px] flex items-center justify-center text-white text-[18px] font-semibold shrink-0" style={{ backgroundColor: connector.logoColor }}>
                {connector.logoInitials}
              </div>
            )}
            <div>
              <p className="text-[20px] font-semibold text-[#242424] dark:text-[#d6d6d6] leading-7">{connector.name}</p>
              <p className="text-[14px] text-[#616161] dark:text-[#adadad] mt-0.5">{connector.publisher}</p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex">
            <span className="mr-6 pb-2 text-[14px] font-semibold text-[#0078d4] border-b-2 border-[#0078d4]">Overview</span>
            <button
              onClick={scrollToLearn}
              className="mr-6 pb-2 text-[14px] text-[#424242] dark:text-[#adadad] hover:text-[#242424] dark:hover:text-[#d6d6d6] border-b-2 border-transparent transition-colors"
            >
              Learn
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-6 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>

          {/* Row 1: Overview + Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10">
            <div>
              <p className="text-[14px] font-semibold text-[#242424] dark:text-[#d6d6d6] mb-3">Overview</p>
              {Array.isArray(detail.overview)
                ? detail.overview.map((p, i) => <p key={i} className="text-[14px] leading-5 text-[#424242] dark:text-[#adadad] mb-3 last:mb-0">{p}</p>)
                : <p className="text-[14px] leading-5 text-[#424242] dark:text-[#adadad]">{detail.overview}</p>}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#242424] dark:text-[#d6d6d6] mb-3">Features</p>
              <ul className="flex flex-col gap-2">
                {detail.features.map((f, i) => (
                  <li key={i} className="flex gap-2 text-[14px] leading-5 text-[#424242] dark:text-[#adadad]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#424242] dark:bg-[#adadad] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider above Learn */}
          <div className="border-t border-[#e1e1e1] dark:border-[#3d3d3d] mb-10" />

          {/* Row 2: Learn + Support */}
          <div ref={learnRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <p className="text-[14px] font-semibold text-[#242424] dark:text-[#d6d6d6] mb-3">Learn</p>
              <div className="flex flex-col gap-2">
                {detail.learnLinks.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer"
                    className="text-[14px] text-[#0078d4] hover:text-[#106ebe] hover:underline">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#242424] dark:text-[#d6d6d6] mb-3">Support</p>
              <p className="text-[14px] text-[#424242] dark:text-[#adadad] mb-3">Have more questions?</p>
              <div>
                <DefaultButton href={detail.supportUrl} target="_blank" rel="noreferrer">{detail.supportLabel ?? 'Go to support'}</DefaultButton>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e1e1e1] dark:border-[#3d3d3d] px-8 py-3 flex items-center gap-4 flex-shrink-0 bg-white dark:bg-[#212121]">
          <PrimaryButton onClick={() => { onClose(); onAdd(connector.name); }}>Add</PrimaryButton>
          <p className="text-[12px] text-[#616161] dark:text-[#adadad] leading-4">
            By using this Copilot connector, you agree to the{' '}
            <a href="https://www.microsoft.com/licensing/terms" target="_blank" rel="noreferrer" className="text-[#0078d4] hover:underline">Terms of use</a>
            {'. '}You as data controller authorize Microsoft to create an index of third-party data in your Microsoft 365 tenant subject to your configurations.{' '}
            <a href="https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview" target="_blank" rel="noreferrer" className="text-[#0078d4] hover:underline">Learn more here</a>.
          </p>
        </div>
      </div>
    </>
  );
}

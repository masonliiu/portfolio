"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { PanelKey } from "./data";
import { panelContent } from "./data";

type PanelsProps = {
  activePanel: PanelKey | null;
  onClose: () => void;
  showPlaceholder?: boolean;
};

export default function Panels({
  activePanel,
  onClose,
  showPlaceholder = true,
}: PanelsProps) {
  const panel = activePanel ? panelContent[activePanel] : null;

  return (
    <div className="relative">
      {showPlaceholder && !panel ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
          Tap a hotspot in the room or choose one from the list to reveal the
          panel content.
        </div>
      ) : null}
      <AnimatePresence mode="wait">
        {panel ? (
          <motion.div
            key={panel.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="mt-4 rounded-2xl border border-white/10 bg-slate-900/90 p-6 text-slate-100 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Panel
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {panel.title}
                </h3>
              </div>
              <button
                className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-white/40"
                onClick={onClose}
                type="button"
              >
                Close
              </button>
            </div>
            <ul className="mt-6 space-y-4 text-sm text-slate-200">
              {panel.items.map((item) => (
                <li key={item.title} className="rounded-xl bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">
                    {item.href ? (
                      <a
                        className="underline decoration-white/40 underline-offset-4 hover:decoration-white"
                        href={item.href}
                      >
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-300">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

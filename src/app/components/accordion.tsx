"use client";

import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

export default function AccordionItem({ title, isOpen, onToggle, children }: AccordionItemProps) {
  return (
    <div className={`border ${isOpen ? 'border-[#3D9758]' : 'border-transparent'} mb-4 rounded-xl duration-300 overflow-hidden`}>
      <button
        onClick={onToggle}
        className="flex w-full justify-between items-center text-left bg-[#F4FAFA] p-4"
      >
        <span className="text-sm text-[#3D9758] font-medium">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden bg-white transition-all duration-300 ${
          isOpen ? "max-h-96 mt-3" : "max-h-0"
        }`}
      >
        <div className="text-[#39363D] text-sm font-light leading-relaxed p-4">{children}</div>
      </div>
    </div>
  );
}

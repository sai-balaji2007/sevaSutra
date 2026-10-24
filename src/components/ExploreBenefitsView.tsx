import React, { useState } from 'react';
import { BenefitCatalogItem, Language, NavPage } from '../types';
import { BENEFIT_CATALOG } from '../data/mockData';
import { StatusChip } from './StatusChip';
import { 
  Search, 
  Building2, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Filter,
  Sparkles
} from 'lucide-react';

interface ExploreBenefitsViewProps {
  language: Language;
  onNavigate: (page: NavPage) => void;
  onSpeak: (text: string) => void;
}

export const ExploreBenefitsView: React.FC<ExploreBenefitsViewProps> = ({
  language,
  onNavigate,
  onSpeak,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = BENEFIT_CATALOG.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.authority.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#D0D5DD] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#087F68] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Search className="w-6 h-6 text-[#A6F4C5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-[#111C2E] font-heading tracking-tight">
                Explore Civic Benefits & Entitlements
              </h2>
              <StatusChip variant="official" label="National Registry" source="NSAP" />
            </div>
            <p className="text-xs md:text-sm text-[#475467] mt-1 leading-relaxed">
              Transparent, plain-language directory of Indian central and state welfare pensions for older adults and persons with disabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#D0D5DD] shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by scheme name, authority, or disability..."
            className="w-full bg-white border border-[#D0D5DD] rounded-lg pl-9 pr-4 py-2 text-xs text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs font-semibold">
          {['ALL', 'Elderly', 'Disability', 'Widow', 'Social Security'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#111C2E] text-white'
                  : 'bg-[#F2F4F7] text-[#475467] hover:text-[#111C2E]'
              }`}
            >
              {cat === 'ALL' ? 'All Schemes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#D0D5DD] p-6 shadow-xs flex flex-col justify-between hover:border-[#087F68]/40 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <StatusChip variant="official" label={item.category} />
                <span className="text-xs font-bold text-[#087F68] font-mono-code bg-[#E7F4EF] px-2 py-0.5 rounded-sm">
                  {item.monthlyBenefit}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#111C2E] font-heading mt-1">
                {item.name}
              </h3>
              <p className="text-xs text-[#475467] mt-0.5">
                Administered by: {item.authority}
              </p>

              {/* Eligibility bullet list */}
              <div className="mt-4 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#475467]">
                  Key Eligibility Criteria:
                </div>
                {item.eligibility.map((crit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#344054]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#087F68] shrink-0" />
                    <span>{crit}</span>
                  </div>
                ))}
              </div>

              {/* Documents Required */}
              <div className="mt-4 pt-3 border-t border-[#F2F4F7]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#475467] mb-1.5">
                  Required Verification Documents:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.keyDocuments.map((doc, dIdx) => (
                    <span
                      key={dIdx}
                      className="text-[10px] bg-[#F8F9FA] border border-[#D0D5DD] text-[#344054] px-2 py-0.5 rounded-sm font-medium"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F2F4F7] flex items-center justify-between text-xs">
              <span className="text-[#475467]">{item.coverage}</span>
              <button
                onClick={() => {
                  onSpeak(`Selected ${item.name}. Switching to Assisted Completion to prepare official representation.`);
                  onNavigate('GRIEVANCE');
                }}
                className="bg-[#087F68] hover:bg-[#066553] text-white px-3.5 py-1.5 rounded-md font-bold text-xs shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
              >
                <span>Apply / Inquire</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

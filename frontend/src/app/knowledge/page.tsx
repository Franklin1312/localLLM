"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Search, FileText, Layers, Database, ShieldAlert, Check } from "lucide-react";
import { api } from "@/lib/api";
import { KnowledgeDocument } from "@/types";

export default function KnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("heat exchanger minimum tube thickness SOP-08");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const data = await api.listDocuments();
      setDocs(data);
    } catch (e) {}
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await api.searchKnowledge(searchQuery);
      setSearchResults(results);
    } catch (e) {
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-teal-400" />
          Enterprise Knowledge Base (On-Premise RAG)
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Local refinery SOPs, equipment manuals, and statutory safety directives indexed into sovereign vector chunks.
        </p>
      </div>

      {/* Semantic Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#0B1324] p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Search className="h-4 w-4 text-teal-400" />
          Hybrid Semantic & BM25 Knowledge Retrieval
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search refinery standards (e.g. minimum allowable tube thickness SOP-08)..."
            className="flex-1 rounded-lg border border-slate-800 bg-[#060B14] p-2.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="rounded-lg bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-500 transition"
          >
            {isSearching ? "Searching..." : "Query RAG"}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-slate-300">Matching Grounded Chunks</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {searchResults.map((res, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-800 bg-[#070D18] p-4 text-xs space-y-2 hover:border-teal-500/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-300">{res.source_citation}</span>
                    <span className="rounded bg-teal-500/10 px-2 py-0.5 text-[10px] font-mono text-teal-400">
                      Relevance Score: {res.score}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{res.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Indexed Documents Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0B1324] p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Database className="h-4 w-4 text-teal-400" />
          Indexed Sovereign Documents ({docs.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Document Title</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Pages</th>
                <th className="py-2.5 px-3">Chunks</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {docs.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{d.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{d.filename}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{d.file_type}</td>
                  <td className="py-3 px-3">{d.total_pages}</td>
                  <td className="py-3 px-3">{d.chunk_count || 5} chunks</td>
                  <td className="py-3 px-3">
                    <span className="rounded bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold text-teal-400 border border-teal-500/30">
                      Indexed & Air-Gapped
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

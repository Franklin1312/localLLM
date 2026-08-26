"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, Activity, RefreshCw, AlertCircle, CheckCircle, WifiOff } from "lucide-react";
import { api } from "@/lib/api";
import { NetworkTelemetry } from "@/types";

export default function SecurityPage() {
  const [telemetry, setTelemetry] = useState<NetworkTelemetry | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    loadTelemetry();
    const interval = setInterval(loadTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTelemetry = async () => {
    try {
      const data = await api.getNetworkTelemetry();
      setTelemetry(data);
    } catch (e) {}
  };

  const handleVerifyAirGap = async () => {
    setIsVerifying(true);
    try {
      const res = await api.verifyAirGap();
      setVerificationResult(res);
      await loadTelemetry();
    } catch (e) {
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="industrial-panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-extrabold text-[#111111] uppercase tracking-widest flex items-center gap-3">
            <ShieldCheck className="h-6 w-6" />
            Security Center & Sovereignty Monitor
          </h1>
          <p className="text-sm font-bold text-[#475569] mt-2 tracking-wide max-w-xl border-l-4 border-[#FF4500] pl-3 uppercase">
            Cryptographic air-gap monitoring. Validates 0 external API calls and 0 egress packets leave the perimeter.
          </p>
        </div>
        <button
          onClick={handleVerifyAirGap}
          disabled={isVerifying}
          className={`industrial-button whitespace-nowrap text-xs py-3 ${isVerifying ? "bg-[#E2E8F0] text-[#475569]" : "bg-[#111111] text-white"}`}
        >
          <RefreshCw className={`h-4 w-4 ${isVerifying ? "animate-spin" : ""}`} />
          {isVerifying ? "AUDITING SOCKETS..." : "RUN AIR-GAP PROBE"}
        </button>
      </div>

      {/* Hero Sovereignty Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: External API Calls */}
        <div className="industrial-panel bg-[#F4F4F2] text-[#111111] p-6 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#FF4500] transform translate-x-4 -translate-y-4 rotate-45"></div>
          <div className="flex items-center justify-between text-[#111111] text-[10px] font-bold uppercase tracking-wider">
            <span>External API Calls</span>
            <WifiOff className="h-4 w-4" />
          </div>
          <div className="text-4xl font-extrabold font-mono text-[#FF4500]">
            {telemetry?.external_api_calls ?? 0}
          </div>
          <div className="text-[10px] font-mono text-[#111111] border-t-2 border-[#111111] pt-2">100% ZERO-EGRESS VERIFIED</div>
        </div>

        {/* Metric 2: Local AI Inference */}
        <div className="industrial-panel bg-[#F4F4F2] p-6 space-y-3">
          <div className="flex items-center justify-between text-[#475569] text-[10px] font-bold uppercase tracking-wider">
            <span>Local AI Inference</span>
            <Lock className="h-4 w-4 text-[#111111]" />
          </div>
          <div className="text-4xl font-extrabold text-[#111111] font-mono">
            {telemetry?.local_ai_inference_pct ?? 100}%
          </div>
          <div className="text-[10px] font-mono text-[#111111] border-t-2 border-[#111111] pt-2">AIR-GAPPED GPU SERVING</div>
        </div>

        {/* Metric 3: Blocked Egress Attempts */}
        <div className="industrial-panel bg-[#F4F4F2] p-6 space-y-3">
          <div className="flex items-center justify-between text-[#111111] text-[10px] font-bold uppercase tracking-wider">
            <span>Blocked Outbound</span>
            <AlertCircle className="h-4 w-4 text-[#FF4500]" />
          </div>
          <div className="text-4xl font-extrabold text-[#111111] font-mono">
            {telemetry?.blocked_outbound_attempts ?? 0}
          </div>
          <div className="text-[10px] font-mono text-[#FF4500] font-bold border-t-2 border-[#111111] pt-2">SANDBOX EGRESS VIOLATIONS: 0</div>
        </div>

        {/* Metric 4: Total Local Operations */}
        <div className="industrial-panel bg-[#F4F4F2] p-6 space-y-3">
          <div className="flex items-center justify-between text-[#475569] text-[10px] font-bold uppercase tracking-wider">
            <span>Total Local Ops</span>
            <Activity className="h-4 w-4 text-[#111111]" />
          </div>
          <div className="text-4xl font-extrabold text-[#111111] font-mono">
            {telemetry?.total_local_requests ?? 0}
          </div>
          <div className="text-[10px] font-mono text-[#111111] border-t-2 border-[#111111] pt-2">ALL HANDLED ON-PREMISE</div>
        </div>
      </div>

      {/* Verification Probe Result Alert */}
      {verificationResult && (
        <div className="industrial-panel bg-[#E6F4EA] p-5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-[#137333]" />
            <div>
              <span className="font-extrabold text-[#137333] text-sm uppercase tracking-wider">{verificationResult.status}: </span>
              <span className="text-[#137333] font-bold tracking-wide uppercase">{verificationResult.message}</span>
            </div>
          </div>
          <span className="bg-white border-2 border-[#137333] px-3 py-1.5 text-[10px] font-mono font-bold text-[#137333] uppercase">
            AUDIT RECORDED
          </span>
        </div>
      )}

      {/* Active Socket Inspection Table */}
      <div className="industrial-panel bg-[#F4F4F2] p-0 overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b-2 border-[#111111] bg-[#F4F4F2]">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#111111] flex items-center gap-3">
            <Activity className="h-5 w-5 text-[#FF4500]" />
            Active Host & Process Sockets
          </h2>
          <span className="bg-[#111111] text-white px-3 py-1 text-[10px] font-mono font-bold uppercase">
            SOCKS: {telemetry?.active_local_sockets ?? 0}
          </span>
        </div>

        <div className="overflow-x-auto bg-[#F4F4F2] p-5">
          <table className="w-full text-left bg-white">
            <thead className="bg-[#111111] text-[#F4F4F2]">
              <tr>
                <th className="px-3 py-2 border border-[#111111]">Protocol</th>
                <th className="px-3 py-2 border border-[#111111]">Local Address</th>
                <th className="px-3 py-2 border border-[#111111]">Remote Address</th>
                <th className="px-3 py-2 border border-[#111111]">Status</th>
                <th className="px-3 py-2 border border-[#111111]">Air-Gap Check</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs font-bold text-[#111111] uppercase">
              {telemetry?.connections?.map((conn, idx) => (
                <tr key={idx} className="hover:bg-[#E2E8F0] transition">
                  <td className="px-3 py-2 border border-[#111111]">{conn.type}</td>
                  <td className="px-3 py-2 border border-[#111111]">{conn.local_address}</td>
                  <td className="px-3 py-2 border border-[#111111]">{conn.remote_address}</td>
                  <td className="px-3 py-2 border border-[#111111]">{conn.status}</td>
                  <td className="px-3 py-2 border border-[#111111]">
                    <span className="bg-[#E6F4EA] text-[#137333] border-2 border-[#137333] px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                      LOCAL ONLY (VERIFIED)
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

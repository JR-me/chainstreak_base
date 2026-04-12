"use client";

import { useState, useEffect } from "react";
import { useConnect, useDisconnect, useSwitchChain, useChainId } from "wagmi";
import { useChainstreak, TIER_COLOR, TIER_NAME, TIER_THRESHOLD, type Tier } from "@/hooks/useChainstreak";
import { CHAIN_META, FAUCET_URLS } from "@/lib/wagmi";

// ─── Per-tier full theme ──────────────────────────────────────────────────────

const TIER_THEME: Record<Tier, {
  appBg: string; grid: string; orb: string;
  tbBg: string; tbBd: string;
  brand: string; eye: string; heroText: string; sub: string;
  pillActiveBg: string; pillActiveBd: string; pillActiveText: string; pillGem: string;
  pillInactiveBg: string; pillInactiveBd: string; pillInactiveText: string;
  nftBg: string; nftBd: string; nftShadow: string; nftCorner: string;
  ringOuter: string; ringInner: string; rsA: string; rsB: string; rsC: string;
  numColor: string; lblColor: string; badgeColor: string; nsubColor: string;
  statBg: string; statBd: string; statLbl: string; statVal: string; statMuted: string;
  btnBg: string; btnBd: string; btnText: string;
  ptBg: string; pbColor: string; pll: string; plr: string;
  divider: string; footer: string;
  chipBg: string; chipBd: string; chipText: string;
}> = {
  0: {
    appBg:"#f5f5f3", grid:"rgba(0,0,0,0.033)", orb:"rgba(175,175,170,0.18)",
    tbBg:"rgba(245,245,243,0.82)", tbBd:"rgba(0,0,0,0.07)",
    brand:"#383836", eye:"#aaa9a6", heroText:"#1c1c1a", sub:"#b8b7b4",
    pillActiveBg:"rgba(88,88,82,0.09)", pillActiveBd:"rgba(88,88,82,0.22)", pillActiveText:"#323230", pillGem:"#6e6e6a",
    pillInactiveBg:"rgba(0,0,0,0.03)", pillInactiveBd:"rgba(0,0,0,0.07)", pillInactiveText:"#c0bfbc",
    nftBg:"linear-gradient(148deg,#ececec 0%,#d8d8d4 22%,#c0c0bc 45%,#cececa 60%,#e4e4e2 80%,#f0f0ee 100%)",
    nftBd:"rgba(145,145,140,0.3)", nftShadow:"0 20px 56px rgba(130,130,125,0.18),0 6px 20px rgba(130,130,125,0.13)",
    nftCorner:"rgba(55,55,52,0.38)",
    ringOuter:"rgba(75,75,72,0.12)", ringInner:"rgba(55,55,52,0.08)",
    rsA:"rgba(55,55,52,0.55)", rsB:"rgba(100,100,96,0.27)", rsC:"rgba(130,130,126,0.13)",
    numColor:"#262624", lblColor:"rgba(55,55,52,0.36)", badgeColor:"#262624", nsubColor:"rgba(55,55,52,0.3)",
    statBg:"rgba(0,0,0,0.04)", statBd:"rgba(0,0,0,0.07)", statLbl:"#b8b7b4", statVal:"#1c1c1a", statMuted:"#868682",
    btnBg:"rgba(78,78,74,0.07)", btnBd:"rgba(78,78,74,0.2)", btnText:"#282826",
    ptBg:"rgba(0,0,0,0.07)", pbColor:"#88887e", pll:"#b8b7b4", plr:"#78786e",
    divider:"rgba(0,0,0,0.07)", footer:"#b8b7b4",
    chipBg:"rgba(0,0,0,0.04)", chipBd:"rgba(0,0,0,0.08)", chipText:"#949490",
  },
  1: {
    appBg:"#eef4ff", grid:"rgba(59,130,246,0.038)", orb:"rgba(96,152,252,0.24)",
    tbBg:"rgba(238,244,255,0.82)", tbBd:"rgba(59,130,246,0.1)",
    brand:"#18449a", eye:"#6898dc", heroText:"#0c285a", sub:"#78a8d8",
    pillActiveBg:"rgba(59,130,246,0.1)", pillActiveBd:"rgba(59,130,246,0.28)", pillActiveText:"#18449a", pillGem:"#3b82f6",
    pillInactiveBg:"rgba(59,130,246,0.03)", pillInactiveBd:"rgba(59,130,246,0.08)", pillInactiveText:"#96bce8",
    nftBg:"linear-gradient(148deg,#c8dcfc 0%,#68a8f8 22%,#2558e0 45%,#4488f4 60%,#96c4fc 80%,#c0d8fe 100%)",
    nftBd:"rgba(59,130,246,0.4)", nftShadow:"0 20px 64px rgba(59,130,246,0.28),0 6px 24px rgba(59,130,246,0.2)",
    nftCorner:"rgba(255,255,255,0.58)",
    ringOuter:"rgba(255,255,255,0.18)", ringInner:"rgba(255,255,255,0.1)",
    rsA:"rgba(255,255,255,0.72)", rsB:"rgba(172,210,255,0.38)", rsC:"rgba(112,168,252,0.18)",
    numColor:"#fff", lblColor:"rgba(255,255,255,0.46)", badgeColor:"#e4eeff", nsubColor:"rgba(255,255,255,0.4)",
    statBg:"rgba(59,130,246,0.06)", statBd:"rgba(59,130,246,0.1)", statLbl:"#78a8e0", statVal:"#0c285a", statMuted:"#5888c0",
    btnBg:"rgba(59,130,246,0.08)", btnBd:"rgba(59,130,246,0.24)", btnText:"#18449a",
    ptBg:"rgba(59,130,246,0.1)", pbColor:"#3b82f6", pll:"#78a8e0", plr:"#3b82f6",
    divider:"rgba(59,130,246,0.1)", footer:"#78a8d8",
    chipBg:"rgba(59,130,246,0.06)", chipBd:"rgba(59,130,246,0.12)", chipText:"#5890d8",
  },
  2: {
    appBg:"#f2f2f5", grid:"rgba(108,108,138,0.038)", orb:"rgba(148,148,178,0.2)",
    tbBg:"rgba(242,242,245,0.82)", tbBd:"rgba(108,108,138,0.1)",
    brand:"#2c2c48", eye:"#7c7ca0", heroText:"#181828", sub:"#8686a4",
    pillActiveBg:"rgba(108,108,158,0.1)", pillActiveBd:"rgba(108,108,158,0.26)", pillActiveText:"#2c2c48", pillGem:"#8888b4",
    pillInactiveBg:"rgba(108,108,138,0.03)", pillInactiveBd:"rgba(108,108,138,0.07)", pillInactiveText:"#a4a4c4",
    nftBg:"linear-gradient(148deg,#e4e4ec 0%,#b8b8cc 22%,#8080a4 45%,#9898b8 60%,#d0d0e0 80%,#e8e8f0 100%)",
    nftBd:"rgba(128,128,168,0.35)", nftShadow:"0 20px 60px rgba(98,98,148,0.22),0 6px 22px rgba(98,98,148,0.16)",
    nftCorner:"rgba(255,255,255,0.58)",
    ringOuter:"rgba(255,255,255,0.18)", ringInner:"rgba(205,205,228,0.12)",
    rsA:"rgba(255,255,255,0.7)", rsB:"rgba(198,198,228,0.36)", rsC:"rgba(158,158,198,0.18)",
    numColor:"#fff", lblColor:"rgba(255,255,255,0.44)", badgeColor:"#ececf4", nsubColor:"rgba(255,255,255,0.36)",
    statBg:"rgba(108,108,138,0.06)", statBd:"rgba(108,108,138,0.1)", statLbl:"#8686a4", statVal:"#181828", statMuted:"#686884",
    btnBg:"rgba(108,108,158,0.07)", btnBd:"rgba(108,108,158,0.22)", btnText:"#2c2c48",
    ptBg:"rgba(108,108,138,0.1)", pbColor:"#8888b4", pll:"#8686a4", plr:"#7474a4",
    divider:"rgba(108,108,138,0.1)", footer:"#9494b4",
    chipBg:"rgba(108,108,138,0.06)", chipBd:"rgba(108,108,138,0.12)", chipText:"#7c7ca0",
  },
  3: {
    appBg:"#fdf8ed", grid:"rgba(178,138,0,0.048)", orb:"rgba(234,182,38,0.24)",
    tbBg:"rgba(253,248,237,0.82)", tbBd:"rgba(198,152,12,0.12)",
    brand:"#664200", eye:"#b47e0c", heroText:"#382400", sub:"#be8c0e",
    pillActiveBg:"rgba(198,152,12,0.1)", pillActiveBd:"rgba(198,152,12,0.3)", pillActiveText:"#664200", pillGem:"#d29c0e",
    pillInactiveBg:"rgba(198,152,12,0.03)", pillInactiveBd:"rgba(198,152,12,0.08)", pillInactiveText:"#c49c3e",
    nftBg:"linear-gradient(148deg,#fdeea0 0%,#f4c030 22%,#c47400 45%,#e49c0c 60%,#fce460 80%,#fef4b0 100%)",
    nftBd:"rgba(208,162,12,0.46)", nftShadow:"0 20px 68px rgba(208,162,12,0.3),0 6px 26px rgba(208,162,12,0.22)",
    nftCorner:"rgba(56,36,0,0.46)",
    ringOuter:"rgba(255,255,255,0.22)", ringInner:"rgba(255,230,96,0.14)",
    rsA:"rgba(255,255,255,0.78)", rsB:"rgba(254,212,64,0.44)", rsC:"rgba(224,162,22,0.2)",
    numColor:"#2a1800", lblColor:"rgba(56,36,0,0.4)", badgeColor:"#261600", nsubColor:"rgba(56,36,0,0.3)",
    statBg:"rgba(198,152,12,0.07)", statBd:"rgba(198,152,12,0.12)", statLbl:"#c48a0e", statVal:"#382400", statMuted:"#8e5c0c",
    btnBg:"rgba(198,152,12,0.09)", btnBd:"rgba(198,152,12,0.28)", btnText:"#664200",
    ptBg:"rgba(198,152,12,0.1)", pbColor:"#d29c0e", pll:"#c48a0e", plr:"#be7c0c",
    divider:"rgba(198,152,12,0.12)", footer:"#be9420",
    chipBg:"rgba(198,152,12,0.07)", chipBd:"rgba(198,152,12,0.14)", chipText:"#a66c0c",
  },
};

const TIERS: { id: Tier; label: string; range: string }[] = [
  { id: 0, label: "White",  range: "0–9 d"   },
  { id: 1, label: "Blue",   range: "10–49 d"  },
  { id: 2, label: "Silver", range: "50–99 d"  },
  { id: 3, label: "Gold",   range: "100+ d"   },
];

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Page() {
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();
  const chainId = useChainId();

  const {
    address, isConnected, contractAddress,
    isMinted, hasCheckedInToday,
    tokenId, firstDate,
    currentStreak, highestStreak, totalActiveDays,
    tier, tierProgress,
    isStreakLoading, isTxPending, isConfirming, isConfirmed,
    writeError, checkIn, resetWrite,
  } = useChainstreak();

  const [showChains, setShowChains]   = useState(false);
  const [showWallets, setShowWallets] = useState(false);
  const [mounted, setMounted]         = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (isConfirmed) {
      setCelebrating(true);
      setTimeout(() => { resetWrite(); setCelebrating(false); }, 3000);
    }
  }, [isConfirmed, resetWrite]);
  useEffect(() => {
    const h = () => { setShowChains(false); setShowWallets(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  const th = TIER_THEME[tier];
  const chainMeta = CHAIN_META[chainId];
  const faucetUrl = FAUCET_URLS[chainId];

  const btnLabel = () => {
    if (isTxPending)                return "Confirm in wallet…";
    if (isConfirming)               return "Waiting for block…";
    if (isConfirmed || celebrating) return "✓ Checked in — see you tomorrow";
    if (hasCheckedInToday)          return "Come back tomorrow";
    if (!isMinted)                  return "✦ Mint & check in";
    return "✦ Check in today";
  };
  const btnDisabled = (hasCheckedInToday && !celebrating) || isTxPending || isConfirming || isConfirmed || celebrating;

  if (!mounted) return null;

  // Apply theme to html/body for full-bleed background
  if (typeof document !== "undefined") {
    document.body.style.background = th.appBg;
    document.body.style.transition = "background 0.8s";
  }

  const NEXT_TIER_NAME = ["Blue","Silver","Gold","MAX"][tier] as string;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { background: ${th.appBg}; transition: background 0.8s; }
        body { font-family: 'DM Mono', monospace; min-height: 100vh; }
        button { cursor: pointer; font-family: inherit; }

        .bg-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: linear-gradient(${th.grid} 1px, transparent 1px),
                            linear-gradient(90deg, ${th.grid} 1px, transparent 1px);
          background-size: 44px 44px;
          transition: background-image 0.8s;
        }
        .bg-orb {
          position: fixed; width: 700px; height: 500px; border-radius: 50%;
          top: -140px; left: 50%; transform: translateX(-50%);
          pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse at 50% 0%, ${th.orb} 0%, transparent 62%);
          transition: background 0.9s;
        }

        /* ── Topbar ── */
        .topbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px; height: 54px;
          background: ${th.tbBg}; border-bottom: 1px solid ${th.tbBd};
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          transition: background 0.8s, border-color 0.8s;
        }
        .brand {
          font-family: 'DM Serif Display', serif; font-size: 18px;
          letter-spacing: 0.02em; font-style: italic;
          color: ${th.brand}; transition: color 0.7s;
        }
        .chip {
          border-radius: 22px; padding: 5px 14px; font-size: 11px;
          letter-spacing: 0.04em; cursor: pointer; font-family: 'DM Mono', monospace;
          background: ${th.chipBg}; border: 1px solid ${th.chipBd}; color: ${th.chipText};
          transition: all 0.6s;
        }

        /* ── Main ── */
        .main { position: relative; z-index: 5; max-width: 700px; margin: 0 auto; padding: 72px 24px 64px; }

        /* ── Hero ── */
        .hero { text-align: center; padding: 48px 0 36px; }
        .hero-eyebrow {
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 18px; color: ${th.eye}; transition: color 0.7s;
        }
        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.8rem, 8vw, 4.6rem);
          line-height: 0.95; letter-spacing: -0.02em;
          color: ${th.heroText}; transition: color 0.8s; margin-bottom: 14px;
        }
        .hero-title em { font-style: italic; opacity: 0.38; }
        .hero-sub { font-size: 11px; letter-spacing: 0.14em; color: ${th.sub}; transition: color 0.7s; }

        /* ── Tier pills ── */
        .tier-row { display: flex; gap: 7px; margin: 0 0 30px; justify-content: center; flex-wrap: wrap; }
        .tier-pill {
          display: flex; align-items: center; gap: 8px;
          border-radius: 24px; padding: 8px 15px 8px 11px;
          font-size: 11px; letter-spacing: 0.08em; cursor: default;
          border: 1px solid; transition: all 0.35s; user-select: none;
        }
        .tier-pill.active {
          background: ${th.pillActiveBg}; border-color: ${th.pillActiveBd}; color: ${th.pillActiveText};
        }
        .tier-pill.inactive {
          background: ${th.pillInactiveBg}; border-color: ${th.pillInactiveBd}; color: ${th.pillInactiveText};
        }
        .tier-gem { width: 7px; height: 7px; border-radius: 2px; transform: rotate(45deg); flex-shrink: 0; }

        /* ── Layout ── */
        .center-panel { display: grid; grid-template-columns: 1fr 210px; gap: 18px; margin-bottom: 18px; align-items: start; }

        /* ── NFT Card ── */
        .nft-frame {
          border-radius: 22px; aspect-ratio: 1;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 11px;
          position: relative; overflow: hidden;
          background: ${th.nftBg}; border: 1px solid ${th.nftBd}; box-shadow: ${th.nftShadow};
          transition: background 0.8s, border 0.8s, box-shadow 0.8s;
        }
        .nft-grain {
          position: absolute; inset: 0; border-radius: 22px; pointer-events: none; z-index: 2;
          opacity: 0.22;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }
        .nft-sheen {
          position: absolute; inset: 0; border-radius: 22px; pointer-events: none; z-index: 3;
          background: linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.05) 38%, rgba(255,255,255,0.0) 50%, rgba(255,255,255,0.14) 65%, rgba(255,255,255,0.04) 100%);
          mix-blend-mode: overlay;
        }
        .nft-sheen2 {
          position: absolute; inset: 0; border-radius: 22px; pointer-events: none; z-index: 3;
          background: linear-gradient(225deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.0) 40%, rgba(0,0,0,0.06) 100%);
          mix-blend-mode: overlay;
        }
        .nft-corner {
          position: absolute; font-size: 10px; letter-spacing: 0.1em;
          font-family: 'DM Mono', monospace; z-index: 5; color: ${th.nftCorner}; transition: color 0.6s;
        }
        .nft-corner.tl { top: 15px; left: 17px; }
        .nft-corner.tr { top: 15px; right: 17px; }
        .nft-corner.br { bottom: 15px; right: 17px; }

        /* ── Ring ── */
        .orbit-rings { position: relative; width: 145px; height: 145px; display: flex; align-items: center; justify-content: center; z-index: 5; }
        .ring { position: absolute; border-radius: 50%; border: 1px solid transparent; transition: border-color 0.8s; }
        .ring-outer { width: 145px; height: 145px; border-color: ${th.ringOuter}; }
        .ring-inner { width: 94px;  height: 94px;  border-color: ${th.ringInner}; }
        .ring-spin {
          position: absolute; width: 122px; height: 122px; border-radius: 50%;
          border: 1.5px solid transparent; border-top-color: transparent;
          border-right-color: ${th.rsA}; border-bottom-color: ${th.rsB}; border-left-color: ${th.rsC};
          animation: spin 5.5s linear infinite;
          transition: border-right-color 0.8s, border-bottom-color 0.8s, border-left-color 0.8s;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .streak-center { display: flex; flex-direction: column; align-items: center; z-index: 6; }
        .streak-number {
          font-family: 'DM Serif Display', serif; font-size: 56px; line-height: 1;
          color: ${th.numColor}; transition: color 0.8s;
        }
        .streak-label {
          font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase;
          margin-top: 3px; color: ${th.lblColor}; transition: color 0.8s;
        }
        .tier-name-badge {
          font-family: 'DM Serif Display', serif; font-size: 16px; font-style: italic;
          letter-spacing: 0.06em; z-index: 5; color: ${th.badgeColor}; transition: color 0.8s;
        }
        .nft-sub { font-size: 9px; letter-spacing: 0.1em; z-index: 5; color: ${th.nsubColor}; transition: color 0.8s; }

        /* ── Stats ── */
        .stats-col { display: flex; flex-direction: column; gap: 9px; }
        .stat-card {
          border-radius: 15px; padding: 14px 16px;
          background: ${th.statBg}; border: 1px solid ${th.statBd};
          transition: background 0.7s, border 0.7s;
        }
        .stat-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 6px; color: ${th.statLbl}; transition: color 0.7s; }
        .stat-value { font-family: 'DM Serif Display', serif; font-size: 23px; line-height: 1; color: ${th.statVal}; transition: color 0.8s; }
        .stat-value.sm { font-size: 17px; color: ${th.statMuted}; }

        /* ── Button ── */
        .checkin-btn {
          width: 100%; padding: 17px; border-radius: 15px;
          font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase;
          transition: all 0.35s; border: 1px solid;
        }
        .checkin-btn.ready {
          background: ${th.btnBg}; border-color: ${th.btnBd}; color: ${th.btnText};
        }
        .checkin-btn.ready:hover { transform: translateY(-1px); }
        .checkin-btn.off {
          background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.08); color: rgba(0,0,0,0.22); cursor: not-allowed;
        }

        /* ── Progress ── */
        .prog-meta { display: flex; justify-content: space-between; margin-bottom: 9px; font-size: 10px; letter-spacing: 0.1em; }
        .prog-track { height: 2px; border-radius: 2px; overflow: hidden; background: ${th.ptBg}; transition: background 0.7s; }
        .prog-bar { height: 100%; border-radius: 2px; background: ${th.pbColor}; transition: width 1s cubic-bezier(0.16,1,0.3,1), background 0.8s; }

        /* ── Misc ── */
        .cs-divider { border: none; border-top: 1px solid ${th.divider}; margin: 32px 0 18px; transition: border-color 0.7s; }
        .cs-footer { text-align: center; font-size: 10px; letter-spacing: 0.12em; line-height: 2.2; color: ${th.footer}; transition: color 0.7s; }
        .dropdown {
          position: absolute; right: 0; top: calc(100% + 6px);
          background: ${th.appBg}; border: 1px solid ${th.tbBd};
          border-radius: 12px; padding: 6px; min-width: 180px; z-index: 200;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          animation: fadein 0.15s ease forwards;
        }
        .dropdown button {
          display: block; width: 100%; text-align: left;
          background: transparent; border: none; padding: 8px 10px; border-radius: 7px;
          font-size: 11px; letter-spacing: 0.04em; color: ${th.chipText};
          font-family: 'DM Mono', monospace; transition: background 0.15s;
        }
        .dropdown button:hover { background: ${th.statBg}; }
        .error-text { margin-top: 8px; font-size: 9px; color: #c0392b; text-align: center; letter-spacing: 0.05em; }
        .success-text { margin-top: 8px; font-size: 9px; color: #27ae60; text-align: center; letter-spacing: 0.05em; }
        .faucet-text { margin-top: 12px; text-align: center; font-size: 10px; color: ${th.footer}; }
        .faucet-text a { color: ${th.sub}; text-decoration: underline; }
        .no-contract {
          width: 100%; padding: 16px; text-align: center;
          background: #fff8f0; border: 1px solid #ff980033; border-radius: 14px;
        }
        .no-contract p { font-size: 10px; letter-spacing: 0.06em; }

        @keyframes fadein { from { opacity:0; transform: translateY(4px); } to { opacity:1; transform: translateY(0); } }

        @media (max-width: 560px) {
          .center-panel { grid-template-columns: 1fr; }
          .stats-col { flex-direction: row; flex-wrap: wrap; }
          .stats-col .stat-card { flex: 1 1 calc(50% - 5px); }
          .tier-row { gap: 5px; }
          .topbar { padding: 0 16px; }
          .main { padding: 68px 16px 48px; }
        }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-orb" />

      {/* ── Topbar ── */}
      <header className="topbar">
        <span className="brand">Chainstreak</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }} onClick={e => e.stopPropagation()}>
          {isConnected && (
            <div style={{ position: "relative" }}>
              <button className="chip" onClick={() => { setShowChains(v => !v); setShowWallets(false); }}>
                {chainMeta ? `${chainMeta.name}${chainMeta.testnet ? " ·test" : ""}` : `Chain ${chainId}`}
              </button>
              {showChains && (
                <div className="dropdown">
                  {chains.map(c => (
                    <button key={c.id} onClick={() => { switchChain({ chainId: c.id }); setShowChains(false); }}
                      style={{ color: c.id === chainId ? th.brand : th.chipText }}>
                      {CHAIN_META[c.id]?.name ?? c.name}{CHAIN_META[c.id]?.testnet ? " (test)" : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {!isConnected ? (
            <div style={{ position: "relative" }}>
              <button className="chip" onClick={() => { setShowWallets(v => !v); setShowChains(false); }}>
                Connect
              </button>
              {showWallets && (
                <div className="dropdown">
                  {connectors.map(c => (
                    <button key={c.id} onClick={() => { connect({ connector: c }); setShowWallets(false); }}>
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button className="chip" onClick={() => disconnect()}>
              {address?.slice(0, 6)}…{address?.slice(-4)}
            </button>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="main">

        {/* Hero */}
        <div className="hero">
          <p className="hero-eyebrow">Soul-bound on-chain NFT</p>
          <h1 className="hero-title">Daily proof<br /><em>of presence.</em></h1>
          <p className="hero-sub">Check in once a day · Build your streak · Evolve your NFT</p>
        </div>

        {/* Tier pills */}
        <div className="tier-row">
          {TIERS.map(t => {
            const active = isMinted && t.id === tier;
            const gemColor = active ? th.pillGem : th.pillInactiveText + "55";
            return (
              <div key={t.id} className={`tier-pill ${active ? "active" : "inactive"}`}>
                <div className="tier-gem" style={{ background: gemColor }} />
                {t.label}
                <span style={{ fontSize: 10, opacity: 0.55, marginLeft: 3 }}>{t.range}</span>
              </div>
            );
          })}
        </div>

        {/* NFT card + stats */}
        <div className="center-panel">
          <div className="nft-frame">
            <div className="nft-grain" />
            <div className="nft-sheen" />
            <div className="nft-sheen2" />
            <span className="nft-corner tl">CSTRK</span>
            <span className="nft-corner tr">{isMinted ? `#${tokenId}` : "—"}</span>
            <span className="nft-corner br">ERC-721</span>
            <div className="orbit-rings">
              <div className="ring ring-outer" />
              <div className="ring ring-inner" />
              <div className="ring-spin" />
              <div className="streak-center">
                <span className="streak-number">{highestStreak}</span>
                <span className="streak-label">best streak</span>
              </div>
            </div>
            <span className="tier-name-badge">{TIER_NAME[tier]}</span>
            <span className="nft-sub">
              {isMinted ? `current ${currentStreak}d · total ${totalActiveDays}d` : "not minted yet"}
            </span>
          </div>

          <div className="stats-col">
            <div className="stat-card"><p className="stat-label">Current streak</p><p className="stat-value">{isMinted ? `${currentStreak} days` : "—"}</p></div>
            <div className="stat-card"><p className="stat-label">Best streak</p><p className="stat-value">{isMinted ? `${highestStreak} days` : "—"}</p></div>
            <div className="stat-card"><p className="stat-label">Total active</p><p className="stat-value">{isMinted ? `${totalActiveDays} days` : "—"}</p></div>
            <div className="stat-card"><p className="stat-label">First check-in</p><p className="stat-value sm">{firstDate ?? "—"}</p></div>
          </div>
        </div>

        {/* Action */}
        {!isConnected ? (
          <button className="checkin-btn ready" onClick={() => setShowWallets(true)}>
            Connect wallet to begin
          </button>
        ) : !contractAddress ? (
          <div className="no-contract">
            <p style={{ color: "#ff9800", marginBottom: 6 }}>⚠ No contract on this network yet</p>
            <p style={{ color: "#a06020" }}>Switch to a supported chain above</p>
          </div>
        ) : (
          <>
            <button
              className={`checkin-btn ${btnDisabled ? "off" : "ready"}`}
              onClick={checkIn}
              disabled={btnDisabled}
            >
              {btnLabel()}
            </button>

            {writeError && <p className="error-text">{writeError.message.slice(0, 120)}</p>}
            {isConfirmed && <p className="success-text">✓ Check-in confirmed on chain</p>}

            {/* Tier progress */}
            {isMinted && (
              <div style={{ marginTop: "1.5rem" }}>
                <div className="prog-meta">
                  <span style={{ color: th.pll }}>Tier progress</span>
                  <span style={{ color: th.plr }}>
                    {tier < 3
                      ? `${highestStreak} / ${TIER_THRESHOLD[tier + 1]} days to ${NEXT_TIER_NAME}`
                      : "Max tier reached"}
                  </span>
                </div>
                <div className="prog-track">
                  <div className="prog-bar" style={{ width: `${tierProgress}%` }} />
                </div>
              </div>
            )}

            {faucetUrl && (
              <p className="faucet-text">
                Need testnet gas?{" "}
                <a href={faucetUrl} target="_blank" rel="noreferrer">
                  {CHAIN_META[chainId]?.name} faucet ↗
                </a>
              </p>
            )}
          </>
        )}

        <hr className="cs-divider" />
        <p className="cs-footer">
          Soul-bound ERC-721 · Fully on-chain SVG · No IPFS · EVM multi-chain<br />
          Tier based on all-time highest streak — never decreases
        </p>
      </main>
    </>
  );
}

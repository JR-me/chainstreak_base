export const CHAINSTREAK_ABI = [
  // ── Reads ──────────────────────────────────────────────────────────────────
  {
    name: "streakOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "wallet", type: "address" }],
    outputs: [
      { name: "tokenId",         type: "uint256" },
      { name: "firstCheckIn",    type: "uint48"  },
      { name: "lastCheckIn",     type: "uint48"  },
      { name: "currentStreak",   type: "uint32"  },
      { name: "highestStreak",   type: "uint32"  },
      { name: "totalActiveDays", type: "uint32"  },
    ],
  },
  {
    name: "tierOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "wallet", type: "address" }],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "tokenURI",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "consistencyOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "wallet", type: "address" }],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "activityWord",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "wallet",    type: "address" },
      { name: "wordIndex", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "recentActivity",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "wallet",  type: "address" },
      { name: "numDays", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool[]" }],
  },
  // ── Writes ─────────────────────────────────────────────────────────────────
  {
    name: "checkIn",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  // ── Events ─────────────────────────────────────────────────────────────────
  {
    name: "Minted",
    type: "event",
    inputs: [
      { name: "wallet",    type: "address", indexed: true  },
      { name: "tokenId",   type: "uint256", indexed: true  },
      { name: "timestamp", type: "uint48",  indexed: false },
    ],
  },
  {
    name: "CheckedIn",
    type: "event",
    inputs: [
      { name: "wallet",          type: "address", indexed: true  },
      { name: "tokenId",         type: "uint256", indexed: true  },
      { name: "currentStreak",   type: "uint32",  indexed: false },
      { name: "highestStreak",   type: "uint32",  indexed: false },
      { name: "totalActiveDays", type: "uint32",  indexed: false },
    ],
  },
  {
    name: "StreakBroken",
    type: "event",
    inputs: [
      { name: "wallet",     type: "address", indexed: true  },
      { name: "tokenId",    type: "uint256", indexed: true  },
      { name: "lastStreak", type: "uint32",  indexed: false },
    ],
  },
] as const;

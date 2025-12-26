
export type TimeFilter = '1H' | '24H' | '7D' | '30D' | 'Custom';
export type ViewMode = 'COMMAND' | 'LAB' | 'TECH' | 'FINANCE' | 'BENCHMARK' | 'SIMULATOR' | 'B2B'; // Added B2B mode

export interface KPI {
  id: string;
  label: string;
  value: number | string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  status: 'critical' | 'warning' | 'normal';
  description: string;
}

export interface Anomaly {
  id: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
  type: string;
  timestamp: string;
  value: string;
  riskScore: number; // 1-10 Scale for AI prioritization
}

export interface RegionNode {
  id: string;
  name: string;
  x: number;
  y: number;
  stressLevel: number; // 0-100
  leakRate: number;
}

export interface AIAnalysisResult {
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  summary: string; // Problem / Diagnosis
  actionItems: string[]; // Strategic Actions
  priorityRegion: string;
  projectedImpact: string; // Expected Result / ROI
}

export interface ImpactStory {
  title: string;
  message: string;
  icon: 'pool' | 'bottle' | 'house';
  highlightColor: string;
  concreteValue: string;
}

// Gamification Types
export interface Badge {
  id: string;
  name: string;
  icon: 'award' | 'droplet' | 'shield' | 'zap';
  count: number;
  description: string;
}

export interface GamificationStats {
  totalBadges: number;
  leaderboardRank: number;
  avgScoreTrend: number[]; // Last 10 days
  impactTrees: number;
  impactAnimals: number;
  aiAdoptionRate: number; // Percentage
  aiSavingsDelta: number; // Percentage difference
}

// Tech Backbone Types
export interface TechStats {
  totalDevices: number;
  deviceHealth: {
    active: number;
    lowBattery: number;
    offline: number;
  };
  signalQuality: {
    region: string;
    rssi: number; // Signal strength (e.g., -80 is good, -120 is bad)
    status: 'good' | 'fair' | 'poor';
    coverage: number; // %
  }[];
  avgBatteryLifeYears: number; // Remaining
}

// Financial ROI Types
export interface FinancialStats {
  savedAmount: number; // TL (Predicted Savings)
  preventedWasteVol: number; // m3
  tcoData: {
    hydraCost: number;
    competitorCost: number;
  };
  revenueStream: {
    hardware: number;
    saas: number;
    api: number;
  };
  roiMonths: number; // Payback period
}

// Benchmark & Momentum Types
export interface BenchmarkStats {
  periodComparison: {
    current: number;
    previous: number;
    metric: string; // e.g. "Günlük Tüketim"
    change: number; // %
  };
  cohortComparison: {
    hydraUserAvg: number;
    regionAvg: number;
    unit: string;
  };
  regionalComparison: {
    pilot: { name: string; score: number; trend: 'up' | 'down' };
    expansion: { name: string; score: number; trend: 'up' | 'down' };
  };
  momentum: {
    score: number; // 0-100 (Speed of savings)
    direction: 'accelerating' | 'decelerating' | 'stable';
  };
}

// Simulator Types
export interface SimulationParams {
  pricingChange: number; // % (-20 to +50)
  aiAdoption: number; // % (0 to 100)
  rainfall: 'drought' | 'normal' | 'wet';
  populationGrowth: number; // % (0 to 5)
}

export interface SimulationStats {
  yearsToScarcity: number | 'SAFE';
  projectedConsumption: number; // Future daily per capita
  projectedBill: number; // Monthly bill
  scarcityRisk: number; // 0-100
}

// B2B Types
export interface B2BStats {
  roiStats: {
    commonAreaSavings: number; // TL
    householdSavings: number; // TL
    maintenanceCostReduction: number; // %
  };
  penetration: {
    region: string;
    type: 'Municipality' | 'SiteManagement';
    phase: 1 | 2 | 3; // 1: Pilot, 2: Integration, 3: Full Scale
    status: 'Active' | 'Pending';
  }[];
  esgScore: {
    water: number; // E
    carbon: number; // E
    social: number; // S
    governance: number; // G
    efficiency: number; // G
  };
}

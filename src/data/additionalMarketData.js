// Mock data for additional market graphs
// This file contains data for the 9 new graphs to be added to the Overview tab

// IRSAD (Index of Relative Socio-economic Advantage and Disadvantage) data
export const irsadData = {
  currentValue: 1042,
  maxValue: 1200,
  minValue: 800,
  previousValue: 1015,
  percentile: 87,
  description: "The IRSAD score ranks areas on a scale from most disadvantaged to most advantaged.",
  source: "Australian Bureau of Statistics",
  history: [
    { year: 2015, value: 980 },
    { year: 2016, value: 990 },
    { year: 2017, value: 995 },
    { year: 2018, value: 1005 },
    { year: 2019, value: 1010 },
    { year: 2020, value: 1015 },
    { year: 2021, value: 1020 },
    { year: 2022, value: 1025 },
    { year: 2023, value: 1030 },
    { year: 2024, value: 1035 },
    { year: 2025, value: 1042 }
  ]
};

// Renters to Owners data
export const rentersToOwnersData = {
  owners: 68,
  renters: 32,
  source: "Australian Bureau of Statistics",
  description: "Percentage breakdown of property occupancy status in the suburb.",
  history: [
    { year: 2015, owners: 72, renters: 28 },
    { year: 2016, owners: 71, renters: 29 },
    { year: 2017, owners: 70, renters: 30 },
    { year: 2018, owners: 70, renters: 30 },
    { year: 2019, owners: 69, renters: 31 },
    { year: 2020, owners: 69, renters: 31 },
    { year: 2021, owners: 68, renters: 32 },
    { year: 2022, owners: 68, renters: 32 },
    { year: 2023, owners: 68, renters: 32 },
    { year: 2024, owners: 68, renters: 32 },
    { year: 2025, owners: 68, renters: 32 }
  ]
};

// Stock on Market (unsold listings) data
export const stockOnMarketData = {
  current: 42,
  previousMonth: 38,
  percentChange: 10.5,
  source: "SQM Research",
  description: "Number of properties currently listed for sale in the suburb.",
  history: [
    { month: "May", year: 2024, value: 32 },
    { month: "Jun", year: 2024, value: 34 },
    { month: "Jul", year: 2024, value: 36 },
    { month: "Aug", year: 2024, value: 35 },
    { month: "Sep", year: 2024, value: 33 },
    { month: "Oct", year: 2024, value: 34 },
    { month: "Nov", year: 2024, value: 36 },
    { month: "Dec", year: 2024, value: 38 },
    { month: "Jan", year: 2025, value: 40 },
    { month: "Feb", year: 2025, value: 39 },
    { month: "Mar", year: 2025, value: 38 },
    { month: "Apr", year: 2025, value: 42 }
  ]
};

// Inventory Levels (months) data
export const inventoryLevelsData = {
  current: 2.8,
  previousMonth: 2.5,
  percentChange: 12,
  source: "CoreLogic",
  description: "The number of months it would take to sell all current listings at the current sales rate.",
  history: [
    { month: "May", year: 2024, value: 2.1 },
    { month: "Jun", year: 2024, value: 2.2 },
    { month: "Jul", year: 2024, value: 2.3 },
    { month: "Aug", year: 2024, value: 2.2 },
    { month: "Sep", year: 2024, value: 2.1 },
    { month: "Oct", year: 2024, value: 2.2 },
    { month: "Nov", year: 2024, value: 2.3 },
    { month: "Dec", year: 2024, value: 2.4 },
    { month: "Jan", year: 2025, value: 2.5 },
    { month: "Feb", year: 2025, value: 2.6 },
    { month: "Mar", year: 2025, value: 2.5 },
    { month: "Apr", year: 2025, value: 2.8 }
  ]
};

// Building Approvals data
export const buildingApprovalsData = {
  current: {
    houses: 12,
    units: 28,
    total: 40
  },
  previousYear: {
    houses: 10,
    units: 22,
    total: 32
  },
  percentChange: 25,
  source: "Australian Bureau of Statistics",
  description: "Number of new dwelling approvals in the suburb.",
  history: [
    { year: 2020, houses: 8, units: 18, total: 26 },
    { year: 2021, houses: 9, units: 20, total: 29 },
    { year: 2022, houses: 10, units: 21, total: 31 },
    { year: 2023, houses: 10, units: 22, total: 32 },
    { year: 2024, houses: 11, units: 25, total: 36 },
    { year: 2025, houses: 12, units: 28, total: 40 }
  ]
};

// Days on Market data
export const daysOnMarketData = {
  current: 28,
  previousMonth: 32,
  percentChange: -12.5,
  source: "CoreLogic",
  description: "Average number of days properties are listed before being sold.",
  history: [
    { month: "May", year: 2024, value: 38 },
    { month: "Jun", year: 2024, value: 36 },
    { month: "Jul", year: 2024, value: 35 },
    { month: "Aug", year: 2024, value: 34 },
    { month: "Sep", year: 2024, value: 33 },
    { month: "Oct", year: 2024, value: 34 },
    { month: "Nov", year: 2024, value: 33 },
    { month: "Dec", year: 2024, value: 32 },
    { month: "Jan", year: 2025, value: 31 },
    { month: "Feb", year: 2025, value: 30 },
    { month: "Mar", year: 2025, value: 32 },
    { month: "Apr", year: 2025, value: 28 }
  ]
};

// Vacancy Rate data
export const vacancyRateData = {
  current: 1.8,
  previousMonth: 2.0,
  percentChange: -10,
  source: "SQM Research",
  description: "Percentage of rental properties that are vacant.",
  thresholds: {
    tight: 2.0,
    balanced: 3.0,
    oversupplied: 4.0
  },
  history: [
    { month: "May", year: 2024, value: 2.4 },
    { month: "Jun", year: 2024, value: 2.3 },
    { month: "Jul", year: 2024, value: 2.3 },
    { month: "Aug", year: 2024, value: 2.2 },
    { month: "Sep", year: 2024, value: 2.2 },
    { month: "Oct", year: 2024, value: 2.1 },
    { month: "Nov", year: 2024, value: 2.1 },
    { month: "Dec", year: 2024, value: 2.0 },
    { month: "Jan", year: 2025, value: 2.0 },
    { month: "Feb", year: 2025, value: 1.9 },
    { month: "Mar", year: 2025, value: 2.0 },
    { month: "Apr", year: 2025, value: 1.8 }
  ]
};

// Search Index data
export const searchIndexData = {
  current: 142,
  previousMonth: 135,
  percentChange: 5.2,
  source: "REA Group",
  description: "Relative search interest for properties in this suburb (100 = average).",
  history: [
    { month: "May", year: 2024, value: 120 },
    { month: "Jun", year: 2024, value: 122 },
    { month: "Jul", year: 2024, value: 125 },
    { month: "Aug", year: 2024, value: 128 },
    { month: "Sep", year: 2024, value: 130 },
    { month: "Oct", year: 2024, value: 132 },
    { month: "Nov", year: 2024, value: 134 },
    { month: "Dec", year: 2024, value: 135 },
    { month: "Jan", year: 2025, value: 138 },
    { month: "Feb", year: 2025, value: 140 },
    { month: "Mar", year: 2025, value: 135 },
    { month: "Apr", year: 2025, value: 142 }
  ],
  heatmap: [
    { day: "Mon", hour: "6am", value: 60 },
    { day: "Mon", hour: "12pm", value: 120 },
    { day: "Mon", hour: "6pm", value: 180 },
    { day: "Tue", hour: "6am", value: 65 },
    { day: "Tue", hour: "12pm", value: 130 },
    { day: "Tue", hour: "6pm", value: 175 },
    { day: "Wed", hour: "6am", value: 70 },
    { day: "Wed", hour: "12pm", value: 140 },
    { day: "Wed", hour: "6pm", value: 170 },
    { day: "Thu", hour: "6am", value: 75 },
    { day: "Thu", hour: "12pm", value: 150 },
    { day: "Thu", hour: "6pm", value: 190 },
    { day: "Fri", hour: "6am", value: 80 },
    { day: "Fri", hour: "12pm", value: 160 },
    { day: "Fri", hour: "6pm", value: 200 },
    { day: "Sat", hour: "6am", value: 100 },
    { day: "Sat", hour: "12pm", value: 220 },
    { day: "Sat", hour: "6pm", value: 160 },
    { day: "Sun", hour: "6am", value: 90 },
    { day: "Sun", hour: "12pm", value: 210 },
    { day: "Sun", hour: "6pm", value: 150 }
  ]
};

// Auction Clearance Rate data
export const auctionClearanceRateData = {
  current: 68,
  previousMonth: 65,
  percentChange: 4.6,
  source: "Domain Group",
  description: "Percentage of properties sold at auction.",
  history: [
    { month: "May", year: 2024, value: 62 },
    { month: "Jun", year: 2024, value: 63 },
    { month: "Jul", year: 2024, value: 64 },
    { month: "Aug", year: 2024, value: 64 },
    { month: "Sep", year: 2024, value: 65 },
    { month: "Oct", year: 2024, value: 66 },
    { month: "Nov", year: 2024, value: 67 },
    { month: "Dec", year: 2024, value: 65 },
    { month: "Jan", year: 2025, value: 64 },
    { month: "Feb", year: 2025, value: 66 },
    { month: "Mar", year: 2025, value: 65 },
    { month: "Apr", year: 2025, value: 68 }
  ]
};

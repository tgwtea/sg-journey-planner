// A sample of stops from the mockup STOPS table.
// sh = shelter level: 0 none, 1 partial, 2 full.
export const stops = [
  { id: 'b-smu', name: 'Opp SMU', kind: 'bus', code: '04121', sh: 2, note: 'Shelter fits about 20. When it pours, the queue spills onto the open walkway.' },
  { id: 'b-bugis', name: 'Bugis Junction', kind: 'bus', code: '01119', sh: 0, note: 'Shelter only covers half the usual queue. Stand near the pillar to keep dry.' },
  { id: 'b-orchard', name: 'Lucky Plaza', kind: 'bus', code: '09048', sh: 1, note: 'Covered, but the kerb floods quickly in heavy rain.' },
  { id: 'outram', name: 'Outram Park', kind: 'mrt', code: 'EW16 / NE3 / TE17', sh: 2, note: 'Long underground transfer between EW and NE. Budget 4 min.' },
  { id: 'harbourfront', name: 'HarbourFront', kind: 'mrt', code: 'NE1 / CC29', sh: 2, note: 'Covered link straight into VivoCity basement. No umbrella needed.' },
  { id: 'b-telok', name: 'Opp Seah Im Food Ctr', kind: 'bus', code: '14271', sh: 0, note: 'Unsheltered pole stop. Nearest cover is the food centre, 60 m away.' },
];

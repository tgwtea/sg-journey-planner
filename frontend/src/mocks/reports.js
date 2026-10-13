// Community report types and sample reports, from the mockup TYPES and seed data.
// ageSec = seconds since the report was made.
export const reportTypes = [
  { id: 'crowded', label: 'Crowded', icon: 'groups' },
  { id: 'wet', label: 'Wet', icon: 'water_drop' },
  { id: 'sheltered', label: 'Sheltered', icon: 'roofing' },
  { id: 'unsheltered', label: 'Unsheltered', icon: 'umbrella' },
  { id: 'slippery', label: 'Slippery', icon: 'warning' },
  { id: 'queue', label: 'Long queue', icon: 'hourglass_top' },
];

export const reports = [
  { id: 'r1', type: 'wet', place: 'Bras Basah', note: 'Puddle at the Exit A stairs, walk slowly', ageSec: 120 },
  { id: 'r2', type: 'queue', place: 'Opp SMU', note: 'Queue for bus 7 spilling onto the walkway', ageSec: 190 },
  { id: 'r3', type: 'crowded', place: 'Bishan', note: 'Platform packed. Waited 2 trains before boarding', ageSec: 240 },
  { id: 'r4', type: 'unsheltered', place: 'Bugis Junction', note: 'Shelter only covers half the queue', ageSec: 360 },
  { id: 'r5', type: 'slippery', place: 'Dhoby Ghaut', note: 'Floor wet near the Exit B escalator', ageSec: 540 },
  { id: 'r6', type: 'sheltered', place: 'City Hall', note: 'Link to Raffles City dry all the way', ageSec: 720 },
];

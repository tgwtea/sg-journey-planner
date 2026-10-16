// Community report types and sample reports, from the mockup TYPES and seed data.
export const reportTypes = [
  { id: 'crowded', label: 'Crowded', icon: 'groups' },
  { id: 'wet', label: 'Wet', icon: 'water_drop' },
  { id: 'sheltered', label: 'Sheltered', icon: 'roofing' },
  { id: 'unsheltered', label: 'Unsheltered', icon: 'umbrella' },
  { id: 'slippery', label: 'Slippery', icon: 'warning' },
  { id: 'queue', label: 'Long queue', icon: 'hourglass_top' },
];

// stop = a stop or place id from stops.js. ageSec = seconds since the report. c = confirmations.
export const reports = [
  { id: 1, type: 'wet', stop: 'brasbasah', note: 'Puddle at the Exit A stairs, walk slowly', ageSec: 120, c: 8 },
  { id: 2, type: 'queue', stop: 'b-smu', note: 'Queue for bus 7 spilling onto the walkway', ageSec: 190, c: 4 },
  { id: 3, type: 'crowded', stop: 'bishan', note: 'Platform packed. Waited 2 trains before boarding', ageSec: 240, c: 12 },
  { id: 4, type: 'unsheltered', stop: 'b-bugis', note: 'Shelter only covers half the queue', ageSec: 360, c: 5 },
  { id: 5, type: 'slippery', stop: 'dhoby', note: 'Floor wet near the Exit B escalator', ageSec: 540, c: 7 },
  { id: 6, type: 'sheltered', stop: 'cityhall', note: 'Link to Raffles City dry all the way', ageSec: 720, c: 15 },
  { id: 7, type: 'crowded', stop: 'orchard', note: 'ION side very busy, use Exit C', ageSec: 1080, c: 3 },
  { id: 8, type: 'wet', stop: 'payalebar', note: '', ageSec: 1500, c: 2 },
  { id: 9, type: 'queue', stop: 'changi', note: 'Taxi queue at T3 long, MRT moving fine', ageSec: 1860, c: 6 },
  { id: 10, type: 'sheltered', stop: 'tampines', note: 'Covered walkway from interchange to Hub works', ageSec: 2400, c: 9 },
  { id: 11, type: 'crowded', stop: 'jurong', note: '', ageSec: 3100, c: 4 },
];

// Places a user can pick when they post a report.
export const reportPlaces = ['brasbasah', 'b-smu', 'dhoby', 'cityhall', 'bugis', 'orchard', 'harbourfront', 'bishan', 'payalebar', 'tampines', 'changi', 'jurong'];

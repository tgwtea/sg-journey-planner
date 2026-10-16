// Stops and stations from the mockup STOPS and EXTRA tables.
// lat/lng are real (approximate) positions for the Leaflet map.
// sh = shelter level: 0 none, 1 partial, 2 full.
// arr = live arrival schedule: s service, d direction, p period (s), o offset (s), l load 0-3.
export const stops = [
  {
    id: 'dhoby', name: 'Dhoby Ghaut', kind: 'mrt', lat: 1.2993, lng: 103.8455, sh: 2,
    codes: [['NS', 'NS24'], ['NE', 'NE6'], ['CC', 'CC1']],
    note: 'Underground interchange. Exit B links to Plaza Singapura under cover, so it stays dry in a downpour.',
    arr: [
      { s: 'NE', d: 'to HarbourFront', p: 240, o: 40, l: 1 },
      { s: 'NE', d: 'to Punggol Coast', p: 270, o: 120, l: 2 },
      { s: 'NS', d: 'to Marina South Pier', p: 180, o: 20, l: 2 },
      { s: 'CC', d: 'to Stadium', p: 300, o: 200, l: 1 },
    ],
  },
  {
    id: 'brasbasah', name: 'Bras Basah', kind: 'mrt', lat: 1.2969, lng: 103.8507, sh: 1,
    codes: [['CC', 'CC2']],
    note: 'Exit A to SMU has about 40 m of open plaza. A covered walkway runs along Bras Basah Rd from Exit B.',
    arr: [
      { s: 'CC', d: 'to Stadium', p: 300, o: 90, l: 1 },
      { s: 'CC', d: 'to Dhoby Ghaut', p: 300, o: 240, l: 0 },
    ],
  },
  {
    id: 'cityhall', name: 'City Hall', kind: 'mrt', lat: 1.2931, lng: 103.8520, sh: 2,
    codes: [['NS', 'NS25'], ['EW', 'EW13']],
    note: 'Underground links to Raffles City and Esplanade. Sheltered all the way.',
    arr: [
      { s: 'EW', d: 'to Tuas Link', p: 200, o: 60, l: 2 },
      { s: 'EW', d: 'to Pasir Ris', p: 210, o: 150, l: 1 },
      { s: 'NS', d: 'to Jurong East', p: 180, o: 100, l: 3 },
    ],
  },
  {
    id: 'bugis', name: 'Bugis', kind: 'mrt', lat: 1.3009, lng: 103.8559, sh: 1,
    codes: [['EW', 'EW12'], ['DT', 'DT14']],
    note: 'Exit C into Bugis Junction is covered. Exit B onto Victoria St is not.',
    arr: [
      { s: 'EW', d: 'to Pasir Ris', p: 200, o: 30, l: 2 },
      { s: 'DT', d: 'to Expo', p: 240, o: 180, l: 1 },
      { s: 'EW', d: 'to Tuas Link', p: 210, o: 100, l: 2 },
    ],
  },
  {
    id: 'orchard', name: 'Orchard', kind: 'mrt', lat: 1.3040, lng: 103.8318, sh: 2,
    codes: [['NS', 'NS22'], ['TE', 'TE14']],
    note: 'The underpass to ION, Wisma and Ngee Ann City is fully sheltered.',
    arr: [
      { s: 'NS', d: 'to Marina South Pier', p: 180, o: 50, l: 3 },
      { s: 'TE', d: 'to Bayshore', p: 300, o: 200, l: 1 },
      { s: 'NS', d: 'to Jurong East', p: 190, o: 110, l: 2 },
    ],
  },
  {
    id: 'outram', name: 'Outram Park', kind: 'mrt', lat: 1.2803, lng: 103.8395, sh: 2,
    codes: [['EW', 'EW16'], ['NE', 'NE3'], ['TE', 'TE17']],
    note: 'Long underground transfer between EW and NE. Budget 4 min.',
    arr: [
      { s: 'NE', d: 'to HarbourFront', p: 240, o: 150, l: 1 },
      { s: 'EW', d: 'to Pasir Ris', p: 200, o: 20, l: 2 },
    ],
  },
  {
    id: 'harbourfront', name: 'HarbourFront', kind: 'mrt', lat: 1.2653, lng: 103.8220, sh: 2,
    codes: [['NE', 'NE1'], ['CC', 'CC29']],
    note: 'Covered link straight into the VivoCity basement. No umbrella needed.',
    arr: [
      { s: 'NE', d: 'to Punggol Coast', p: 240, o: 10, l: 0 },
      { s: 'CC', d: 'to Dhoby Ghaut', p: 300, o: 140, l: 0 },
    ],
  },
  {
    id: 'b-smu', name: 'Opp SMU', kind: 'bus', code: '04121', lat: 1.2958, lng: 103.8496, sh: 2,
    note: 'The shelter fits about 20 people. When it pours, the queue spills onto the open walkway.',
    arr: [
      { s: '7', d: 'to Clementi Int', p: 420, o: 160, l: 2 },
      { s: '171', d: 'to Yishun Int', p: 540, o: 525, l: 1 },
      { s: '80', d: 'to HarbourFront Int', p: 600, o: 330, l: 0 },
      { s: '57', d: 'to HarbourFront Int', p: 480, o: 60, l: 1 },
    ],
  },
  {
    id: 'b-bugis', name: 'Bugis Junction', kind: 'bus', code: '01119', lat: 1.2996, lng: 103.8550, sh: 0,
    note: 'The shelter covers only half the usual queue. Stand near the pillar to keep dry.',
    arr: [
      { s: '7', d: 'to Clementi Int', p: 420, o: 100, l: 3 },
      { s: '175', d: 'to Clementi Int', p: 600, o: 300, l: 1 },
      { s: '960', d: 'to Woodlands Int', p: 480, o: 440, l: 2 },
    ],
  },
  {
    id: 'b-orchard', name: 'Lucky Plaza', kind: 'bus', code: '09048', lat: 1.3043, lng: 103.8340, sh: 1,
    note: 'Covered, but the kerb floods quickly in heavy rain.',
    arr: [
      { s: '7', d: 'to Clementi Int', p: 420, o: 300, l: 2 },
      { s: '171', d: 'to Yishun Int', p: 540, o: 200, l: 1 },
      { s: '190', d: 'to Choa Chu Kang', p: 480, o: 90, l: 3 },
    ],
  },
  {
    id: 'b-clarke', name: 'Clarke Quay Stn', kind: 'bus', code: '04222', lat: 1.2887, lng: 103.8472, sh: 1,
    note: 'Partial cover. The riverside approach is exposed.',
    arr: [
      { s: '51', d: 'to Jurong East', p: 540, o: 50, l: 1 },
      { s: '124', d: "to St Michael's", p: 600, o: 320, l: 0 },
      { s: '174', d: 'to Boon Lay', p: 480, o: 120, l: 2 },
    ],
  },
  {
    id: 'b-vivo', name: 'VivoCity', kind: 'bus', code: '14141', lat: 1.2647, lng: 103.8230, sh: 2,
    note: 'Fully covered drop-off right at the mall entrance.',
    arr: [
      { s: '80', d: 'to Sims Pl', p: 600, o: 250, l: 0 },
      { s: '57', d: 'to Bishan Int', p: 480, o: 160, l: 1 },
      { s: '10', d: 'to Tampines Int', p: 540, o: 400, l: 1 },
    ],
  },
  {
    id: 'b-telok', name: 'Opp Seah Im Food Ctr', kind: 'bus', code: '14271', lat: 1.2670, lng: 103.8203, sh: 0,
    note: 'Unsheltered pole stop. The nearest cover is the food centre, 60 m away.',
    arr: [
      { s: '57', d: 'to HarbourFront Int', p: 480, o: 200, l: 1 },
      { s: '65', d: 'to Tampines Int', p: 600, o: 100, l: 2 },
      { s: '143', d: 'to Toa Payoh Int', p: 540, o: 380, l: 0 },
    ],
  },
];

// Places that reports and saved routes use, but that the map does not show.
export const extraPlaces = [
  { id: 'bishan', name: 'Bishan', codes: [['NS', 'NS17'], ['CC', 'CC15']] },
  { id: 'payalebar', name: 'Paya Lebar', codes: [['EW', 'EW8'], ['CC', 'CC9']] },
  { id: 'changi', name: 'Changi Airport', codes: [['CG', 'CG2']] },
  { id: 'tampines', name: 'Tampines Hub', code: '75009' },
  { id: 'jurong', name: 'Jurong East', codes: [['NS', 'NS1'], ['EW', 'EW24']] },
];

// Trip end points that the map marks (the demo trip is SMU to VivoCity).
export const tripPoints = {
  origin: { name: 'SMU', lat: 1.2963, lng: 103.8502 },
  dest: { name: 'VivoCity', lat: 1.2643, lng: 103.8222 },
};

// Nearby stops for the demo origin, with walking distance.
export const nearbyStops = [
  { id: 'b-smu', dist: '60 m' },
  { id: 'brasbasah', dist: '180 m' },
  { id: 'dhoby', dist: '450 m' },
  { id: 'cityhall', dist: '400 m' },
];

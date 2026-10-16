// Route options SMU to VivoCity, from the mockup ROUTES table.
// dur = minutes, tr = transfers, walk = metres, exp = minutes of rain exposure.
// legs = the leg bar on a route card. k is 'walk', 'bus', or an MRT line code. m = minutes.
// next = the first departure: p period (s), o offset (s).
// segs = hand-traced map lines as [lat, lng] points. k is 'walk', 'bus', or 'rail' (with line l).
// wet = map markers for walks that are exposed to rain.
export const routes = [
  {
    id: 'ne', name: 'NE Line direct', via: 'Walk, Dhoby Ghaut, HarbourFront',
    dur: 22, tr: 0, walk: 520, exp: 4, fare: '$1.39',
    legs: [{ k: 'walk', m: 5, wet: true }, { k: 'NE', m: 13 }, { k: 'walk', m: 4 }],
    next: { label: 'NE train · Dhoby Ghaut', p: 240, o: 40 },
    segs: [
      { k: 'walk', pts: [[1.2963, 103.8502], [1.2978, 103.8481], [1.2993, 103.8455]] },
      { k: 'rail', l: 'NE', pts: [[1.2993, 103.8455], [1.2884, 103.8466], [1.2844, 103.8440], [1.2803, 103.8395], [1.2653, 103.8220]] },
      { k: 'walk', pts: [[1.2653, 103.8220], [1.2648, 103.8224], [1.2643, 103.8222]] },
    ],
    wet: [[1.2978, 103.8481]],
  },
  {
    id: 'bus80', name: 'Bus 80 direct', via: 'Opp SMU to VivoCity, one seat',
    dur: 36, tr: 0, walk: 150, exp: 1, fare: '$1.29',
    legs: [{ k: 'walk', m: 2 }, { k: 'bus', n: '80', m: 32 }, { k: 'walk', m: 2 }],
    next: { label: 'Bus 80 · Opp SMU', p: 600, o: 330 },
    segs: [
      { k: 'walk', pts: [[1.2963, 103.8502], [1.2958, 103.8496]] },
      { k: 'bus', pts: [[1.2958, 103.8496], [1.2930, 103.8530], [1.2887, 103.8472], [1.2840, 103.8445], [1.2803, 103.8395], [1.2740, 103.8330], [1.2647, 103.8230]] },
      { k: 'walk', pts: [[1.2647, 103.8230], [1.2643, 103.8222]] },
    ],
    wet: [],
  },
  {
    id: 'ewne', name: 'EW + NE via Outram', via: 'City Hall, Outram Park, HarbourFront',
    dur: 26, tr: 1, walk: 640, exp: 6, fare: '$1.39',
    legs: [{ k: 'walk', m: 6, wet: true }, { k: 'EW', m: 8 }, { k: 'NE', m: 8 }, { k: 'walk', m: 4 }],
    next: { label: 'EW train · City Hall', p: 200, o: 60 },
    segs: [
      { k: 'walk', pts: [[1.2963, 103.8502], [1.2947, 103.8514], [1.2931, 103.8520]] },
      { k: 'rail', l: 'EW', pts: [[1.2931, 103.8520], [1.2840, 103.8515], [1.2765, 103.8455], [1.2803, 103.8395]] },
      { k: 'rail', l: 'NE', pts: [[1.2803, 103.8395], [1.2653, 103.8220]] },
      { k: 'walk', pts: [[1.2653, 103.8220], [1.2648, 103.8224], [1.2643, 103.8222]] },
    ],
    wet: [[1.2947, 103.8514]],
  },
  {
    id: 'b57', name: 'Bus 57 + walk', via: 'Opp SMU, Telok Blangah Rd, walk',
    dur: 29, tr: 0, walk: 820, exp: 9, fare: '$1.19',
    legs: [{ k: 'walk', m: 2 }, { k: 'bus', n: '57', m: 19 }, { k: 'walk', m: 8, wet: true }],
    next: { label: 'Bus 57 · Opp SMU', p: 480, o: 60 },
    segs: [
      { k: 'walk', pts: [[1.2963, 103.8502], [1.2958, 103.8496]] },
      { k: 'bus', pts: [[1.2958, 103.8496], [1.2887, 103.8472], [1.2803, 103.8395], [1.2730, 103.8300], [1.2690, 103.8240], [1.2670, 103.8203]] },
      { k: 'walk', pts: [[1.2670, 103.8203], [1.2657, 103.8210], [1.2643, 103.8222]] },
    ],
    wet: [[1.2657, 103.8210]],
  },
];

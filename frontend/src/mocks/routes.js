// Route options SMU -> VivoCity, from the mockup ROUTES table.
// dur = minutes, tr = transfers, walk = metres, exp = minutes of rain exposure.
export const routes = [
  { id: 'ne', name: 'NE Line direct', via: 'Walk, Dhoby Ghaut, HarbourFront', dur: 22, tr: 0, walk: 520, exp: 4, fare: '$1.39', legs: ['walk', 'NE', 'walk'] },
  { id: 'bus80', name: 'Bus 80 direct', via: 'Opp SMU to VivoCity, one seat', dur: 36, tr: 0, walk: 150, exp: 1, fare: '$1.29', legs: ['walk', '80', 'walk'] },
  { id: 'ewne', name: 'EW + NE via Outram', via: 'City Hall, Outram Park, HarbourFront', dur: 26, tr: 1, walk: 640, exp: 6, fare: '$1.39', legs: ['walk', 'EW', 'NE', 'walk'] },
  { id: 'b57', name: 'Bus 57 + walk', via: 'Opp SMU, Telok Blangah Rd, walk', dur: 29, tr: 0, walk: 820, exp: 9, fare: '$1.19', legs: ['walk', '57', 'walk'] },
];

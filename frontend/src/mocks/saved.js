// Saved routes and alerts, from the mockup SAVED and ALERTS tables.
// legs = line codes for the leg bar ('walk' or an MRT line code).
// fc = forecast per weather condition: [text, icon, 1 if it warns].
export const savedRoutes = [
  {
    id: 's1', name: 'Morning commute', from: 'Tampines Hub', to: 'SMU / Bras Basah', when: 'Weekdays · 8:15 AM', dur: '41 min',
    legs: ['walk', 'EW', 'walk'],
    fc: { heavy: ['Showers 8–8:40 AM near Tampines', 'rainy', 1], light: ['Light showers possible', 'rainy', 1], clear: ['Dry · 31°C', 'sunny', 0] },
  },
  {
    id: 's2', name: 'Friday dinner', from: 'SMU / Bras Basah', to: 'VivoCity', when: 'Fridays · 6:30 PM', dur: '22 min',
    legs: ['walk', 'NE', 'walk'],
    fc: { heavy: ['Clearing by evening', 'partly_cloudy_day', 0], light: ['Clearing by evening', 'partly_cloudy_day', 0], clear: ['Dry all evening', 'sunny', 0] },
  },
  {
    id: 's3', name: 'Weekend gym', from: 'Bishan', to: 'Orchard', when: 'Saturdays · 11:00 AM', dur: '18 min',
    legs: ['NS'],
    fc: { heavy: ['Hazy sunshine', 'sunny', 0], light: ['Hazy sunshine', 'sunny', 0], clear: ['Hazy sunshine', 'sunny', 0] },
  },
  {
    id: 's4', name: 'Airport pickup', from: 'Dhoby Ghaut', to: 'Changi Airport', when: 'Occasional', dur: '52 min',
    legs: ['NS', 'EW', 'CG'],
    fc: { heavy: ['Thundery showers in the east', 'thunderstorm', 1], light: ['Cloudy', 'cloud', 0], clear: ['Dry', 'sunny', 0] },
  },
];

// Saved route ids that start pinned, and the routes with alerts on.
export const savedDefaults = {
  pinned: ['s1', 's2'],
  alertsOn: { s1: true, s2: true, s3: false, s4: false },
};

// act = the action button label. toast = the message after the action. route = the saved route id.
export const alerts = [
  {
    id: 'a1', icon: 'rainy', when: 'Tomorrow · Morning commute', route: 's1',
    title: 'Rain expected near your usual 8:15 AM commute',
    body: 'Showers over Tampines from 8:00 to 8:40 AM. Your 6-min walk to Tampines MRT is unsheltered, so bring an umbrella.',
    act: 'Leave 10 min later', toast: 'Done. Reminder moved to 8:25 AM.',
  },
  {
    id: 'a2', icon: 'schedule', when: 'Today · Friday dinner', route: 's2',
    title: 'Consider leaving 10 minutes later',
    body: 'Bus 7 is bunching at Opp SMU. The next one, 10 min behind, is emptier, and the rain at Bras Basah should ease by then.',
    act: 'Remind me in 10', toast: 'We will remind you in 10 min.',
  },
  {
    id: 'a3', icon: 'sunny', when: 'Saturday · Weekend gym', route: 's3',
    title: 'Saturday gym run looks dry',
    body: 'No rain forecast near Bishan or Orchard before noon.',
    act: 'Got it', toast: 'Enjoy the workout.',
  },
];

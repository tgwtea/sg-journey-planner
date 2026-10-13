// Saved routes and alerts, from the mockup SAVED and ALERTS tables.
export const savedRoutes = [
  { id: 's1', name: 'Morning commute', from: 'Tampines Hub', to: 'SMU / Bras Basah', when: 'Weekdays · 8:15 AM', dur: '41 min' },
  { id: 's2', name: 'Friday makan', from: 'SMU / Bras Basah', to: 'VivoCity', when: 'Fridays · 6:30 PM', dur: '22 min' },
  { id: 's3', name: 'Weekend gym', from: 'Bishan', to: 'Orchard', when: 'Saturdays · 11:00 AM', dur: '18 min' },
  { id: 's4', name: 'Fetch Mum', from: 'Dhoby Ghaut', to: 'Changi Airport', when: 'Occasional', dur: '52 min' },
];

export const alerts = [
  { id: 'a1', icon: 'rainy', when: 'Tomorrow · Morning commute', title: 'Rain expected near your usual 8:15 AM commute', body: 'Showers over Tampines from 8:00 to 8:40 AM. Your 6-min walk to Tampines MRT is unsheltered.' },
  { id: 'a2', icon: 'schedule', when: 'Today · Friday makan', title: 'Consider leaving 10 minutes later', body: 'Bus 7 is bunching at Opp SMU. The one 10 min behind is emptier.' },
  { id: 'a3', icon: 'sunny', when: 'Saturday · Weekend gym', title: 'Saturday gym run looks dry', body: 'No rain forecast near Bishan or Orchard before noon.' },
];

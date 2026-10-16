// Demo weather copy and rain zones per condition, from the mockup W and ZONES tables.
// bars = rain chance (%) for the next 60 min, in 5-min steps.
export const weatherCopy = {
  heavy: {
    title: 'Heavy rain around Bugis', temp: '26°', hl: 'H 30°  ·  L 25°  ·  94% humidity',
    sub: 'Heavy rain around Bugis and light rain near Orchard. Easing over Bras Basah by about 8:52 AM.',
    icon: 'thunderstorm', chip: 'Heavy rain around Bugis · easing ~8:52',
    bars: [96, 94, 90, 82, 70, 52, 38, 28, 20, 14, 10, 8],
  },
  light: {
    title: 'Light rain', temp: '27°', hl: 'H 31°  ·  L 25°  ·  88% humidity',
    sub: 'Drizzle near Bras Basah should clear in about 4 min. Orchard is also a bit wet.',
    icon: 'rainy', chip: 'Light rain near Bras Basah and Orchard',
    bars: [48, 44, 38, 30, 22, 16, 12, 9, 7, 6, 6, 5],
  },
  clear: {
    title: 'Fair and sunny', temp: '31°', hl: 'H 32°  ·  L 26°  ·  UV high',
    sub: 'No rain on your routes for the next hour.',
    icon: 'sunny', chip: 'No rain nearby · 31°C',
    bars: [4, 4, 3, 3, 3, 4, 5, 6, 8, 10, 12, 14],
  },
};

// Rain cells for the map. r = radius in metres. lvl = 'heavy' or 'light'.
export const rainZones = {
  heavy: [
    { lat: 1.2995, lng: 103.8548, r: 1500, lvl: 'heavy', label: 'Heavy rain · Bugis' },
    { lat: 1.3045, lng: 103.8312, r: 1050, lvl: 'light', label: 'Light rain · Orchard' },
  ],
  light: [
    { lat: 1.2978, lng: 103.8524, r: 1200, lvl: 'light', label: 'Light rain · Bras Basah' },
    { lat: 1.3045, lng: 103.8312, r: 950, lvl: 'light', label: 'Light rain · Orchard' },
  ],
  clear: [],
};

// All images and videos live here. Replace these URLs (or point them to /assets files) later.
// Photos: public placeholder service (picsum.photos). Video: MDN CC0 sample clip.
export const img = (seed: string, w = 900, h = 700) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const MEDIA = {
  heroVideo: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  heroPoster: img('admisk-hero', 1600, 400),
  cardBuild: img('admisk-build', 800, 1000),
  cardMarkets: img('admisk-markets', 800, 1000),
  cardInvest: img('admisk-invest', 800, 1000),
  panel: img('admisk-journey', 1400, 900),
  audience: img('admisk-audience', 900, 1000),
  about: img('admisk-about', 1200, 800),
  riyadh: img('riyadh', 800, 600),
  nairobi: img('nairobi', 800, 600),
  kampala: img('kampala', 800, 600),
  division: {
    'investment-advisory': img('div-invest', 1200, 800),
    'business-consultancy': img('div-consult', 1200, 800),
    'hr-staffing': img('div-hr', 1200, 800),
    'skills-training': img('div-training', 1200, 800),
    'hospitality': img('div-hospitality', 1200, 800),
    'import-export-trading': img('div-trade', 1200, 800),
  } as Record<string, string>,
};

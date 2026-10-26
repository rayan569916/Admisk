// Fixed Unsplash image URLs keep the imagery consistent between visits.
// Images are served by Unsplash's image CDN and can be replaced with local
// licensed assets at any time.
const photo = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=82`;

export const MEDIA = {
  heroVideo: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  heroPoster: photo('photo-1497366754035-f200968a6e72', 1600, 700),
  cardBuild: photo('photo-1521737711867-e3b97375f902', 800, 1000),
  cardMarkets: photo('photo-1497366811353-6870744d04b2', 800, 1000),
  cardInvest: photo('photo-1454165804606-c3d57bc86b40', 800, 1000),
  panel: photo('photo-1556761175-b413da4baf72', 1400, 900),
  team: photo('photo-1552664730-d307ca884978', 1400, 700),
  leadershipPortraits: [
    photo('photo-1500648767791-00dcc994a43e', 800, 1000),
    photo('photo-1506794778202-cad84cf45f1d', 800, 1000),
    photo('photo-1507003211169-0a1dd7228f2d', 800, 1000),
  ],
  riyadh: photo('photo-1512453979798-5ea266f8880c', 800, 600),
  nairobi: photo('photo-1516026672322-bc52d61a55d5', 800, 600),
  kampala: photo('photo-1605648916361-9bc12ad6a569', 800, 600),
  division: {
    'investment-advisory': photo('photo-1460925895917-afdab827c52f', 1200, 800),
    'business-consultancy': photo('photo-1556761175-b413da4baf72', 1200, 800),
    'hr-staffing': photo('photo-1521737711867-e3b97375f902', 1200, 800),
    'skills-training': photo('photo-1523240795612-9a054b0db644', 1200, 800),
    hospitality: photo('photo-1414235077428-338989a2e8c0', 1200, 800),
    'import-export-trading': photo('photo-1494412519320-aa613dfb7738', 1200, 800),
  } as Record<string, string>,
};

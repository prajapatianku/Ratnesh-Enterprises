import { TexturePattern } from '../types';

/**
 * Returns an inline SVG data URI or background style for high-definition tile patterns.
 * This ensures ultra-sharp, realistic rendering on cards and inside the room visualizer.
 */
export function getTileTextureSvg(
  pattern: TexturePattern,
  customImageUrl?: string,
  finish: string = 'High Gloss'
): string {
  if (customImageUrl && customImageUrl.trim().length > 0) {
    return customImageUrl;
  }

  switch (pattern) {
    case 'statuario':
      // Statuario Italian Marble: Crisp alabaster white with feathery grey veining
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">
          <defs>
            <linearGradient id="base" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fdfdfd"/>
              <stop offset="45%" stop-color="#f7f8fa"/>
              <stop offset="100%" stop-color="#f1f3f7"/>
            </linearGradient>
            <filter id="blurVein" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
            </filter>
            <linearGradient id="glossSheen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="white" stop-opacity="0.3"/>
              <stop offset="50%" stop-color="white" stop-opacity="0.05"/>
              <stop offset="100%" stop-color="white" stop-opacity="0.2"/>
            </linearGradient>
          </defs>
          <rect width="600" height="1200" fill="url(#base)"/>
          <!-- Primary Veins -->
          <path d="M -50,150 Q 120,280 240,410 T 380,720 T 520,980 T 650,1150" fill="none" stroke="#717a88" stroke-width="6" opacity="0.45" filter="url(#blurVein)"/>
          <path d="M -50,150 Q 120,280 240,410 T 380,720 T 520,980 T 650,1150" fill="none" stroke="#525b68" stroke-width="2.5" opacity="0.6"/>
          <!-- Secondary Feathery branches -->
          <path d="M 240,410 Q 320,380 430,420 Q 510,450 620,400" fill="none" stroke="#8993a4" stroke-width="3" opacity="0.35"/>
          <path d="M 380,720 Q 290,790 190,830 T 40,940" fill="none" stroke="#788190" stroke-width="3.5" opacity="0.3"/>
          <path d="M 120,280 Q 80,450 140,580" fill="none" stroke="#9aa3b2" stroke-width="2" opacity="0.35"/>
          <path d="M 50,50 Q 200,100 350,80" fill="none" stroke="#8c95a5" stroke-width="1.8" opacity="0.25"/>
          <rect width="600" height="1200" fill="url(#glossSheen)"/>
        </svg>
      `)}`;

    case 'calacatta_gold':
      // Calacatta Gold: Warm ivory canvas with dramatic grey & honey-gold veins
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">
          <defs>
            <linearGradient id="warmBase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fffdf8"/>
              <stop offset="50%" stop-color="#fdf9f0"/>
              <stop offset="100%" stop-color="#f7f2e5"/>
            </linearGradient>
            <filter id="softVein">
              <feGaussianBlur stdDeviation="2.5"/>
            </filter>
          </defs>
          <rect width="600" height="1200" fill="url(#warmBase)"/>
          <!-- Gold & Ochre Veins -->
          <path d="M -30,220 Q 180,260 320,490 T 420,850 T 650,1050" fill="none" stroke="#c89d53" stroke-width="7" opacity="0.55" filter="url(#softVein)"/>
          <path d="M -30,220 Q 180,260 320,490 T 420,850 T 650,1050" fill="none" stroke="#8a672f" stroke-width="2.5" opacity="0.75"/>
          <!-- Slate Grey Companion Veins -->
          <path d="M 20,180 Q 220,220 340,460 T 460,820" fill="none" stroke="#686e77" stroke-width="3" opacity="0.45"/>
          <path d="M 320,490 Q 200,560 110,640 T -20,780" fill="none" stroke="#b8934a" stroke-width="4" opacity="0.4"/>
          <path d="M 420,850 Q 480,950 560,980" fill="none" stroke="#c89d53" stroke-width="3" opacity="0.5"/>
          <path d="M 250,80 Q 380,140 520,110" fill="none" stroke="#7e8590" stroke-width="2" opacity="0.3"/>
        </svg>
      `)}`;

    case 'nero_marquina':
      // Nero Marquina: Deep Spanish black marble with crystalline white lightning fractures
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">
          <defs>
            <radialGradient id="darkDepth" cx="40%" cy="50%" r="70%">
              <stop offset="0%" stop-color="#1e2126"/>
              <stop offset="70%" stop-color="#101216"/>
              <stop offset="100%" stop-color="#0a0c0e"/>
            </radialGradient>
            <filter id="fissure">
              <feGaussianBlur stdDeviation="1"/>
            </filter>
          </defs>
          <rect width="600" height="1200" fill="url(#darkDepth)"/>
          <!-- Sharp crystalline fracture lines -->
          <path d="M 80,-40 L 190,180 L 160,260 L 320,440 L 290,560 L 450,820 L 430,950 L 580,1240" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.85" filter="url(#fissure)"/>
          <path d="M 80,-40 L 190,180 L 160,260 L 320,440 L 290,560 L 450,820 L 430,950 L 580,1240" fill="none" stroke="#e0e8f5" stroke-width="1.8" opacity="0.95"/>
          <!-- Splinter branches -->
          <path d="M 160,260 L 60,320 L 10,420" fill="none" stroke="#cad3e2" stroke-width="2" opacity="0.7"/>
          <path d="M 320,440 L 480,480 L 580,420" fill="none" stroke="#cbd5e1" stroke-width="2" opacity="0.75"/>
          <path d="M 450,820 L 340,900 L 220,950 L 180,1080" fill="none" stroke="#94a3b8" stroke-width="1.8" opacity="0.6"/>
          <path d="M 400,120 L 540,240" fill="none" stroke="#94a3b8" stroke-width="1.2" opacity="0.45"/>
        </svg>
      `)}`;

    case 'emerald_onyx':
      // Royal Aqua/Emerald Onyx: Translucent green-blue waves with amber caramel borders
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">
          <defs>
            <linearGradient id="onyxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0c2f30"/>
              <stop offset="35%" stop-color="#134e4a"/>
              <stop offset="70%" stop-color="#0f766e"/>
              <stop offset="100%" stop-color="#0d3b38"/>
            </linearGradient>
          </defs>
          <rect width="600" height="1200" fill="url(#onyxGrad)"/>
          <!-- Fluid swirling mineral bands -->
          <path d="M -50,200 C 180,150 220,380 400,420 S 550,700 650,850" fill="none" stroke="#2dd4bf" stroke-width="28" opacity="0.35"/>
          <path d="M -50,200 C 180,150 220,380 400,420 S 550,700 650,850" fill="none" stroke="#fbbf24" stroke-width="6" opacity="0.6"/>
          <path d="M 50,-50 C 150,250 120,450 350,680 S 480,1050 580,1250" fill="none" stroke="#5eead4" stroke-width="16" opacity="0.45"/>
          <path d="M 120,350 C 280,480 340,650 490,800" fill="none" stroke="#d97706" stroke-width="3" opacity="0.7"/>
          <circle cx="300" cy="500" r="180" fill="#14b8a6" opacity="0.15"/>
        </svg>
      `)}`;

    case 'botticino_beige':
      // Italian Botticino Beige: Soft warm biscuit cream with delicate fossilized clouds
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">
          <defs>
            <linearGradient id="beigeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f7f1e5"/>
              <stop offset="50%" stop-color="#ece2cd"/>
              <stop offset="100%" stop-color="#dfd3bc"/>
            </linearGradient>
          </defs>
          <rect width="600" height="1200" fill="url(#beigeGrad)"/>
          <path d="M -20,100 Q 150,200 320,180 T 620,320" fill="none" stroke="#baa787" stroke-width="4" opacity="0.45"/>
          <path d="M -40,550 Q 200,480 350,620 T 640,780" fill="none" stroke="#c7b697" stroke-width="6" opacity="0.4"/>
          <path d="M 80,750 Q 240,920 450,960 T 620,1120" fill="none" stroke="#a39070" stroke-width="3.5" opacity="0.5"/>
          <circle cx="240" cy="350" r="80" fill="#baa787" opacity="0.08"/>
          <circle cx="480" cy="850" r="120" fill="#baa787" opacity="0.08"/>
        </svg>
      `)}`;

    case 'rustic_concrete':
      // Urban Micro-Cement / Concrete Slate
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">
          <defs>
            <linearGradient id="slateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#474e57"/>
              <stop offset="50%" stop-color="#373c43"/>
              <stop offset="100%" stop-color="#2a2e34"/>
            </linearGradient>
          </defs>
          <rect width="600" height="1200" fill="url(#slateGrad)"/>
          <!-- Industrial textured micro-cement noise / trowel marks -->
          <path d="M 0,250 Q 300,220 600,280" fill="none" stroke="#5b6470" stroke-width="8" opacity="0.25"/>
          <path d="M 0,600 Q 250,640 600,580" fill="none" stroke="#23262a" stroke-width="12" opacity="0.3"/>
          <path d="M 0,920 Q 350,880 600,940" fill="none" stroke="#555d68" stroke-width="6" opacity="0.25"/>
          <line x1="120" y1="0" x2="120" y2="1200" stroke="#5f6874" stroke-width="1.5" stroke-dasharray="2 18" opacity="0.3"/>
          <line x1="420" y1="0" x2="420" y2="1200" stroke="#202226" stroke-width="1.5" stroke-dasharray="3 24" opacity="0.4"/>
        </svg>
      `)}`;

    case 'terrazzo':
      // Mediterranean Terrazzo with mineral chips
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
          <rect width="600" height="600" fill="#f4efe6"/>
          <!-- Terrazzo specks & chips -->
          <polygon points="60,80 85,90 70,110 50,95" fill="#c06c54" opacity="0.85"/>
          <polygon points="180,40 210,55 195,75 165,60" fill="#2d4059" opacity="0.8"/>
          <polygon points="340,70 370,80 365,115 330,95" fill="#deb887" opacity="0.9"/>
          <polygon points="490,90 520,70 535,100 500,115" fill="#50665b" opacity="0.8"/>
          
          <polygon points="120,220 150,210 160,245 130,250" fill="#c06c54" opacity="0.75"/>
          <polygon points="260,190 295,205 285,235 245,215" fill="#303841" opacity="0.85"/>
          <polygon points="420,230 450,220 460,260 415,255" fill="#c9975b" opacity="0.8"/>
          <polygon points="540,240 565,225 580,255 550,270" fill="#2e4057" opacity="0.7"/>

          <polygon points="40,380 75,370 85,410 45,415" fill="#c9975b" opacity="0.8"/>
          <polygon points="190,360 220,380 205,415 175,395" fill="#50665b" opacity="0.85"/>
          <polygon points="320,390 355,375 370,410 330,425" fill="#c06c54" opacity="0.8"/>
          <polygon points="480,370 515,390 495,430 465,405" fill="#303841" opacity="0.8"/>

          <polygon points="90,520 120,540 100,570 70,550" fill="#2e4057" opacity="0.8"/>
          <polygon points="250,500 280,515 270,555 235,535" fill="#c06c54" opacity="0.75"/>
          <polygon points="390,520 425,505 440,545 400,560" fill="#c9975b" opacity="0.85"/>
          <polygon points="530,510 565,530 545,565 515,545" fill="#50665b" opacity="0.8"/>
          
          <!-- tiny flecks -->
          <circle cx="150" cy="140" r="5" fill="#333" opacity="0.6"/>
          <circle cx="310" cy="120" r="4" fill="#c06c54" opacity="0.6"/>
          <circle cx="450" cy="140" r="6" fill="#c9975b" opacity="0.6"/>
          <circle cx="100" cy="300" r="4" fill="#50665b" opacity="0.6"/>
          <circle cx="280" cy="310" r="5" fill="#303841" opacity="0.6"/>
          <circle cx="430" cy="330" r="4" fill="#c06c54" opacity="0.6"/>
          <circle cx="220" cy="460" r="6" fill="#c9975b" opacity="0.6"/>
          <circle cx="360" cy="480" r="5" fill="#2e4057" opacity="0.6"/>
        </svg>
      `)}`;

    case 'chevron_wood':
      // Natural Teak & Oak Wood Plank
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
          <defs>
            <linearGradient id="wood1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#b6814b"/>
              <stop offset="50%" stop-color="#9d6935"/>
              <stop offset="100%" stop-color="#805123"/>
            </linearGradient>
            <linearGradient id="wood2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#a6723c"/>
              <stop offset="50%" stop-color="#8c5b29"/>
              <stop offset="100%" stop-color="#72461c"/>
            </linearGradient>
          </defs>
          <rect width="600" height="600" fill="#6d4218"/>
          <!-- Chevron Wood Layout -->
          <polygon points="0,0 300,150 300,250 0,100" fill="url(#wood1)"/>
          <polygon points="600,0 300,150 300,250 600,100" fill="url(#wood2)"/>
          <polygon points="0,150 300,300 300,400 0,250" fill="url(#wood2)"/>
          <polygon points="600,150 300,300 300,400 600,250" fill="url(#wood1)"/>
          <polygon points="0,300 300,450 300,550 0,400" fill="url(#wood1)"/>
          <polygon points="600,300 300,450 300,550 600,400" fill="url(#wood2)"/>
          <polygon points="0,450 300,600 300,700 0,550" fill="url(#wood2)"/>
          <polygon points="600,450 300,600 300,700 600,550" fill="url(#wood1)"/>
          <!-- Fine wood grain lines -->
          <line x1="0" y1="20" x2="300" y2="170" stroke="#54300e" stroke-width="1" opacity="0.35"/>
          <line x1="0" y1="50" x2="300" y2="200" stroke="#cfa16f" stroke-width="1" opacity="0.3"/>
          <line x1="600" y1="20" x2="300" y2="170" stroke="#54300e" stroke-width="1" opacity="0.35"/>
        </svg>
      `)}`;

    case 'moroccan_blue':
      // Moroccan Encaustic / Mediterranean Blue geometric tile
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
          <rect width="600" height="600" fill="#f8fafc"/>
          <rect x="20" y="20" width="560" height="560" fill="none" stroke="#0284c7" stroke-width="4"/>
          <!-- Star mandala pattern -->
          <circle cx="300" cy="300" r="160" fill="#e0f2fe" stroke="#0369a1" stroke-width="5"/>
          <circle cx="300" cy="300" r="70" fill="#0284c7" stroke="#075985" stroke-width="4"/>
          <circle cx="300" cy="300" r="25" fill="#f8fafc"/>
          <!-- 8-point geometric petals -->
          <polygon points="300,160 330,240 410,240 350,290 380,370 300,320 220,370 250,290 190,240 270,240" fill="#0284c7" opacity="0.85"/>
          <!-- Corner flourishes -->
          <path d="M 20,20 Q 120,60 120,120 Q 60,120 20,20" fill="#0369a1"/>
          <path d="M 580,20 Q 480,60 480,120 Q 540,120 580,20" fill="#0369a1"/>
          <path d="M 20,580 Q 120,540 120,480 Q 60,480 20,580" fill="#0369a1"/>
          <path d="M 580,580 Q 480,540 480,480 Q 540,480 580,580" fill="#0369a1"/>
        </svg>
      `)}`;

    case 'armani_brown':
      // Armani Luxury Bronze Brown Marble
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">
          <defs>
            <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3c2f27"/>
              <stop offset="50%" stop-color="#2a201a"/>
              <stop offset="100%" stop-color="#1c1511"/>
            </linearGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="2"/>
            </filter>
          </defs>
          <rect width="600" height="1200" fill="url(#bronzeGrad)"/>
          <path d="M -30,120 Q 180,280 340,540 T 450,920 T 640,1180" fill="none" stroke="#d4af37" stroke-width="4.5" opacity="0.65" filter="url(#softGlow)"/>
          <path d="M -30,120 Q 180,280 340,540 T 450,920 T 640,1180" fill="none" stroke="#f5e1a4" stroke-width="1.8" opacity="0.8"/>
          <path d="M 340,540 Q 220,620 90,710 T -20,860" fill="none" stroke="#d4af37" stroke-width="3" opacity="0.5"/>
          <path d="M 120,180 Q 280,220 480,180" fill="none" stroke="#a8894d" stroke-width="2" opacity="0.45"/>
          <path d="M 450,920 Q 520,990 620,1010" fill="none" stroke="#d4af37" stroke-width="2.5" opacity="0.55"/>
        </svg>
      `)}`;

    default:
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">
          <rect width="600" height="1200" fill="#f8fafc"/>
          <path d="M 50,100 Q 250,400 450,800 T 550,1100" fill="none" stroke="#cbd5e1" stroke-width="3"/>
        </svg>
      `)}`;
  }
}

/**
 * Echo Music Fluid Motion System
 * Spring physics parameters replacing rigid mechanical tweens with natural momentum and damping.
 */

export const fluidSprings = {
  // Snappy yet organic spring for cards, buttons, play toggles, and popups
  snappy: {
    type: 'spring' as const,
    stiffness: 420,
    damping: 24,
    mass: 0.8,
  },

  // Ultra-smooth spring for sheet expands, navigation, and player transforms
  spatial: {
    type: 'spring' as const,
    stiffness: 240,
    damping: 28,
    mass: 1,
  },

  // Gentle spring for alpha fades, ambient glows, and color transitions
  gentle: {
    type: 'spring' as const,
    stiffness: 140,
    damping: 20,
    mass: 1,
  },

  // Dynamic spring for synchronized lyric transitions
  lyrics: {
    type: 'spring' as const,
    stiffness: 320,
    damping: 26,
    mass: 0.9,
  },

  // Tactile bounce scale for pressed states
  pressTap: {
    scale: 0.94,
    transition: {
      type: 'spring' as const,
      stiffness: 500,
      damping: 20,
    },
  },
  
  // Card hover lift
  hoverLift: {
    y: -4,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

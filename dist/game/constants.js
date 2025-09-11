// Game dimensions and constants
export const GAME_WIDTH = 1600; // Largeur fixe
export const GAME_HEIGHT = 900; // Hauteur fixe (ratio 16:9)
// Tunable game geometry - change these to adjust platform collision behaviour
export const PLATFORM_WIDTH_RATIO = 0.60; // fraction of GAME_WIDTH
export const PLATFORM_HEIGHT_RATIO = 0.22; // fraction of GAME_HEIGHT (visual height)
export const SPIKES_HEIGHT_RATIO = 0.10; // fraction of GAME_HEIGHT
export const SPIKES_VERTICAL_OFFSET_MULT = 2.2; // how far above spikes the platform sits
export const PLATFORM_LANDING_TOLERANCE = 6; // pixels tolerance when landing on platform
export const PLATFORM_TOP_ATTACHMENT_DEPTH = 12; // maximum px below top to still be considered attached
export const EDGE_FORGIVENESS = 15; // Allow feet to hang over edge by this many pixels
// Physics constants
export const PLAYER_SPEED = 5;
export const GRAVITY = 1.8;
// Collision hitbox configuration
export const COLLISION_BOX_WIDTH = 90; // MUCH wider hitbox to prevent early falls
export const RIGHT_BIAS = 5; // Bias the hitbox slightly toward right side
// Animation timing
export const FRAME_CHANGE_DELAY = 6;
export const DEATH_EXTRA_PAUSE = 20;
// Compute platform geometry
export const computedPlatWidth = GAME_WIDTH * PLATFORM_WIDTH_RATIO;
export const computedSpikesHeight = GAME_HEIGHT * SPIKES_HEIGHT_RATIO;
export const computedPlatHeight = GAME_HEIGHT * PLATFORM_HEIGHT_RATIO;
export const computedPlatX = (GAME_WIDTH - computedPlatWidth) / 2;
export const computedPlatY = GAME_HEIGHT - computedSpikesHeight * SPIKES_VERTICAL_OFFSET_MULT;

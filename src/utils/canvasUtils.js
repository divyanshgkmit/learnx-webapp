/**
 * Canvas utility functions for InteractiveDotBackground
 */

// Configuration constants
export const CANVAS_CONFIG = {
  DOT_SPACING: 25,
  BASE_OPACITY_MIN: 0.40,
  BASE_OPACITY_MAX: 0.50,
  BASE_RADIUS: 1,
  INTERACTION_RADIUS: 150,
  OPACITY_BOOST: 0.6,
  RADIUS_BOOST: 2.5
};

/**
 * Calculate grid cell size for spatial partitioning
 */
export const getGridCellSize = (interactionRadius) => {
  return Math.max(50, Math.floor(interactionRadius / 1.5));
};

/**
 * Handle mouse movement and update position relative to canvas
 */
export const handleMouseMove = (event, canvasRef, mousePositionRef) => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const canvasX = event.clientX - rect.left;
  const canvasY = event.clientY - rect.top;
  mousePositionRef.current = { x: canvasX, y: canvasY };
};

/**
 * Create dots array with grid optimization
 */
export const createDots = (width, height, config, gridCellSize) => {
  if (width === 0 || height === 0) return { dots: [], grid: {} };

  const { DOT_SPACING, BASE_OPACITY_MIN, BASE_OPACITY_MAX, BASE_RADIUS } = config;
  const newDots = [];
  const newGrid = {};
  const cols = Math.ceil(width / DOT_SPACING);
  const rows = Math.ceil(height / DOT_SPACING);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * DOT_SPACING + DOT_SPACING / 2;
      const y = j * DOT_SPACING + DOT_SPACING / 2;
      const cellX = Math.floor(x / gridCellSize);
      const cellY = Math.floor(y / gridCellSize);
      const cellKey = `${cellX}_${cellY}`;

      if (!newGrid[cellKey]) newGrid[cellKey] = [];
      newGrid[cellKey].push(newDots.length);

      const baseOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
      newDots.push({
        x, y,
        baseColor: `rgba(59, 130, 246, ${BASE_OPACITY_MAX})`,
        targetOpacity: baseOpacity,
        currentOpacity: baseOpacity,
        opacitySpeed: (Math.random() * 0.005) + 0.002,
        baseRadius: BASE_RADIUS,
        currentRadius: BASE_RADIUS,
      });
    }
  }
  
  return { dots: newDots, grid: newGrid };
};
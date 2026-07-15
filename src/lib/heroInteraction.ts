// Shared mutable state between the DOM drag hotspot in Hero and the
// R3F knot in FloatingWireframe - module-level so no React re-renders
// happen on pointer moves.
export const knotSpin = { vx: 0, vy: 0, dragging: false };

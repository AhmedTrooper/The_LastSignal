/** Deliberately simplified gameplay units, NOT reconstructed Apollo telemetry. */
export type LandingState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fuel: number;
  status: "ready" | "flying" | "landed" | "retry";
  reason: string;
};

export const LANDING_ZONE = { x: 12, halfWidth: 4 };
export const BOULDERS = [-10, -6, -1, 3];
export const initialLanding = (): LandingState => ({ x: -15, y: 22, vx: 1.2, vy: -0.6, fuel: 100, status: "ready", reason: "Find the clear patch beyond the boulders." });

export function stepLanding(state: LandingState, throttle: number, steering: number, elapsed: number): LandingState {
  if (state.status !== "flying") return state;
  const dt = Math.max(0, Math.min(0.05, elapsed));
  const thrust = state.fuel > 0 ? Math.max(0, Math.min(100, throttle)) / 100 : 0;
  const direction = Math.max(-1, Math.min(1, steering));
  const fuel = Math.max(0, state.fuel - thrust * 2 * dt);
  const vx = state.vx + (direction * thrust * 1.6 - state.vx * 0.025) * dt;
  const vy = state.vy + (thrust * 1.5 - 0.8) * dt;
  const x = state.x + vx * dt;
  const y = state.y + vy * dt;
  if (x < -28 || x > 30 || y > 38) return { ...state, x, y, vx, vy, fuel, status: "retry", reason: "You left the approach. Reset and try a smaller correction." };
  if (y <= 0) {
    const clear = Math.abs(x - LANDING_ZONE.x) <= LANDING_ZONE.halfWidth;
    const gentle = Math.abs(vy) <= 1.2 && Math.abs(vx) <= 0.8;
    return { x, y: 0, vx, vy, fuel, status: clear && gentle ? "landed" : "retry", reason: !clear ? "The ground here is rough. Aim for the lit clear patch." : !gentle ? "You reached clear ground, but too fast. Brake sideways and soften the descent." : "Contact light. You found clear ground and touched down gently." };
  }
  return { x, y, vx, vy, fuel, status: "flying", reason: state.reason };
}

import type { Story } from "./types";

/**
 * LCROSS (COSPAR: 2009-031B/C)
 * Deliberate kinetic impact into Cabeus crater discovering water ice on the Moon.
 * Sourced directly from NASA NSSDCA, Science Magazine (Colaprete et al. 2010), and LROC M119827295RE.
 */
export const LCROSS: Story = {
  slug: "lcross",
  title: "LCROSS",
  lede: "Slammed into the permanent shadows of the lunar South Pole at 9,000 km/h. Its 10-km dust plume proved pure water ice was hiding on the Moon.",
  scenes: [
    {
      id: "title",
      year: 2009,
      date: "NASA LCROSS Mission · 2009",
      title: "LCROSS",
      text: "At the Moon's South Pole lie craters where sunlight hasn't touched for over two billion years. At 40 Kelvin (-233°C), these craters are the coldest places in the entire solar system—and giant natural iceboxes.",
      image: "lcross",
      from: { s: 1.4, x: 0.5, y: 0.4 },
      to: { s: 1, x: 0.5, y: 0.5 },
      len: 1.2,
    },
    {
      id: "launch",
      year: 2009,
      date: "18 June 2009 · Cape Canaveral SLC-41",
      title: "Atlas V launch with LRO",
      text: "Launched alongside the Lunar Reconnaissance Orbiter (LRO), LCROSS stayed attached to its massive Centaur rocket upper stage, swinging past the Moon to enter a 3-month polar cruise orbit.",
      image: "launch",
      from: { s: 1.1, x: 0.5, y: 0.5 },
      to: { s: 1.5, x: 0.6, y: 0.4 },
    },
    {
      id: "centaur-impact",
      year: 2009,
      date: "9 October 2009 · 11:31:19 UTC",
      title: "The 7.2 GJ kinetic explosion",
      text: "The 2,305 kg Centaur rocket hit the frozen floor of Cabeus crater at 2.5 km/s (9,000 km/h). Unleashing 7.2 GigaJoules of kinetic energy, it blasted a 20-meter crater and threw 350 tons of regolith into the sunlight.",
      image: "lcross",
      from: { s: 1.1, x: 0.5, y: 0.5 },
      to: { s: 1.5, x: 0.5, y: 0.5 },
      len: 1.2,
    },
    {
      id: "shepherding-dive",
      year: 2009,
      date: "T + 4 minutes · 11:35 UTC",
      title: "Flying through the water plume",
      text: "Trailing 4 minutes behind, the Shepherding Spacecraft flew directly through the sunlit ejecta plume. Its infrared spectrometers caught distinct absorption dips at 1.4 µm and 1.9 µm—the unmistakable molecular fingerprint of water.",
      image: "lcross",
      from: { s: 1.3, x: 0.5, y: 0.6 },
      to: { s: 1, x: 0.5, y: 0.5 },
    },
    {
      id: "water-discovery",
      year: 2009,
      date: "155 kilograms of water ice",
      title: "Water on the Moon",
      text: "LCROSS measured 155 kilograms of pure water vapor and ice—about 5.6% of the excavated soil. Along with water, it found methane, ammonia, and hydrogen: a primordial cocktail left by billions of years of comets.",
      image: "lcross",
      from: { s: 1.1, x: 0.5, y: 0.5 },
      to: { s: 1.4, x: 0.5, y: 0.4 },
    },
    {
      id: "monument",
      year: 2009,
      date: "LROC Frame M119827295RE",
      title: "Resting in Cabeus Crater",
      text: "Moments after sending its final spectra, the Shepherding Spacecraft joined the Centaur on the dark floor of Cabeus crater. Their twin impact craters remain preserved forever in eternal shadow.",
      image: "lcross",
      from: { s: 1.4, x: 0.5, y: 0.5 },
      to: { s: 1, x: 0.5, y: 0.5 },
      len: 1.2,
    },
  ],
  sources: [
    { label: "NASA NSSDCA Master Record: LCROSS (2009-031B)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2009-031B" },
    { label: "Science Magazine: Detection of Water in the LCROSS Ejecta Plume", url: "https://www.science.org/doi/10.1126/science.1186986" },
    { label: "LROC: LCROSS Impact Site in Cabeus (M119827295RE)", url: "https://www.lroc.asu.edu/featured_sites/view_site/28" },
  ],
};

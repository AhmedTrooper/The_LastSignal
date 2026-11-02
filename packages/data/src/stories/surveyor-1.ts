import type { Story } from "./types";

/**
 * Surveyor 1 (COSPAR: 1966-045A)
 * First US soft landing on another celestial body.
 * Sourced directly from NASA NSSDCA, NASA SP-126, and LROC frame M175357472R.
 */
export const SURVEYOR_1: Story = {
  slug: "surveyor-1",
  title: "Surveyor 1",
  lede: "The machine that proved the Moon was solid. It touched down in the Ocean of Storms, survived a 14-day lunar night, and woke up to send pictures again.",
  scenes: [
    {
      id: "title",
      year: 1966,
      date: "NASA Project Surveyor · 1966 – 1967",
      title: "Surveyor 1",
      text: "Before Apollo astronauts could walk on the Moon, NASA had to solve a frightening puzzle: was the lunar surface hard rock, or a bottomless ocean of dust that would swallow a spaceship whole?",
      image: "surveyor-1",
      from: { s: 1.4, x: 0.5, y: 0.4 },
      to: { s: 1, x: 0.5, y: 0.5 },
      len: 1.2,
    },
    {
      id: "launch",
      year: 1966,
      date: "30 May 1966 · Cape Canaveral LC-36A",
      title: "Atlas-Centaur launch",
      text: "Surveyor 1 roared into the Florida morning sky aboard an Atlas-Centaur rocket—the very first operational test of liquid hydrogen high-energy upper stages.",
      image: "launch",
      from: { s: 1.1, x: 0.5, y: 0.5 },
      to: { s: 1.5, x: 0.6, y: 0.4 },
    },
    {
      id: "touchdown-hop",
      year: 1966,
      date: "2 June 1966 · 06:17:36 UTC",
      title: "Touchdown at Flamsteed P",
      text: "Retrorocket burned, vernier engines throttled down, and Surveyor 1 touched down in the Ocean of Storms at 3.4 m/s. Its shock-absorbing landing gear bounced 5 cm into the air before resting permanently.",
      image: "surveyor-1",
      from: { s: 1.1, x: 0.5, y: 0.5 },
      to: { s: 1.5, x: 0.5, y: 0.5 },
      len: 1.2,
    },
    {
      id: "footpad-proof",
      year: 1966,
      date: "Day 1 · 2 June 1966",
      title: "3.5 centimeters into the dust",
      text: "The TV camera pointed down at Footpad 2. The aluminum honeycomb pad had crushed just 3.5 centimeters into the lunar regolith. The Moon had a solid bearing capacity of 40 kPa. Apollo was safe to land.",
      image: "surveyor-1",
      from: { s: 1.3, x: 0.5, y: 0.7 },
      to: { s: 1, x: 0.5, y: 0.5 },
    },
    {
      id: "night-survival",
      year: 1966,
      date: "14 June – 6 July 1966",
      title: "Surviving the -150°C night",
      text: "The sun sank below the lunar horizon, plunging Surveyor into 14 continuous days of sub-zero darkness. When the sun finally rose again on July 6, the frozen solar cells warmed, and the lander woke back up to send 618 more photos.",
      image: "surveyor-1",
      from: { s: 1.2, x: 0.5, y: 0.5 },
      to: { s: 1.5, x: 0.5, y: 0.4 },
      len: 1.3,
    },
    {
      id: "resting-monument",
      year: 2009,
      date: "LROC Frame M175357472R",
      title: "Silent in the Ocean of Storms",
      text: "Today, Surveyor 1 still stands on its three landing pads in Flamsteed P. Photographed from 50 km orbit by the Lunar Reconnaissance Orbiter, its triangular shadow marks humanity's first peaceful foothold on the lunar frontier.",
      image: "surveyor-1",
      from: { s: 1.4, x: 0.5, y: 0.5 },
      to: { s: 1, x: 0.5, y: 0.5 },
      len: 1.2,
    },
  ],
  sources: [
    { label: "NASA NSSDCA Master Record: Surveyor 1 (1966-045A)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1966-045A" },
    { label: "NASA SP-126: Surveyor I - A Preliminary Report", url: "https://ntrs.nasa.gov/citations/19660022766" },
    { label: "LROC: Surveyor 1 at Flamsteed P (M175357472R)", url: "https://www.lroc.asu.edu/featured_sites/view_site/4" },
  ],
};

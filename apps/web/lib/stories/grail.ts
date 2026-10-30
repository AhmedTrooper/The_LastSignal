import type { Story } from "./types";

/**
 * GRAIL (COSPAR: 2011-046A/B) - Ebb & Flow
 * Tandem gravity mapping and the Sally K. Ride Impact Site.
 * Sourced directly from NASA NSSDCA, Science Magazine (Zuber et al. 2013), and LROC M1115786064R.
 */
export const GRAIL: Story = {
  slug: "grail",
  title: "GRAIL",
  lede: "Two twin spacecraft orbiting just miles above the craters, measuring each other with microwave precision. They mapped the Moon's gravity and fell together onto a mountain ridge.",
  scenes: [
    {
      id: "title",
      year: 2011,
      date: "NASA Discovery Program · 2011 – 2012",
      title: "GRAIL: Ebb & Flow",
      text: "To peer deep inside the Moon, NASA launched twin identical spacecraft. Named Ebb and Flow by fourth-grade students in Bozeman, Montana, they flew in tandem around the Moon like high-wire acrobats.",
      image: "grail",
      from: { s: 1.4, x: 0.5, y: 0.4 },
      to: { s: 1, x: 0.5, y: 0.5 },
      len: 1.2,
    },
    {
      id: "launch",
      year: 2011,
      date: "10 September 2011 · Cape Canaveral SLC-17B",
      title: "Delta II Heavy launch",
      text: "In the final flight of the Delta II Heavy rocket from Cape Canaveral, Ebb and Flow climbed toward space, traveling on a low-energy trajectory through the Earth-Moon Lagrange point.",
      image: "launch",
      from: { s: 1.1, x: 0.5, y: 0.5 },
      to: { s: 1.5, x: 0.6, y: 0.4 },
    },
    {
      id: "tandem-dance",
      year: 2012,
      date: "15 to 55 km Lunar Altitude",
      title: "The 0.02-micrometer microwave link",
      text: "Flying 75 to 225 kilometers apart, the twins beamed Ka-band microwaves back and forth. They could measure changes in their separation speed down to 0.02 micrometers per second—less than the width of a single red blood cell per second.",
      image: "grail",
      from: { s: 1.1, x: 0.5, y: 0.5 },
      to: { s: 1.5, x: 0.5, y: 0.5 },
      len: 1.2,
    },
    {
      id: "crust-discovery",
      year: 2012,
      date: "38-Kilometer Lunar Crust",
      title: "Rewriting lunar geology",
      text: "GRAIL revealed the Moon's crust was far thinner and more fractured than anyone realized—only 34 to 43 km thick, shattered by billions of years of impacts, and crisscrossed by 500-km-long magma dikes from an ancient thermal expansion.",
      image: "grail",
      from: { s: 1.3, x: 0.5, y: 0.6 },
      to: { s: 1, x: 0.5, y: 0.5 },
    },
    {
      id: "moonkam",
      year: 2012,
      date: "119,830 Student Photographs",
      title: "MoonKAM & Dr. Sally Ride",
      text: "Under the leadership of Dr. Sally Ride, over 100,000 middle school students requested and examined Moon images taken by cameras on Ebb and Flow. GRAIL gave the Moon's wonders directly to classrooms.",
      image: "grail",
      from: { s: 1.2, x: 0.5, y: 0.5 },
      to: { s: 1.5, x: 0.5, y: 0.4 },
    },
    {
      id: "sally-ride-impact",
      year: 2012,
      date: "17 December 2012 · 22:28 UTC",
      title: "Sally K. Ride Impact Site",
      text: "With fuel exhausted, Ebb and Flow crashed into a 2,500-meter mountain ridge near the lunar north pole at 6,050 km/h, thirty seconds apart. NASA named the site in eternal honor of Sally Ride.",
      image: "grail",
      from: { s: 1.4, x: 0.5, y: 0.5 },
      to: { s: 1, x: 0.5, y: 0.5 },
      len: 1.2,
    },
  ],
  sources: [
    { label: "NASA NSSDCA Master Record: GRAIL Ebb (2011-046A) & Flow (2011-046B)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-046A" },
    { label: "Science Magazine: Gravity Field of the Moon from GRAIL", url: "https://www.science.org/doi/10.1126/science.1231530" },
    { label: "LROC: Sally K. Ride Impact Site (M1115786064R)", url: "https://www.lroc.asu.edu/featured_sites/view_site/46" },
  ],
};

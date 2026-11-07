import type { ScrollEdition } from "./machine-scroll";
import { RANGER_BOOK } from "./machine-books/ranger";
import { RANGER_PHOTOS } from "./ranger-media";

export const RANGER_SCROLL_EDITION: ScrollEdition = {
  book: RANGER_BOOK,
  cover: RANGER_PHOTOS.cover,
  bookmarkKey: "rv:ranger-7:scroll:v1",
  theme: "moon",
  opening: {
    kicker: "Moon / Ranger 7 / 1964-041A",
    title: "I had to look",
    emphasis: "really closely.",
    introduction:
      "I had no landing legs. My cameras were my way of reaching the Moon.",
    invitation: "One thought at a time. Scroll to follow the fall.",
  },
  preface: {
    label: "Before impact",
    text: "Six cameras. Seventeen minutes. A one-way journey toward the Moon.",
  },
  ending:
    "The cameras are silent now. The pictures, and the crater they left, are still there.",
  directions: {
    "six-eyed-tower": {
      place: "Earth to the Moon",
      date: "1964",
      tone: "paper",
    },
    "six-failures": {
      place: "Cape Canaveral / Pasadena",
      date: "1961–1964",
      tone: "night",
    },
    "lucky-peanuts": {
      place: "Cape Canaveral to the Moon",
      date: "28–29 July 1964",
      tone: "paper",
    },
    "seventeen-minutes": {
      place: "Above the Moon",
      date: "31 July 1964",
      tone: "night",
      photographs: {
        0: RANGER_PHOTOS.firstImage,
        1: RANGER_PHOTOS.guericke,
      },
    },
    "mare-cognitum": {
      place: "Mare Cognitum",
      date: "31 July 1964 / later",
      tone: "night",
      photographs: {
        1: RANGER_PHOTOS.finalFrame,
        3: RANGER_PHOTOS.crater,
      },
    },
  },
};

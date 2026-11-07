import type { Photo } from "./photos";
import { SPIRIT_SOURCES as S } from "./spirit-sources";

/** Direct downloads observed on the source pages; never infer media from a PIA template. */
export const SPIRIT_PHOTOS = {
  cover: { name: "PIA04183", title: "Postcard above Tennessee Valley · August 2005", src: "https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia04/pia04183/PIA04183.jpg", source: S.summit.url, credit: "NASA/JPL-Caltech/Cornell", alt: "Spirit’s approximately true-color mini-panorama looks north from Husband Hill toward rocks and drifts in Tennessee Valley.", ai: false },
  grinding: { name: "PIA05223", title: "Adirondack’s freshly ground patch · 6 February 2004", src: "https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia05/pia05223/PIA05223.jpg", source: S.grinding.url, credit: "NASA/JPL/Cornell", alt: "Pancam photograph of a shallow circular patch ground into Adirondack, exposing its interior for inspection.", ai: false },
  earth: { name: "PIA05547", title: "Earth from Mars · Sol 63 · processed composite", src: "https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia05/pia05547/PIA05547.jpg", source: S.earth.url, credit: "NASA/JPL/Cornell/Texas A&M", alt: "A Navcam sky mosaic and contrast-enhanced Pancam image show Earth as a faint point, with an arrow and enlarged inset.", ai: false },
  goethite: { name: "PIA07104", title: "Clovis’s mineral signature · published December 2004", src: "https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia07/pia07104/PIA07104.jpg", source: S.goethite.url, credit: "NASA/JPL/University of Mainz", alt: "Published Mössbauer spectrum identifies the mineral goethite in Clovis; this is a scientific plot, not a photograph of water.", ai: false },
  silica: { name: "PIA09491", title: "Gertrude Weise · 6 May 2007 · approximate true color", src: "https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia09/pia09491/PIA09491.jpg", source: S.silica.url, credit: "NASA/JPL/Cornell", alt: "Pancam composite shows bright soil exposed by the dragged wheel; separate instrument measurements identified its high silica content.", ai: false },
  troy: { name: "PIA12142", title: "View from Troy · 28 April 2009 · Navcam mosaic", src: "https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia12/pia12142/PIA12142.jpg", source: S.troy.url, credit: "NASA/JPL-Caltech", alt: "Spirit’s wide navigation-camera mosaic shows disturbed ground and wheel tracks near Troy, with Husband Hill on the horizon.", ai: false },
  troySoil: { name: "PIA12078", title: "Troy’s soil · 29 April 2009 · false color", src: "https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia12/pia12078/PIA12078.jpg", source: S.troySoil.url, credit: "NASA/JPL-Caltech/Cornell University", alt: "A false-color Pancam composite emphasizes differences among soil exposed by Spirit’s sinking wheels.", ai: false },
} satisfies Record<string, Photo>;

export const SPIRIT_ARCHIVE = {
  dustDevils: {
    title: "Watch real dust devils cross Gusev", kind: "video", src: "/media/spirit/PIA04155.mp4",
    originalSrc: "https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia04/pia04155/PIA04155.gif",
    poster: "https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia04/pia04155/PIA04155.jpg",
    source: S.dustMovie.url, credit: "NASA/JPL/Texas A&M",
    description: "Spirit’s Navcam frames from July 13, 2005 cover 8 minutes 21 seconds. NASA enhanced moving features. This silent, accelerated sequence shows dust moving across the plain; it does not show a vortex cleaning Spirit. The original GIF is converted to a controllable MP4 without added sound or frames.",
  },
} as const;

export const SPIRIT_MODEL = { title: "NASA’s Spirit and Opportunity visualization model", source: S.model.url, src: "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/m/MER_static.glb", credit: "NASA Visualization Technology Applications and Development (VTAD)" } as const;

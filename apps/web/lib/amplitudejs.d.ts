/** The upstream package does not ship TypeScript declarations. */
declare module "amplitudejs" {
  type Amplitude = {
    init(config: {
      songs: { name: string; artist: string; url: string }[];
      preload: "none" | "metadata" | "auto";
      continue_next: boolean;
      volume?: number;
    }): void;
    getAudio(): HTMLAudioElement;
    pause(): void;
    stop(): void;
    setVolume(volume: number): void;
    setSongPlayedPercentage(percentage: number): void;
  };
  const amplitude: Amplitude;
  export default amplitude;
}

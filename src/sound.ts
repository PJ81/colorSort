export default class Sound {
  sounds: HTMLAudioElement[];
  muted: boolean;

  constructor(sndList: string[]) {
    this.sounds = new Array(sndList.length);
    this.muted = false;

    sndList.forEach((src, i) => {
      const snd: HTMLAudioElement = new Audio(src);
      snd.setAttribute("preload", "auto");
      snd.setAttribute("controls", "none");
      snd.style.display = "none";
      document.body.appendChild(snd);
      this.sounds[i] = snd;
    });
  }

  play(snd: number) {
    (!this.muted) && this.sounds[snd].play();
  }

  stop(snd: number) {
    this.sounds[snd].pause();
  }

  mute() {
    this.muted = !this.muted;
    return this.muted;
  }
}
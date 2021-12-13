<template>
  <div
    id="audio-player-container"
    ref="audioContainer"
    class="bg-gray-extra-light w-full p-10"
  >
    <div v-if="currentSong != null" class="flex">
      <audio
        ref="audioPlayer"
        :src="currentSong.url"
        preload="metadata"
      ></audio>
      <div class="w-full flex mr-8">
        <button
          id="play-icon"
          class="text-red w-16 mr-8"
          @click="handlePlayClick"
        >
          <svg
            v-if="isPlaying === true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="w-full h-full"
          >
            <path
              fill="currentColor"
              d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-16 328c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v160zm112 0c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v160z"
              class=""
            ></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              fill="currentColor"
              d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm115.7 272l-176 101c-15.8 8.8-35.7-2.5-35.7-21V152c0-18.4 19.8-29.8 35.7-21l176 107c16.4 9.2 16.4 32.9 0 42z"
            ></path>
          </svg>
        </button>
        <div class="flex items-center flex-1">
          <span
            id="current-time"
            ref="currentTime"
            class="time mx-4 font-medium"
            >0:00</span
          >
          <input
            id="seek-slider"
            ref="seekSlider"
            type="range"
            max="100"
            value="0"
            class="w-full"
          />
          <span id="duration" class="time ml-4 font-medium">0:00</span>
        </div>
      </div>
      <div class="flex items-center">
        <button
          id="mute-icon"
          class="mr-4 text-red flex justify-center items-center"
          @click="handleMuteClick"
        >
          <svg
            v-if="isMuted === true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            class="w-8"
          >
            <path
              fill="currentColor"
              d="M633.82 458.1l-69-53.33C592.42 360.8 608 309.68 608 256c0-95.33-47.73-183.58-127.65-236.03-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 42.78-11.96 83.59-33.22 119.06l-38.12-29.46C503.49 318.68 512 288.06 512 256c0-63.09-32.06-122.09-85.77-156.16-11.19-7.09-26.03-3.8-33.12 7.41-7.09 11.2-3.78 26.03 7.41 33.13C440.27 165.59 464 209.44 464 256c0 21.21-5.03 41.57-14.2 59.88l-39.56-30.58c3.38-9.35 5.76-19.07 5.76-29.3 0-31.88-17.53-61.33-45.77-76.88-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61 11.76 6.46 19.12 18.18 20.4 31.06L288 190.82V88.02c0-21.46-25.96-31.98-40.97-16.97l-49.71 49.7L45.47 3.37C38.49-2.05 28.43-.8 23.01 6.18L3.37 31.45C-2.05 38.42-.8 48.47 6.18 53.9l588.36 454.73c6.98 5.43 17.03 4.17 22.46-2.81l19.64-25.27c5.41-6.97 4.16-17.02-2.82-22.45zM32 184v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V352.6L43.76 163.84C36.86 168.05 32 175.32 32 184z"
            ></path>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 480 512"
            class="w-8"
          >
            <path
              fill="currentColor"
              d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.53 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"
            ></path>
          </svg>
        </button>
        <input
          id="volume-slider"
          ref="volumeSlider"
          type="range"
          max="100"
          value="100"
        />
      </div>
    </div>
    <table v-if="tracks.length > 1" class="w-full">
      <tbody>
        <tr v-for="(track, index) in tracks" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ track.title }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="currentSong == null">
      <span>No audio tracks</span>
    </div>
  </div>
</template>

<script>
/*
  Based on https://css-tricks.com/lets-create-a-custom-audio-player/
  By Idorenyin Udoh
*/
export default {
  props: {
    tracks: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentSong: null,
      isPlaying: false,
      isMuted: false,
      animationFrameRequest: null,
    };
  },
  watch: {
    tracks(newTracks) {
      if (newTracks && newTracks.length > 0) {
        this.initPlayer();
      }
    },
  },
  mounted() {
    if (this.tracks && this.tracks.length > 0) {
      this.$nextTick(function () {
        this.initPlayer();
      });
    }
  },
  methods: {
    initPlayer() {
      this.currentSong = this.tracks[0];

      const showRangeProgress = (rangeInput) => {
        if (rangeInput === this.refs.seekSlider)
          this.refs.audioContainer.style.setProperty(
            "--seek-before-width",
            (rangeInput.value / rangeInput.max) * 100 + "%"
          );
        else
          this.refs.audioContainer.style.setProperty(
            "--volume-before-width",
            (rangeInput.value / rangeInput.max) * 100 + "%"
          );
      };

      this.refs.seekSlider.addEventListener("input", (e) => {
        showRangeProgress(e.target);
      });
      this.refs.volumeSlider.addEventListener("input", (e) => {
        showRangeProgress(e.target);
      });

      /* Implementation of the functionality of the audio player */

      const audio = document.querySelector("audio");
      const durationContainer = document.getElementById("duration");
      this.animationFrameRequest = null;

      const displayDuration = () => {
        durationContainer.textContent = this.calculateTime(
          this.refs.audioPlayer.duration
        );
      };

      const setSliderMax = () => {
        this.refs.seekSlider.max = Math.floor(this.refs.audioPlayer.duration);
      };

      const displayBufferedAmount = () => {
        const bufferEnd = this.refs.audioPlayer.buffered.length - 1;
        const bufferedAmount = Math.floor(
          bufferEnd > 0 ? this.refs.audioPlayer.buffered.end(bufferEnd) : 0
        );
        this.refs.audioContainer.style.setProperty(
          "--buffered-width",
          `${(bufferedAmount / this.refs.seekSlider.max) * 100}%`
        );
      };

      if (this.refs.audioPlayer.readyState > 0) {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
      } else {
        this.refs.audioPlayer.addEventListener("loadedmetadata", () => {
          displayDuration();
          setSliderMax();
          displayBufferedAmount();
        });
      }

      this.refs.audioPlayer.addEventListener("progress", displayBufferedAmount);

      this.refs.seekSlider.addEventListener("input", () => {
        this.refs.currentTime.textContent = this.calculateTime(
          this.refs.seekSlider.value
        );
        if (!this.refs.audioPlayer.paused) {
          cancelAnimationFrame(this.animationFrameRequest);
        }
      });

      this.refs.seekSlider.addEventListener("change", () => {
        this.refs.audioPlayer.currentTime = this.refs.seekSlider.value;
        if (!this.refs.audioPlayer.paused) {
          requestAnimationFrame(this.whilePlaying);
        }
      });

      this.refs.volumeSlider.addEventListener("input", (e) => {
        const value = e.target.value;
        this.refs.audioPlayer.volume = value / 100;
      });

      /* Implementation of the Media Session API */
      if ("mediaSession" in navigator) {
        // eslint-disable-next-line no-undef
        navigator.mediaSession.metadata = new MediaMetadata({
          title: "Komorebi",
          artist: "Anitek",
          album: "MainStay",
          artwork: [
            {
              src: "https://assets.codepen.io/4358584/1.300.jpg",
              sizes: "96x96",
              type: "image/png",
            },
            {
              src: "https://assets.codepen.io/4358584/1.300.jpg",
              sizes: "128x128",
              type: "image/png",
            },
            {
              src: "https://assets.codepen.io/4358584/1.300.jpg",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "https://assets.codepen.io/4358584/1.300.jpg",
              sizes: "256x256",
              type: "image/png",
            },
            {
              src: "https://assets.codepen.io/4358584/1.300.jpg",
              sizes: "384x384",
              type: "image/png",
            },
            {
              src: "https://assets.codepen.io/4358584/1.300.jpg",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        });
        navigator.mediaSession.setActionHandler("play", () => {
          if (this.isPlaying === true) {
            this.refs.audioPlayer.play();
            this.isPlaying = true;
            requestAnimationFrame(this.whilePlaying);
            this.isPlaying = false;
          } else {
            this.refs.audioPlayer.pause();
            this.isPlaying = false;
            cancelAnimationFrame(this.animationFrameRequest);
            this.isPlaying = true;
          }
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          if (this.isPlaying === true) {
            this.refs.audioPlayer.play();
            this.isPlaying = true;
            requestAnimationFrame(this.whilePlaying);
            this.isPlaying = false;
          } else {
            this.refs.audioPlayer.pause();
            this.isPlaying = false;
            cancelAnimationFrame(this.animationFrameRequest);
            this.isPlaying = true;
          }
        });
        navigator.mediaSession.setActionHandler("seekbackward", (details) => {
          this.refs.audioPlayer.currentTime =
            this.refs.audioPlayer.currentTime - (details.seekOffset || 10);
        });
        navigator.mediaSession.setActionHandler("seekforward", (details) => {
          this.refs.audioPlayer.currentTime =
            this.refs.audioPlayer.currentTime + (details.seekOffset || 10);
        });
        navigator.mediaSession.setActionHandler("seekto", (details) => {
          if (details.fastSeek && "fastSeek" in audio) {
            this.refs.audioPlayer.fastSeek(details.seekTime);
            return;
          }
          this.refs.audioPlayer.currentTime = details.seekTime;
        });
        navigator.mediaSession.setActionHandler("stop", () => {
          this.refs.audioPlayer.currentTime = 0;
          this.refs.seekSlider.value = 0;
          this.refs.audioContainer.style.setProperty(
            "--seek-before-width",
            "0%"
          );
          this.refs.currentTime.textContent = "0:00";
          if (this.isPlaying === false) {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationFrameRequest);
            this.isPlaying = true;
          }
        });
      }
    },
    handlePlayClick() {
      if (this.isPlaying === true) {
        this.refs.audioPlayer.play();
        this.isPlaying = true;
        requestAnimationFrame(this.whilePlaying);
        this.isPlaying = false;
      } else {
        this.refs.audioPlayer.pause();
        this.isPlaying = false;
        cancelAnimationFrame(this.animationFrameRequest);
        this.isPlaying = true;
      }
    },
    handleMuteClick() {
      if (this.isMuted === false) {
        this.refs.audioPlayer.muted = true;
        this.isMuted = true;
      } else {
        this.refs.audioPlayer.muted = false;
        this.isMuted = false;
      }
    },
    whilePlaying() {
      this.refs.seekSlider.value = Math.floor(
        this.refs.audioPlayer.currentTime
      );
      this.refs.currentTime.textContent = this.calculateTime(
        this.refs.seekSlider.value
      );
      this.refs.audioContainer.style.setProperty(
        "--seek-before-width",
        `${(this.refs.seekSlider.value / this.refs.seekSlider.max) * 100}%`
      );
      this.animationFrameRequest = requestAnimationFrame(this.whilePlaying);
    },
    calculateTime(secs) {
      const minutes = Math.floor(secs / 60);
      const seconds = Math.floor(secs % 60);
      const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${minutes}:${returnedSeconds}`;
    },
  },
};
</script>

<style scoped lang="scss">
button {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
#audio-player-container {
  position: relative;
  --seek-before-width: 0%;
  --volume-before-width: 100%;
  --buffered-width: 0%;
  letter-spacing: -0.5px;
}

.time {
  text-align: center;
}
output {
  text-align: center;
}
#volume-slider {
  &::before {
    width: var(--volume-before-width);
  }

  &::-webkit-slider-runnable-track,
  &::-moz-range-track,
  &::-ms-fill-upper {
    @apply bg-red;
  }
}

input[type="range"] {
  position: relative;
  appearance: none;
  padding: 0;
  height: 1rem;

  &::-webkit-slider-runnable-track,
  &::-moz-range-track {
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: linear-gradient(
      to right,
      rgba(0, 125, 181, 0.6) var(--buffered-width),
      rgba(0, 125, 181, 0.2) var(--buffered-width)
    );
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none;
    box-sizing: content-box;
    height: 1rem;
    width: 1rem;
    cursor: pointer;
  }

  &:active::-webkit-slider-thumb,
  &::-moz-range-progress,
  &::-ms-fill-lower {
    @apply bg-red;
  }

  &::-ms-thumb {
    box-sizing: content-box;
    border: 1px solid #007db5;
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
  }

  &:active::-ms-thumb {
    transform: scale(1.2);
    @apply bg-red;
  }

  &::before {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    width: var(--seek-before-width);
    height: 100%;
    @apply bg-red;
    cursor: pointer;
  }
}

input[type="range"]::-moz-focus-outer {
  border: 0;
}
input[type="range"]::-moz-range-thumb {
  box-sizing: content-box;
  border: 1px solid #007db5;
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background-color: #fff;
  cursor: pointer;
}
input[type="range"]:active::-moz-range-thumb {
  transform: scale(1.2);
  background: #007db5;
}
input[type="range"]::-ms-track {
  width: 100%;
  height: 1rem;
  cursor: pointer;
  background: transparent;
  border: solid transparent;
  color: transparent;
}
#seek-slider,
#volume-slider {
  @apply bg-gray-light;
}
input[type="range"]::-ms-fill-upper {
  background: linear-gradient(
    to right,
    rgba(0, 125, 181, 0.6) var(--buffered-width),
    rgba(0, 125, 181, 0.2) var(--buffered-width)
  );
}
</style>

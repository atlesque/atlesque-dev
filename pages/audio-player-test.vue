<template>
  <main>
    <AudioPlayer :tracks="musicTracks" />
  </main>
</template>

<script>
export default {
  layout: "fullWidth",
  data() {
    return {
      /* musicTracks: ["/audio/songs/Deep Iris - Untitled - 06 Playing God.mp3"], */
      musicTracks: [
        {
          title: "Playing God",
          url: "/audio/songs/Deep Iris - Untitled - 06 Playing God.mp3",
        },
        {
          title: "Quick Time",
          url: "/audio/songs/Deep Iris - Untitled - 08 Quick Time.mp3",
        },
        {
          title: "Taylor",
          url: "/audio/songs/Deep Iris - Untitled - 09 Taylor.mp3",
        },
      ],
    };
  },
};
</script>

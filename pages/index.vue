<template>
  <main class="mb-32">
    <section id="hero" class="grid grid-cols-1 lg:grid-cols-2 mb-32">
      <div class="flex flex-col mr-8 mb-8">
        <h1 class="headline-xl">
          Hi, I'm <span class="text-red">Alex</span>ander
        </h1>
        <p class="text-xl mb-8">
          As a freelance software developer, I help you build customer-facing
          software, fully secure and with a smile!
        </p>
        <div class="flex">
          <!-- <NuxtLink to="#my-story" class="button-primary mr-8"
            >Read my story</NuxtLink
          > -->
          <NuxtLink to="#contact" class="button-primary">Contact me</NuxtLink>
        </div>
      </div>
      <div class="flex justify-end">
        <NuxtImg
          src="/images/alex/alex-sitting-in-gras-with-camera.png"
          alt="Me sitting in grass with camera"
          class="object-contain"
        />
      </div>
    </section>
    <section id="my-story" class="mb-32">
      <h1 class="headline"><CurlyBraceWrapper>My story</CurlyBraceWrapper></h1>
      <p class="text-xl mb-8">27 years ago, I was born in Donetsk, Ukraine:</p>
      <ul class="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
        <li v-for="(image, index) in ukraineImages" :key="index">
          <NuxtImg :src="image.src" :alt="image.alt" class="object-contain" />
        </li>
      </ul>
      <p class="text-xl mb-8">
        I'm passionate about helping others, that's why I love working with
        non-profits:
      </p>
      <ul class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32">
        <li
          v-for="(nonProfit, index) in nonProfits"
          :key="index"
          class="bg-gray-extra-light p-8"
        >
          <a :href="nonProfit.url" target="_blank">
            <NuxtImg
              :src="nonProfit.imageUrl"
              :alt="nonProfit.name"
              :class="[
                'object-contain mb-8 inline-block',
                nonProfit.imageClass,
              ]"
            />
          </a>
          <p>{{ nonProfit.description }}</p>
        </li>
      </ul>
      <p class="text-xl mb-8">
        I also love reading books! Here are some of my favorites:
      </p>
      <ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-32">
        <li v-for="(book, index) in books" :key="index" class="shadow-md">
          <a :href="book.url" target="_blank" :title="book.title">
            <NuxtImg
              :src="book.imageUrl"
              :alt="book.title"
              class="object-contain"
            />
          </a>
        </li>
      </ul>
      <p class="text-xl mb-8">
        In my free time, I enjoy photography, creating art and producing music:
      </p>
      <ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-8">
        <li
          v-for="(portrait, index) in studioPortraits"
          :key="index"
          class="shadow-md"
        >
          <NuxtImg
            :src="portrait.imageUrl"
            alt="Studio portrait"
            class="object-contain"
          />
        </li>
      </ul>
      <ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-8">
        <li
          v-for="(painting, index) in paintings"
          :key="index"
          class="shadow-md"
        >
          <NuxtImg
            :src="painting.imageUrl"
            :alt="`Painting entitled ${painting.title}`"
            :title="painting.title"
            class="object-contain"
          />
        </li>
      </ul>
      <!-- <AudioPlayer :tracks="musicTracks" /> -->
      <audio
        v-for="(track, index) in musicTracks"
        :key="index"
        controls
        class="w-full mb-8 last:mb-0"
      >
        <source :src="track.url" />
      </audio>
    </section>
    <section id="career" class="mb-32">
      <h1 class="headline">
        <CurlyBraceWrapper>Career highlights</CurlyBraceWrapper>
      </h1>
      <p class="text-xl mb-8">
        I hold a
        <span class="font-medium">Bachelor's degree in Computer Science</span>
        and I'm a <span class="font-medium">Certified Ethical Hacker</span>.
      </p>
      <p class="text-xl mb-8">
        I've taught <span class="font-medium">Digital Forensics</span> to the
        Federal Computer Crime Unit of the
        <span class="font-medium">Belgian police</span>.
      </p>
      <p class="text-xl mb-8">
        I've presented
        <span class="font-medium">talks on Internet-of-Things security</span>
        and digital safety.
      </p>
      <p class="text-xl mb-8">
        During my internship in Osaka, <span class="font-medium">Japan</span>,
        we launched a cross-platform app for children that held
        <span class="font-medium">first place in the Apple App Store</span>.
      </p>
    </section>
    <section id="expertise" class="mb-32">
      <h1 class="headline">
        <CurlyBraceWrapper>Technical expertise</CurlyBraceWrapper>
      </h1>
      <p class="text-xl mb-8">
        My favorite programming languages & frameworks are:
      </p>
      <ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-32">
        <li
          v-for="(technology, index) in technologies"
          :key="index"
          class="flex items-center"
        >
          <NuxtImg
            :src="technology.imageUrl"
            :alt="technology.name"
            :title="technology.name"
            class="object-contain"
          />
        </li>
      </ul>
      <p class="text-xl mb-8">
        I've helped build commercial and open-source projects including:
      </p>
      <ul class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32">
        <li
          v-for="(project, index) in projects"
          :key="index"
          class="bg-gray-extra-light p-8"
        >
          <a :href="project.url" target="_blank">
            <NuxtImg
              :src="project.imageUrl"
              :alt="project.name"
              :class="['object-contain mb-8 inline-block', project.imageClass]"
            />
          </a>
          <p>{{ project.description }}</p>
        </li>
      </ul>
      <p class="text-xl mb-8">
        I've been writing code since I was 10. Professionally since 2015.
      </p>
      <p class="text-xl mb-8">I speak Dutch, English and Russian fluently.</p>
      <p class="text-xl mb-8">I understand some French and Japanese too.</p>
      <p class="text-xl mb-8">
        I offer extra services like copywriting, photo & videography, teaching
        and audio production.
      </p>
    </section>
    <section id="contact">
      <h1 class="headline">
        <CurlyBraceWrapper>Contact me</CurlyBraceWrapper>
      </h1>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <p class="text-xl mb-8">
            Whether you're interested in a flexible workforce, a business
            partner or a philantropic friend, I'm here to help!
          </p>
          <p class="text-xl mb-8">
            Happy to get in touch via video, phone or for a cup of tea in
            Brugge, Belgium!
          </p>
          <p class="text-xl mb-8">
            Looking forward to creating value in the world together! 🙏
          </p>
        </div>
        <div class="relative">
          <address
            class="grid grid-cols-1 gap-8 justify-items-start relative z-10"
          >
            <a href="mailto:alexander@atlesque.com" class="button-primary"
              >alexander@atlesque.com</a
            >
            <a href="tel:+32473372210" class="button-primary"
              >+32 473 37 22 10</a
            >
            <a
              href="https://www.linkedin.com/in/alexandervanmaele/"
              target="_blank"
              class="button-primary"
              >LinkedIn</a
            >
            <a
              href="https://www.instagram.com/atlesque/"
              target="_blank"
              class="button-primary"
              >Instagram</a
            >
            <a
              href="https://atlesque.com/"
              target="_blank"
              class="button-primary"
              >Photography portfolio</a
            >
          </address>
          <div class="absolute inset-0 z-0 py-4 flex items-center justify-end">
            <NuxtImg
              src="/images/alex/alex-portrait-circle.png"
              alt="Portrait of me"
              class="object-contain h-full"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  layout: "fullWidth",
  data() {
    return {
      ukraineImages: [
        {
          src: "/images/ukraine/alex-with-mother.png",
          alt: "My mother and me",
        },
        {
          src: "/images/ukraine/alex-with-grandfather.png",
          alt: "My granfather and me",
        },
        {
          src: "/images/ukraine/alex-with-grandparents-and-mother.png",
          alt: "My grandparents, mother and me",
        },
      ],
      nonProfits: [
        {
          name: "Himalayan Projects",
          url: "http://www.himalayanprojects.brugseverenigingen.be/",
          description:
            "Belgium-based organisation helping Nepalese rural areas with medical care, education and disaster response. Website management and IT support.",
          imageUrl: "/images/non-profits/himalayan-projects.png",
        },
        {
          name: "Ah-Lama",
          url: "https://ah-lama.com/",
          description:
            "Buddhist teachings and courses for practitioners and enthusiasts. Spanning a worldwide network of volunteers. Web development and online practice support.",
          imageUrl: "/images/non-profits/ah-lama.png",
          imageClass: "max-w-[20rem]",
        },
        {
          name: "Testament",
          url: "https://www.testament.be/",
          description:
            "Belgian organisation helping people with their last will and promoting declaring a good cause in it. IT support, photography and video content management.",
          imageUrl: "/images/non-profits/testament.png",
        },
        {
          name: "De Innengaard",
          url: "https://innengaard.be/",
          description:
            "A volunteer-driven ecological garden project supporting local agriculture. Participants can assemble their own flower bouquets. Web development, copywriting and photography.",
          imageUrl: "/images/non-profits/de-innengaard.png",
          imageClass: "max-w-[20rem]",
        },
      ],
      books: [
        {
          title: "Clean Code: A Handbook of Agile Software Craftsmanship",
          author: "Robert C. Martin",
          url: "https://www.goodreads.com/book/show/3735293-clean-code",
          imageUrl: "/images/books/clean-code.png",
        },
        {
          title: "The Order of Time",
          author: "Carlo Rovelli",
          url: "https://www.goodreads.com/book/show/36442813-the-order-of-time",
          imageUrl: "/images/books/the-order-of-time.png",
        },
        {
          title: "Thinking, Fast and Slow",
          author: "Daniel Kahneman",
          url: "https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow",
          imageUrl: "/images/books/thinking-fast-and-slow.png",
        },
        {
          title:
            "The Cuckoo's Egg: Tracking a Spy Through the Maze of Computer Espionage",
          author: "Clifford Stoll",
          url: "https://www.goodreads.com/book/show/18154.The_Cuckoo_s_Egg",
          imageUrl: "/images/books/the-cuckoos-egg.png",
        },
        {
          title: "The Incal",
          author: "Alejandro Jodorowsky & Mœbius",
          url: "https://www.goodreads.com/book/show/10842223-the-incal",
          imageUrl: "/images/books/the-incal.png",
        },
      ],
      studioPortraits: [
        {
          imageUrl: "/images/studio-portraits/testament-woman.png",
        },
        {
          imageUrl: "/images/studio-portraits/nat.png",
        },
        {
          imageUrl: "/images/studio-portraits/dircus.png",
        },
        {
          imageUrl: "/images/studio-portraits/xana.png",
        },
        {
          imageUrl: "/images/studio-portraits/elouise.png",
        },
      ],
      paintings: [
        {
          title: "Feline Species",
          imageUrl: "/images/paintings/feline-species.png",
        },
        {
          title: "Frogfish",
          imageUrl: "/images/paintings/frogfish.png",
        },
        {
          title: "Moth Beacon",
          imageUrl: "/images/paintings/moth-beacon.png",
        },
        {
          title: "Tribal Queen",
          imageUrl: "/images/paintings/tribal-queen.png",
        },
        {
          title: "Tree Man",
          imageUrl: "/images/paintings/tree-man.png",
        },
      ],
      musicTracks: [
        {
          title: "Playing God",
          url: "/audio/songs/Deep Iris - Untitled - 06 Playing God.mp3",
        },
        {
          title: "War",
          url: "/audio/songs/Deep Iris - Untitled - 02 War.mp3",
        },
      ],
      technologies: [
        {
          name: "Vue",
          imageUrl: "/images/technologies/vue.png",
        },
        {
          name: "Nuxt",
          imageUrl: "/images/technologies/nuxt.png",
        },
        {
          name: "React",
          imageUrl: "/images/technologies/react.png",
        },
        {
          name: "Node",
          imageUrl: "/images/technologies/node.png",
        },
        {
          name: "WordPress",
          imageUrl: "/images/technologies/wordpress.png",
        },
      ],
      projects: [
        {
          name: "Among Us Detective",
          url: "https://amongusdetective.com/",
          description:
            "An open-source tracking tool for the popular online game Among Us by InnerSloth. Written in Vue.",
          imageUrl: "/images/projects/among-us-detective.png",
        },
        {
          name: "Stuurkracht",
          url: "https://stuurkracht.be/",
          description:
            "An open-source web app for sending e-cards to people who you care about and are in need of support. Full-stack in Nest and Nuxt.",
          imageUrl: "/images/projects/stuurkracht.png",
        },
        {
          name: "ZBaduk",
          url: "https://www.zbaduk.com/",
          description:
            "Web app using Artificial Intelligence to analyze Go (Baduk) games. Helped improve the UI written in Angular with TypeScript.",
          imageUrl: "/images/projects/zbaduk.png",
        },
        {
          name: "Clarus",
          url: "https://www.clarus.biz/",
          description:
            "App used by Belgian funeral directors, crematoriums and municipalities to manage their death certificates and concession needs. Written in Vue and Nuxt.",
          imageUrl: "/images/projects/clarus.png",
        },
      ],
    };
  },
};
</script>

<template>
  <main class="mb-32">
    <section class="grid grid-cols-1 lg:grid-cols-2 mb-32">
      <div class="flex flex-col mr-8 mb-8">
        <h1 class="headline-xl">
          Hi, I'm <span class="text-red">Alex</span>ander
        </h1>
        <p class="text-xl mb-8">
          As a freelance software developer, I help you build customer-facing
          software, fully secure and with a smile!
        </p>
        <div class="flex">
          <a href="#my-story" class="button-primary mr-8">Read my story</a>
          <a href="#contact" class="button">Contact me</a>
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
    <section class="mb-32">
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
              :class="['object-contain mb-8 inline-block', nonProfit.class]"
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
      <!-- TODO: Add music player component with own songs -->
    </section>
    <section class="mb-32">
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
          class: "max-w-[20rem]",
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
          class: "max-w-[20rem]",
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
    };
  },
};
</script>

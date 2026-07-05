export interface ImageItem {
  src: string;
  alt: string;
}

export interface BookItem {
  title: string;
  author: string;
  url: string;
  imageUrl: string;
}

export interface NonProfitItem {
  name: string;
  url: string;
  description: string;
  imageUrl: string;
  imageClass?: string;
}

export interface TechnologyItem {
  name: string;
  imageUrl: string;
}

export interface ProjectItem {
  name: string;
  url: string;
  description: string;
  imageUrl: string;
  imageClass?: string;
  showTitle?: boolean;
}

export interface MusicTrack {
  title: string;
  url: string;
}

export const ukraineImages: ImageItem[] = [
  {
    src: "/images/ukraine/alex-with-mother.png",
    alt: "My mother and me",
  },
  {
    src: "/images/ukraine/alex-with-grandfather.png",
    alt: "My grandfather and me",
  },
  {
    src: "/images/ukraine/alex-with-grandparents-and-mother.png",
    alt: "My grandparents, mother and me",
  },
];

export const nonProfits: NonProfitItem[] = [
  {
    name: "Ah-Lama",
    url: "https://ah-lama.com/",
    description:
      "Buddhist teachings and courses for practitioners and enthusiasts, supported by a worldwide network of volunteers. I provide web development and online practice support.",
    imageUrl: "/images/non-profits/ah-lama.png",
    imageClass: "max-w-[20rem]",
  },
  {
    name: "Testament",
    url: "https://www.testament.be/",
    description:
      "A Belgian organization that helps people arrange their last will and encourages them to include a good cause. I provide IT support, photography and video content management.",
    imageUrl: "/images/non-profits/testament.png",
  },
  {
    name: "Himalayan Projects",
    url: "https://himalayan-projects.org/",
    description:
      "A Belgium-based organization supporting rural communities in Nepal with medical care, education and disaster response. I provide web development and IT support.",
    imageUrl: "/images/non-profits/himalayan-projects.png",
  },
];

export const books: BookItem[] = [
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
];

export const studioPortraits: ImageItem[] = [
  { src: "/images/studio-portraits/1.jpg", alt: "Studio portrait" },
  { src: "/images/studio-portraits/2.jpg", alt: "Studio portrait" },
  { src: "/images/studio-portraits/3.jpg", alt: "Studio portrait" },
  { src: "/images/studio-portraits/4.jpg", alt: "Studio portrait" },
  { src: "/images/studio-portraits/5.jpg", alt: "Studio portrait" },
];

export interface PaintingItem {
  title: string;
  imageUrl: string;
}

export const paintings: PaintingItem[] = [
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
];

export const musicTracks: MusicTrack[] = [
  {
    title: "Never Stop",
    url: "/audio/songs/atlesque-never-stop.mp3",
  },
  {
    title: "Eva",
    url: "/audio/songs/deep-iris-eva.mp3",
  },
];

export const technologies: TechnologyItem[] = [
  { name: "React", imageUrl: "/images/technologies/react.png" },
  { name: "Vue", imageUrl: "/images/technologies/vue.png" },
  { name: "Nuxt", imageUrl: "/images/technologies/nuxt.png" },
  { name: "Node", imageUrl: "/images/technologies/node.png" },
  { name: "WordPress", imageUrl: "/images/technologies/wordpress.png" },
];

export const projects: ProjectItem[] = [
  {
    name: "Mijn Burgerprofiel",
    url: "https://www.mijnburgerprofiel.be/",
    description:
      "The Flemish government's digital citizen profile — a centralized portal for managing official documents, applications and government communications. I do frontend development in Vue, Nuxt and Nest.",
    imageUrl: "/images/projects/mijn-burgerprofiel.jpg",
    showTitle: true,
  },
  {
    name: "Stuurkracht",
    url: "https://stuurkracht.be/",
    description:
      "An open-source web app for sending e-cards to the people you care about when they need a little support. Built full-stack with Nest and Nuxt.",
    imageUrl: "/images/projects/stuurkracht.png",
  },
  {
    name: "Among Us Detective",
    url: "https://amongusdetective.com/",
    description:
      "An open-source tracking tool for the popular online game Among Us by InnerSloth. Built with Vue.",
    imageUrl: "/images/projects/among-us-detective.png",
    showTitle: true,
  },
  {
    name: "Merlezingt",
    url: "https://merlezingt.be/",
    description:
      "Web development, photography and content management for a Belgian folk musician.",
    imageUrl: "/images/projects/merlezingt.jpg",
    showTitle: true,
  },
];


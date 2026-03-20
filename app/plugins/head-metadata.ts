/*
  This plugin simplifies injecting SEO metadata into the document's head.

  Usage example in a page component:

  <script setup>
  const { $getHeadMetadata } = useNuxtApp()
  useHead($getHeadMetadata({
    title: 'My Page Title',
    description: 'My page description',
  }))
  </script>
*/
export default defineNuxtPlugin(() => {
  return {
    provide: {
      getHeadMetadata: ({
        title,
        description,
        keywords,
        type,
        updatedTime,
        image,
      }) => {
        return {
          ...(title && { title }),
          ...(description && { description }),
          meta: [
            ...(title
              ? [
                  {
                    property: "title",
                    content: title,
                  },
                ]
              : []),
            ...(description
              ? [
                  {
                    property: "description",
                    content: description,
                  },
                ]
              : []),
            ...(keywords
              ? [
                  {
                    property: "keywords",
                    content: keywords,
                  },
                ]
              : []),
            ...(title
              ? [
                  {
                    property: "og:title",
                    content: title,
                  },
                ]
              : []),
            ...(description
              ? [
                  {
                    property: "og:description",
                    content: description,
                  },
                ]
              : []),
            ...(type
              ? [
                  {
                    property: "og:type",
                    content: type,
                  },
                ]
              : []),
            ...(updatedTime
              ? [
                  {
                    property: "og:updated_time",
                    content: updatedTime,
                  },
                ]
              : []),
            ...(image
              ? [
                  {
                    property: "og:image",
                    content: image,
                  },
                  {
                    property: "twitter:card",
                    content: "summary_large_image",
                  },
                ]
              : []),
          ],
        };
      },
    },
  };
});

/* 
  This plugin simplifies injecting SEO metadata into the document's head.

  Usage example in a page component using i18n:

  export default {
    head() {
      return this.$getHeadMetadata({
        title: this.$t(`home.meta.title`),
        description: this.$t(`home.meta.description`),
        keywords: this.$t(`home.meta.keywords`),
      });
    },
  };
*/
export default ({ app }, inject) => {
  inject(
    "getHeadMetadata",
    ({ title, description, keywords, type, updatedTime, image }) => {
      return {
        ...(title && { title }),
        ...(description && { description }),
        meta: [
          ...(title
            ? [
                {
                  property: "title",
                  content: title,
                  hid: "title",
                },
              ]
            : []),
          ...(description
            ? [
                {
                  property: "description",
                  content: description,
                  hid: "description",
                },
              ]
            : []),
          ...(keywords
            ? [
                {
                  property: "keywords",
                  content: keywords,
                  hid: "keywords",
                },
              ]
            : []),
          ...(title
            ? [
                {
                  property: "og:title",
                  content: title,
                  hid: "og:title",
                },
              ]
            : []),
          ...(description
            ? [
                {
                  property: "og:description",
                  content: description,
                  hid: "og:description",
                },
              ]
            : []),
          ...(type
            ? [
                {
                  property: "og:type",
                  content: type,
                  hid: "og:type",
                },
              ]
            : []),
          ...(updatedTime
            ? [
                {
                  property: "og:updated_time",
                  content: updatedTime,
                  hid: "og:updated_time",
                },
              ]
            : []),
          ...(image
            ? [
                {
                  property: "og:image",
                  content: image,
                  hid: "og:image",
                },
                {
                  property: "twitter:card",
                  content: "summary_large_image",
                  hid: "twitter:card",
                },
              ]
            : []),
        ],
      };
    }
  );
};

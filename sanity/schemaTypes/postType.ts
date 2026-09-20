import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,

  fields: [
    defineField({
      name: "title",
      type: "string",
    }),

    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),

    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
      validation: (Rule) => Rule.required(),
      description: "Select the author responsible for this article. Do not leave this blank.",
    }),

    defineField({
      name: "mainImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
      ],
    }),

    defineField({
      name: "categories",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
    }),

    defineField({
      name: "publishedAt",
      type: "datetime",
    }),

    defineField({
      name: "body",
      type: "blockContent",
    }),
     
    defineField({
  name: "videoFile",
  title: "Video File",
  type: "file",
  description: "Upload the video file for Video posts.",
  options: {
    accept: "video/*",
  },
}),

    // 🎥 VIDEO URL
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description:
        "Paste the URL of the video. Use this field for posts in the Video category.",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ["http", "https"],
        }),
    }),

    // 🕒 VIDEO DURATION
    defineField({
      name: "duration",
      title: "Video Duration",
      type: "string",
      description:
        "Optional. Example: 1:39, 2:05, 5:42",
    }),

    // 🟢 VIEWS
    defineField({
      name: "views",
      title: "Views",
      type: "number",
      initialValue: 0,
    }),
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;

      return {
        ...selection,
        subtitle: author && `by ${author}`,
      };
    },
  },
});
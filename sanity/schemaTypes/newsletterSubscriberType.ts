import {defineField, defineType} from "sanity"

export const newsletterSubscriberType = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscriber",
  type: "document",
  fields: [
    defineField({name: "email", title: "Email", type: "string", validation: (Rule) => Rule.required()}),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {list: ["active", "unsubscribed"]},
      initialValue: "active",
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: "source", title: "Source", type: "string", initialValue: "website"}),
    defineField({name: "subscribedAt", title: "Subscribed At", type: "datetime", validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {title: "email", subtitle: "status"},
  },
})

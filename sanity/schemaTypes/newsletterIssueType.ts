import {defineArrayMember, defineField, defineType} from "sanity"

export const newsletterIssueType = defineType({
  name: "newsletterIssue",
  title: "Newsletter Issue",
  type: "document",
  fieldsets: [{name: "delivery", title: "Delivery"}],
  fields: [
    defineField({name: "title", title: "Internal Title", type: "string", validation: (Rule) => Rule.required()}),
    defineField({name: "subject", title: "Email Subject", type: "string", validation: (Rule) => Rule.required()}),
    defineField({name: "previewText", title: "Preview Text", type: "string"}),
    defineField({name: "intro", title: "Introduction", type: "text"}),
    defineField({
      name: "featuredPosts",
      title: "Featured Stories",
      type: "array",
      of: [defineArrayMember({type: "reference", to: [{type: "post"}]})],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({name: "body", title: "Additional Notes", type: "text"}),
    defineField({
      name: "status",
      title: "Delivery Status",
      type: "string",
      fieldset: "delivery",
      options: {list: ["draft", "ready", "sent", "cancelled"]},
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: "scheduledAt", title: "Scheduled At", type: "datetime", fieldset: "delivery"}),
    defineField({name: "sentAt", title: "Sent At", type: "datetime", readOnly: true, fieldset: "delivery"}),
    defineField({name: "resendBroadcastId", title: "Resend Broadcast ID", type: "string", readOnly: true, fieldset: "delivery"}),
  ],
  preview: {
    select: {title: "title", subtitle: "subject"},
  },
})

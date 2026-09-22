import {defineField, defineType} from "sanity"

export const tipSubmissionType = defineType({
  name: "tipSubmission",
  title: "Tip Submission",
  type: "document",
  fields: [
    defineField({name: "name", title: "Name", type: "string"}),
    defineField({name: "email", title: "Email", type: "string"}),
    defineField({name: "articleUrl", title: "Related Article URL", type: "url"}),
    defineField({name: "message", title: "Tip", type: "text", validation: (Rule) => Rule.required()}),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {list: ["new", "reviewing", "actioned", "closed"]},
      initialValue: "new",
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: "submittedAt", title: "Submitted At", type: "datetime", validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {title: "name", subtitle: "status"},
    prepare({title, subtitle}: {title?: string; subtitle?: string}) {
      return {title: title || "Anonymous tip", subtitle}
    },
  },
})

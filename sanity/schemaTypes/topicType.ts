import { TagIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const topicType = defineType({
  name: 'topic',
  title: 'Topic',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Topic Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Coverage Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
      description: 'Explain what BOMBAY BUREAU is covering on this topic. Keep it specific and durable.',
    }),
    defineField({
      name: 'relatedTopics',
      title: 'Related Topics',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'topic' } })],
      validation: (Rule) => Rule.unique(),
      description: 'Optional topics that readers may want to explore alongside this coverage.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})

import { DocumentTextIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,

  fieldsets: [
    { name: 'editorial', title: 'Editorial' },
    { name: 'publication', title: 'Publication' },
    { name: 'transparency', title: 'Transparency & Updates' },
    { name: 'video', title: 'Video' },
  ],

  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      fieldset: 'editorial',
      options: {
        list: [
          { title: 'News', value: 'news' },
          { title: 'Opinion', value: 'opinion' },
          { title: 'Explainer', value: 'explainer' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'news',
      validation: (Rule) => Rule.required(),
      description: 'Use this to identify the editorial format independently of categories.',
    }),

    defineField({
      name: 'excerpt',
      title: 'Standfirst / Excerpt',
      type: 'text',
      rows: 3,
      fieldset: 'editorial',
      description: 'A concise summary shown below the headline and used for metadata.',
    }),

    defineField({
      name: 'workflowStatus',
      title: 'Editorial Workflow Status',
      type: 'string',
      fieldset: 'publication',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In Review', value: 'in_review' },
          { title: 'Approved for Publication', value: 'approved' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
          { title: 'Withdrawn', value: 'withdrawn' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
      description: 'Editorial state used by the newsroom. Publishing remains controlled by Sanity draft/publish actions.',
    }),

    defineField({
      name: 'editorialNote',
      title: 'Internal Editorial Note',
      type: 'text',
      rows: 4,
      fieldset: 'publication',
      description: 'Internal newsroom note for review, handoff, or publishing context. Not displayed publicly.',
    }),

    defineField({
      name: 'author',
      type: 'reference',
      to: { type: 'author' },
      fieldset: 'publication',
      validation: (Rule) => Rule.required(),
      description: 'Select the author responsible for this article. Do not leave this blank.',
    }),

    defineField({
      name: 'mainImage',
      type: 'image',
      fieldset: 'editorial',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: 'categories',
      type: 'array',
      fieldset: 'editorial',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
    }),

    defineField({
      name: 'publishedAt',
      type: 'datetime',
      fieldset: 'publication',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'body',
      type: 'blockContent',
      fieldset: 'editorial',
    }),

    defineField({
      name: 'sources',
      title: 'Sources & References',
      type: 'array',
      fieldset: 'transparency',
      description: 'Add important source material readers can consult.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Source name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Source URL',
              type: 'url',
              validation: (Rule) =>
                Rule.required().uri({
                  allowRelative: false,
                  scheme: ['http', 'https'],
                }),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        }),
      ],
    }),

    defineField({
      name: 'updateNote',
      title: 'Update Note',
      type: 'text',
      rows: 3,
      fieldset: 'transparency',
      description: 'Use when a published article receives a meaningful factual or reporting update.',
    }),

    defineField({
      name: 'correctionNote',
      title: 'Correction Note',
      type: 'text',
      rows: 3,
      fieldset: 'transparency',
      description: 'Use for a material factual correction. Keep the note specific and transparent.',
    }),

    defineField({
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      fieldset: 'video',
      description: 'Upload the video file for Video posts.',
      options: { accept: 'video/*' },
    }),

    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      fieldset: 'video',
      description: 'Paste the URL of the video. Use this field for Video posts.',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),

    defineField({
      name: 'duration',
      title: 'Video Duration',
      type: 'string',
      fieldset: 'video',
      description: 'Optional. Example: 1:39, 2:05, 5:42',
    }),

    defineField({
      name: 'views',
      title: 'Views',
      type: 'number',
      fieldset: 'publication',
      initialValue: 0,
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      contentType: 'contentType',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author, contentType } = selection;
      return {
        ...selection,
        subtitle: [contentType, author && `by ${author}`].filter(Boolean).join(' · '),
      };
    },
  },
});

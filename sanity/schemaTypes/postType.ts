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
      options: { source: 'title', maxLength: 96 },
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
      name: 'reportingType',
      title: 'Reporting Type',
      type: 'string',
      fieldset: 'editorial',
      options: {
        list: [
          { title: 'Original Reporting', value: 'original_reporting' },
          { title: 'Original Analysis', value: 'original_analysis' },
          { title: 'Explainer / Context', value: 'explainer_context' },
          { title: 'Attributed Reporting', value: 'attributed_reporting' },
          { title: 'Republished / Licensed', value: 'republished_licensed' },
        ],
        layout: 'radio',
      },
      description: 'Internal editorial classification. Select only when the newsroom can substantiate the reporting origin. This is not a public originality claim.',
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
      title: 'Lead Image',
      type: 'image',
      fieldset: 'editorial',
      options: { hotspot: true },
      description: 'Use a relevant, high-quality landscape image. For Google Discover readiness, prefer images at least 1200px wide and suitable for a 16:9 presentation; avoid logos or text-heavy graphics.',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Optional reader-facing caption for the lead image.',
        }),
        defineField({
          name: 'credit',
          type: 'string',
          title: 'Image Credit',
          description: 'Optional photographer, agency, archive, or source credit.',
        }),
      ],
    }),

    defineField({
      name: 'categories',
      title: 'Section(s)',
      type: 'array',
      fieldset: 'editorial',
      description: 'Use the most specific newsroom section. Sports stories belong in Sports; film, television, music, books and arts belong in Culture. Avoid Technology for entertainment coverage.',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
    }),

    defineField({
      name: 'publishedAt',
      type: 'datetime',
      fieldset: 'publication',
      validation: (Rule) => Rule.required(),
      description: 'The editorial publication timestamp shown to readers. Keep this aligned with the original publication time.',
    }),

    defineField({
      name: 'firstPublishedAt',
      title: 'First Published At',
      type: 'datetime',
      fieldset: 'publication',
      readOnly: true,
      description: 'Set automatically on first publication. This preserves the original publication timestamp.',
    }),

    defineField({
      name: 'lastPublishedAt',
      title: 'Last Published At',
      type: 'datetime',
      fieldset: 'publication',
      readOnly: true,
      description: 'Set automatically whenever a published revision is published.',
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
      name: 'publicationChangeType',
      title: 'Next Publication Change',
      type: 'string',
      fieldset: 'transparency',
      options: {
        list: [
          { title: 'Update', value: 'update' },
          { title: 'Correction', value: 'correction' },
        ],
        layout: 'radio',
      },
      initialValue: 'update',
      description: 'Choose Correction when the next publication materially corrects a factual error. This resets to Update after publishing.',
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
      name: 'publicationHistory',
      title: 'Publication History',
      type: 'array',
      fieldset: 'transparency',
      readOnly: true,
      description: 'Automatically recorded publication events. This is a publication log, not the full Sanity revision history.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
            defineField({
              name: 'type',
              title: 'Event Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Initial publication', value: 'initial' },
                  { title: 'Update', value: 'update' },
                  { title: 'Correction', value: 'correction' },
                ],
              },
            }),
            defineField({ name: 'note', title: 'Note', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'type', subtitle: 'publishedAt', note: 'note' },
            prepare(selection) {
              const labels: Record<string, string> = {
                initial: 'Initial publication',
                update: 'Update',
                correction: 'Correction',
              };
              return {
                title: labels[selection.title] || 'Publication event',
                subtitle: selection.subtitle,
                description: selection.note,
              };
            },
          },
        }),
      ],
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

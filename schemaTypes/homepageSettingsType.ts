import { defineField, defineType } from 'sanity';

export const homepageSettingsType = defineType({
  name: 'homepageSettings',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'mode',
      title: 'Homepage Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Normal', value: 'normal' },
          { title: 'Breaking', value: 'breaking' },
          { title: 'Deep Dive', value: 'deep_dive' },
        ],
        layout: 'radio',
      },
      initialValue: 'normal',
      validation: (Rule) => Rule.required(),
      description: 'Controls the editorial state of the homepage. Normal keeps the standard homepage; Breaking and Deep Dive activate their dedicated homepage treatments.',
    }),
    defineField({
      name: 'breakingStory',
      title: 'Breaking Story',
      type: 'reference',
      to: [{ type: 'post' }],
      hidden: ({ parent }) => parent?.mode !== 'breaking',
      description: 'Select the published story that should lead the Breaking homepage state.',
      options: {
        disableNew: true,
      },
    }),
    defineField({
      name: 'breakingLabel',
      title: 'Breaking Label',
      type: 'string',
      initialValue: 'BREAKING',
      hidden: ({ parent }) => parent?.mode !== 'breaking',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'breakingSummary',
      title: 'Breaking Summary',
      type: 'text',
      rows: 3,
      hidden: ({ parent }) => parent?.mode !== 'breaking',
      description: 'Optional short editorial summary for the breaking state.',
    }),
    defineField({
      name: 'deepDiveTopic',
      title: 'Deep Dive Coverage',
      type: 'reference',
      to: [{ type: 'topic' }],
      hidden: ({ parent }) => parent?.mode !== 'deep_dive',
      description: 'Select the continuing-coverage topic that should anchor the Deep Dive homepage state.',
      options: {
        disableNew: true,
      },
    }),
    defineField({
      name: 'deepDiveTitle',
      title: 'Deep Dive Title',
      type: 'string',
      hidden: ({ parent }) => parent?.mode !== 'deep_dive',
      validation: (Rule) => Rule.max(120),
      description: 'Optional homepage headline for the Deep Dive state.',
    }),
    defineField({
      name: 'deepDiveSummary',
      title: 'Deep Dive Summary',
      type: 'text',
      rows: 3,
      hidden: ({ parent }) => parent?.mode !== 'deep_dive',
      description: 'Optional short editorial introduction for the Deep Dive state.',
    }),
  ],
  preview: {
    select: {
      mode: 'mode',
      breakingStory: 'breakingStory.title',
      deepDiveTopic: 'deepDiveTopic.title',
    },
    prepare({ mode, breakingStory, deepDiveTopic }) {
      const labels: Record<string, string> = {
        normal: 'Normal',
        breaking: 'Breaking',
        deep_dive: 'Deep Dive',
      };
      const detail =
        mode === 'breaking'
          ? breakingStory
          : mode === 'deep_dive'
            ? deepDiveTopic
            : 'Standard homepage';
      return {
        title: 'Homepage Settings',
        subtitle: [labels[mode] || mode, detail].filter(Boolean).join(' · '),
      };
    },
  },
});

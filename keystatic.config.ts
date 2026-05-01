import { collection, config, fields } from '@keystatic/core';

const essayImages = {
  directory: 'src/content/essays',
  transformFilename: (filename: string) => filename.toLowerCase().replace(/\s+/g, '-'),
};

const workImages = {
  directory: 'src/content/work',
  transformFilename: (filename: string) => filename.toLowerCase().replace(/\s+/g, '-'),
};

const noteImages = {
  directory: 'src/content/notes',
  publicPath: '.',
  transformFilename: (filename: string) => filename.toLowerCase().replace(/\s+/g, '-'),
};

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: '路遥知玛丽',
    },
    navigation: {
      内容: ['notes', 'essays', 'work'],
    },
  },
  collections: {
    notes: collection({
      label: 'Notes',
      path: 'src/content/notes/*',
      slugField: 'title',
      format: {
        contentField: 'content',
      },
      schema: {
        title: fields.slug({
          name: {
            label: '标题',
            defaultValue: 'Untitled note',
          },
        }),
        date: fields.date({
          label: '日期',
          validation: { isRequired: true },
        }),
        content: fields.markdoc({
          label: '正文',
          extension: 'md',
          options: {
            image: noteImages,
          },
        }),
      },
      columns: ['date', 'title'],
    }),
    essays: collection({
      label: 'Essays',
      path: 'src/content/essays/*/index',
      slugField: 'title',
      format: {
        contentField: 'content',
      },
      schema: {
        title: fields.slug({
          name: {
            label: '标题',
            validation: { isRequired: true },
          },
        }),
        date: fields.date({
          label: '日期',
          validation: { isRequired: true },
        }),
        summary: fields.text({
          label: '摘要',
          multiline: true,
        }),
        cover: fields.image({
          label: '封面图',
          directory: essayImages.directory,
          description: '上传或选择图片。图片会保存到当前文章文件夹，例如 01.jpg。',
        }),
        content: fields.markdoc({
          label: '正文',
          extension: 'md',
          options: {
            image: essayImages,
          },
        }),
      },
      columns: ['date', 'title'],
    }),
    work: collection({
      label: 'Work',
      path: 'src/content/work/*/index',
      slugField: 'title',
      format: {
        contentField: 'content',
      },
      schema: {
        title: fields.slug({
          name: {
            label: '标题',
            validation: { isRequired: true },
          },
        }),
        date: fields.date({
          label: '日期',
          validation: { isRequired: true },
        }),
        summary: fields.text({
          label: '摘要',
          multiline: true,
          validation: { isRequired: true },
        }),
        cover: fields.image({
          label: '封面图',
          directory: workImages.directory,
          description: '上传或选择图片。图片会保存到当前项目文件夹，例如 01.jpg。',
          validation: { isRequired: true },
        }),
        metaLeft: fields.text({
          label: '左侧元信息',
          validation: { isRequired: true },
        }),
        metaRight: fields.text({
          label: '右侧元信息',
          validation: { isRequired: true },
        }),
        content: fields.markdoc({
          label: '正文',
          extension: 'md',
          options: {
            image: workImages,
          },
        }),
      },
      columns: ['date', 'title'],
    }),
  },
});

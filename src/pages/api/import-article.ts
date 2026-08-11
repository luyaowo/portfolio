import type { APIRoute } from 'astro';
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

const COLLECTIONS = {
  essays: { directory: 'src/content/essays', folderEntry: true, keystaticKey: 'essays' },
  'ai-design': { directory: 'src/content/ai-design', folderEntry: true, keystaticKey: 'aiDesign' },
  notes: { directory: 'src/content/notes', folderEntry: false, keystaticKey: 'notes' },
  work: { directory: 'src/content/work', folderEntry: true, keystaticKey: 'work' },
} as const;

type CollectionName = keyof typeof COLLECTIONS;

const MAX_MARKDOWN_SIZE = 4 * 1024 * 1024;
const MAX_IMAGE_SIZE = 25 * 1024 * 1024;
const MAX_TOTAL_IMAGE_SIZE = 120 * 1024 * 1024;
const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function getText(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

async function exists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function stripFrontmatter(markdown: string) {
  const source = markdown.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  if (!source.startsWith('---\n')) return source.trimStart();

  const closing = source.match(/\n(?:---|\.\.\.)[ \t]*\n/);
  if (!closing || closing.index === undefined) return source.trimStart();
  return source.slice(closing.index + closing[0].length).trimStart();
}

function yamlString(value: string) {
  return JSON.stringify(value);
}

function safeSlug(value: string) {
  return (
    value.length > 0 &&
    value.length <= 100 &&
    value !== '.' &&
    value !== '..' &&
    !value.includes('/') &&
    !value.includes('\\') &&
    /^[\p{Letter}\p{Number}][\p{Letter}\p{Number}._-]*$/u.test(value)
  );
}

function normaliseFilename(value: string) {
  const extension = path.extname(value).toLowerCase();
  const basename = path.basename(value, path.extname(value));
  const clean = basename
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{Letter}\p{Number}._-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^[._-]+|[._-]+$/g, '') || 'image';
  return `${clean}${extension}`;
}

function uniqueFilename(filename: string, used: Set<string>) {
  const extension = path.extname(filename);
  const basename = path.basename(filename, extension);
  let candidate = filename;
  let index = 2;
  while (used.has(candidate)) {
    candidate = `${basename}-${index}${extension}`;
    index += 1;
  }
  used.add(candidate);
  return candidate;
}

function replaceEvery(source: string, search: string, replacement: string) {
  return search && search !== replacement ? source.split(search).join(replacement) : source;
}

function resolveEntry(collectionName: CollectionName, slug: string) {
  const collection = COLLECTIONS[collectionName];
  const root = process.cwd();
  const collectionDirectory = path.join(root, collection.directory);
  const entryDirectory = collection.folderEntry
    ? path.join(collectionDirectory, slug)
    : collectionDirectory;
  const markdownPath = collection.folderEntry
    ? path.join(entryDirectory, 'index.md')
    : path.join(collectionDirectory, `${slug}.md`);
  const imageDirectory = collection.folderEntry
    ? entryDirectory
    : path.join(collectionDirectory, slug);

  return { collection, root, collectionDirectory, entryDirectory, markdownPath, imageDirectory };
}

export const GET: APIRoute = async ({ url }) => {
  if (import.meta.env.PROD) {
    return json(403, { error: '文章导入仅在本地编辑环境开放。' });
  }

  const collectionName = url.searchParams.get('collection') as CollectionName;
  const slug = url.searchParams.get('slug')?.trim() || '';
  if (!COLLECTIONS[collectionName] || !safeSlug(slug)) {
    return json(400, { error: '无法确认这次导入的文章。' });
  }

  const { collection, root, markdownPath } = resolveEntry(collectionName, slug);
  if (!await exists(markdownPath)) return json(404, { exists: false });

  return json(200, {
    exists: true,
    path: path.relative(root, markdownPath),
    editorUrl: `/keystatic/collection/${collection.keystaticKey}/item/${encodeURIComponent(slug)}`,
  });
};

export const POST: APIRoute = async ({ request }) => {
  if (import.meta.env.PROD) {
    return json(403, { error: '文章导入仅在本地编辑环境开放。' });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { error: '无法读取导入文件，请重新选择。' });
  }

  const collectionName = getText(form, 'collection') as CollectionName;
  const collection = COLLECTIONS[collectionName];
  const title = getText(form, 'title');
  const date = getText(form, 'date');
  const slug = collectionName === 'notes' ? date : getText(form, 'slug');
  const summary = getText(form, 'summary');
  const metaLeft = getText(form, 'metaLeft');
  const metaRight = getText(form, 'metaRight');
  let cover = getText(form, 'cover');
  const markdownFile = form.get('markdown');
  const imageFiles = form.getAll('images').filter((value): value is File => value instanceof File);

  if (!collection) return json(400, { error: '请选择正确的内容类型。' });
  if (!title) return json(400, { error: '请填写文章标题。' });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json(400, { error: '请选择正确的发布日期。' });
  if (!safeSlug(slug)) return json(400, { error: 'Slug 只能包含文字、数字、点、短横线和下划线。' });
  if (!(markdownFile instanceof File)) return json(400, { error: '请选择 Markdown 文件。' });
  if (markdownFile.size > MAX_MARKDOWN_SIZE) return json(413, { error: 'Markdown 文件不能超过 4 MB。' });
  if (collectionName === 'work' && (!summary || !cover || !metaLeft || !metaRight)) {
    return json(400, { error: 'Work 项目需要摘要、封面图和两项元信息。' });
  }

  const originalPaths = (() => {
    try {
      const parsed = JSON.parse(getText(form, 'imageOriginalPaths'));
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  })();

  let totalImageSize = 0;
  for (const image of imageFiles) {
    totalImageSize += image.size;
    if (image.size > MAX_IMAGE_SIZE) return json(413, { error: `${image.name} 超过 25 MB。` });
    if (!IMAGE_EXTENSIONS.has(path.extname(image.name).toLowerCase())) {
      return json(400, { error: `${image.name} 不是支持的图片格式。` });
    }
  }
  if (totalImageSize > MAX_TOTAL_IMAGE_SIZE) return json(413, { error: '图片总大小不能超过 120 MB。' });

  const { root, collectionDirectory, entryDirectory, markdownPath, imageDirectory } = resolveEntry(collectionName, slug);

  if (await exists(markdownPath)) {
    return json(409, { error: '这个 Slug 已经存在，请换一个再导入。' });
  }
  if (!collection.folderEntry && imageFiles.length > 0 && await exists(imageDirectory)) {
    return json(409, { error: '这个日期已有图片文件夹，请更换日期或先检查已有内容。' });
  }

  let body = stripFrontmatter(await markdownFile.text());
  const usedNames = new Set<string>();
  const imageEntries = imageFiles.map((file, index) => {
    const originalPath = (originalPaths[index] || file.name).replace(/\\/g, '/');
    const filename = uniqueFilename(normaliseFilename(file.name), usedNames);
    const reference = collection.folderEntry ? filename : `./${slug}/${filename}`;
    return { file, filename, originalPath, reference };
  });

  for (const image of imageEntries) {
    let decodedOriginalPath = image.originalPath;
    try {
      decodedOriginalPath = decodeURIComponent(image.originalPath);
    } catch {
      // Keep the original path when an exported filename contains an unmatched % sign.
    }
    const candidates = new Set([
      image.originalPath,
      image.originalPath.replace(/^\.\//, ''),
      path.basename(image.originalPath),
      decodedOriginalPath,
    ]);
    for (const candidate of candidates) body = replaceEvery(body, candidate, image.reference);
    if (cover && candidates.has(cover.replace(/^\.\//, ''))) cover = image.filename;
  }

  const frontmatter = [
    '---',
    `title: ${yamlString(title)}`,
    `date: ${date}`,
    ...(collectionName !== 'notes' ? [`summary: ${yamlString(summary)}`] : []),
    ...(collectionName !== 'notes' && cover ? [`cover: ${yamlString(cover)}`] : []),
    ...(collectionName === 'work' ? [
      `metaLeft: ${yamlString(metaLeft)}`,
      `metaRight: ${yamlString(metaRight)}`,
    ] : []),
    '---',
    '',
  ].join('\n');

  let createdEntryDirectory = false;
  try {
    if (collection.folderEntry) {
      await mkdir(entryDirectory, { recursive: false });
      createdEntryDirectory = true;
    } else {
      await mkdir(collectionDirectory, { recursive: true });
      if (imageEntries.length > 0) await mkdir(imageDirectory, { recursive: false });
    }

    await writeFile(markdownPath, `${frontmatter}${body.trimEnd()}\n`, { flag: 'wx' });
    for (const image of imageEntries) {
      await writeFile(path.join(imageDirectory, image.filename), Buffer.from(await image.file.arrayBuffer()), { flag: 'wx' });
    }
  } catch (error) {
    if (createdEntryDirectory) await rm(entryDirectory, { recursive: true, force: true });
    else {
      await rm(markdownPath, { force: true });
      if (imageEntries.length > 0) await rm(imageDirectory, { recursive: true, force: true });
    }
    console.error('Import article failed', error);
    return json(500, { error: '写入文章时失败，没有保留未完成的文件。' });
  }

  return json(201, {
    message: '文章已导入',
    path: path.relative(root, markdownPath),
    editorUrl: `/keystatic/collection/${collection.keystaticKey}/item/${encodeURIComponent(slug)}`,
  });
};

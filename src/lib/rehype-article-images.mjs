// Add responsive variants before Astro resolves local Markdown image imports.
// Keep the full-size `src` for the existing click-to-enlarge preview.
export default function rehypeArticleImages() {
  return (tree, file) => {
    const localImages = new Set(file.data.astro?.localImagePaths ?? []);
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'img') {
        const properties = node.properties ?? {};
        const src = typeof properties.src === 'string' ? decodeURI(properties.src) : '';
        if (localImages.has(src) && !/\.(?:svg|gif)$/i.test(src)) {
          Object.assign(properties, {
            widths: [480, 800, 1440],
            sizes: '(max-width: 720px) calc(100vw - 48px), 712px',
            quality: 85,
            loading: 'lazy',
            decoding: 'async',
          });
        }
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

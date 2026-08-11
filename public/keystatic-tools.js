(() => {
  const localHosts = new Set(['localhost', '127.0.0.1']);
  if (!localHosts.has(location.hostname)) return;

  const addImportTool = () => {
    const nav = document.querySelector('nav');
    if (!nav || nav.querySelector('.luyao-editor-tools')) return;

    const section = document.createElement('div');
    section.className = 'luyao-editor-tools';
    section.innerHTML = `
      <span class="luyao-editor-tools__label">\u5199\u4f5c\u5de5\u5177</span>
      <a class="luyao-editor-tools__link" href="/admin/import">
        <span>\u5bfc\u5165\u6587\u7ae0</span>
        <span class="luyao-editor-tools__badge" aria-hidden="true">MD</span>
      </a>
    `;
    nav.appendChild(section);
  };

  addImportTool();
  const observer = new MutationObserver(addImportTool);
  observer.observe(document.body, { childList: true, subtree: true });
})();

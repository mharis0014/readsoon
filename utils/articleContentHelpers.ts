export type ReaderTheme = 'light' | 'sepia' | 'dark';

// ---------- Helpers for default (RenderHTML) mode ----------
export const formatDescription = (text: string): string => {
  if (!text) return "";
  let formattedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

  const headingPatterns = [
    { pattern: /^[A-Z\s]{3,50}$/, level: 1 },
    { pattern: /^[A-Z][^.!?]{2,80}:$/, level: 1 },
    { pattern: /^##\s*(.+)$/, level: 2 },
    { pattern: /^[A-Z][^.!?]{10,120}:$/, level: 2 },
    { pattern: /^###\s*(.+)$/, level: 3 },
    { pattern: /^[A-Z][^.!?]{5,60}$/, level: 3 },
  ];

  const listPatterns = [
    { pattern: /^[-*•]\s+(.+)$/, type: "ul" },
    { pattern: /^\d+\.\s+(.+)$/, type: "ol" },
    { pattern: /^[a-z]\.\s+(.+)$/, type: "ol" },
  ];

  const lines = formattedText.split("\n");
  const out: string[] = [];
  let inList = false;
  let listType: string | null = null;
  let listItems: string[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (inList && listItems.length > 0) {
        out.push(`<${listType} class="list-${listType === "ul" ? "disc" : "decimal"} list-inside mb-4 space-y-2">${listItems.join("")}</${listType}>`);
        listItems = []; inList = false;
      }
      out.push(""); continue;
    }
    // headings
    let isHeading = false;
    for (const h of headingPatterns) {
      if (h.pattern.test(line)) {
        const lvl = h.level;
        const txt = line.replace(/^[#\s]+/, "").replace(/:$/, "");
        out.push(`<h${lvl} class="text-${lvl === 1 ? "3xl" : lvl === 2 ? "2xl" : "xl"} font-bold mb-4 mt-8">${txt}</h${lvl}>`);
        isHeading = true; break;
      }
    }
    if (isHeading) continue;

    // lists
    let isList = false;
    for (const l of listPatterns) {
      if (l.pattern.test(line)) {
        const c = line.replace(l.pattern, "$1");
        if (!inList || listType !== l.type) {
          if (inList && listItems.length > 0) {
            out.push(`<${listType} class="list-${listType === "ul" ? "disc" : "decimal"} list-inside mb-4 space-y-2">${listItems.join("")}</${listType}>`);
          }
          listItems = []; inList = true; listType = l.type;
        }
        listItems.push(`<li class="mb-2 leading-7">${c}</li>`);
        isList = true; break;
      }
    }
    if (isList) continue;

    // quotes
    if (line.startsWith('"') && line.endsWith('"')) {
      out.push(`<blockquote class="border-l-4 border-gray-300 pl-6 py-2 my-6 italic text-lg">${line}</blockquote>`);
      continue;
    }
    // code fence / inline
    if (line.startsWith("```") || (line.startsWith("`") && line.endsWith("`"))) {
      const code = line.replace(/^```|`/g, "").replace(/`$/, "");
      out.push(`<div class="bg-gray-100 px-4 py-3 rounded-lg text-sm font-mono mb-4 overflow-x-auto">${code}</div>`);
      continue;
    }

    if (inList && listItems.length > 0) {
      out.push(`<${listType} class="list-${listType === "ul" ? "disc" : "decimal"} list-inside mb-4 space-y-2">${listItems.join("")}</${listType}>`);
      listItems = []; inList = false;
    }
    out.push(line);
  }
  if (inList && listItems.length > 0) {
    out.push(`<${listType} class="list-${listType === "ul" ? "disc" : "decimal"} list-inside mb-4 space-y-2">${listItems.join("")}</${listType}>`);
  }
  formattedText = out.join("\n");

  if (!formattedText.includes("\n\n") && formattedText.length > 300) {
    const sentences = formattedText.match(/[^.!?]+[.!?]+/g) || [];
    const paragraphs: string[] = [];
    let seg: string[] = [];
    for (const s of sentences) {
      seg.push(s.trim());
      if (seg.length >= 3) { paragraphs.push(seg.join(" ")); seg = []; }
    }
    if (seg.length) paragraphs.push(seg.join(" "));
    formattedText = paragraphs.join("\n\n");
  }

  const paragraphs = formattedText.split("\n\n").map(p => {
    const t = p.trim(); if (!t) return "";
    if (t.startsWith("<")) return t;
    if (t.includes("\n")) {
      return `<p class="mb-4 leading-7">${t.split("\n").map(l => l.trim()).join("<br>")}</p>`;
    }
    return `<p class="mb-4 leading-7">${t}</p>`;
  }).join("");

  return paragraphs
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
};

// ---------- Helpers for Reading Mode (WebView) ----------
export const safeHTML = (html: string) =>
  (html || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');

export const wrapPlainText = (body: string) => {
  const trimmed = (body || '').trim();
  if (!trimmed) return '';
  const looksLikeHTML = /<\/?[a-z][\s\S]*>/i.test(trimmed);
  if (looksLikeHTML) return trimmed;
  return trimmed
    .split(/\n{2,}/)
    .map(p => `<p class="mb">${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
};

export const themeVars = (t: ReaderTheme) => {
  switch (t) {
    case 'sepia':
      return `
        --bg: #f4ecd8; --fg: #5b4636; --muted: #7b6551; --border: #dccfb8;
        --blockquote: #8b7355; --mark: #ffe8a3;
      `;
    case 'dark':
      return `
        --bg: #0f172a; --fg: #e5e7eb; --muted: #94a3b8; --border: #334155;
        --blockquote: #475569; --mark: #fbbf24;
      `;
    default:
      return `
        --bg: #ffffff; --fg: #111827; --muted: #6b7280; --border: #e5e7eb;
        --blockquote: #e5e7eb; --mark: #fff59d;
      `;
  }
};

export const buildHtml = ({
  inner,
  theme,
  fontSize,
  title,
  selectionBackground,
  selectionText,
  highlightButtonBackground,
  highlightButtonText,
  savedHighlightBackground
}: {
  inner: string;
  theme: ReaderTheme;
  fontSize: number;
  title?: string;
  selectionBackground?: string;
  selectionText?: string;
  highlightButtonBackground?: string;
  highlightButtonText?: string;
  savedHighlightBackground?: string;
}) => `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1, shrink-to-fit=no, maximum-scale=1.0" />
<style>
  :root { ${themeVars(theme)} }
  html,body{background:var(--bg);color:var(--fg);padding:0;margin:0;-webkit-touch-callout:none;}
  #shell{padding-bottom:40px;}
  #content{padding: 0 16px; line-height:1.8; font-size:${fontSize}px; word-break: break-word;}
  h1{font-size:${Math.max(22, fontSize + 6)}px;font-weight:800;margin:20px 0 10px;}
  h2{font-size:${Math.max(20, fontSize + 2)}px;font-weight:700;margin:18px 0 8px;}
  h3{font-size:${Math.max(18, fontSize)}px;font-weight:700;margin:16px 0 8px;}
  p,li{font-size:${fontSize}px;margin:0 0 16px 0;}
  ul,ol{padding-left:20px;margin:8px 0 20px;}
  blockquote{border-left:4px solid var(--blockquote);padding-left:12px;margin:16px 0;color:var(--muted);}
  code{background:rgba(148,163,184,0.15);padding:2px 4px;border-radius:4px;}
  mark[data-highlight]{background: ${savedHighlightBackground || 'var(--mark)'}; border-radius:.2em; -webkit-box-decoration-break:clone; box-decoration-break:clone;}

  /* Text selection colors */
  ::selection {
    background: ${selectionBackground || '#60a5fa'};
    color: ${selectionText || '#ffffff'};
  }
  ::-moz-selection {
    background: ${selectionBackground || '#60a5fa'};
    color: ${selectionText || '#ffffff'};
  }

  /* Selection toolbar for "Highlight" */
  #hl-toolbar{position:absolute;z-index:99999;background:${highlightButtonBackground || '#111827'};color:${highlightButtonText || '#fff'};font-size:14px;padding:8px 10px;border-radius:8px;display:none;box-shadow:0 4px 12px rgba(0,0,0,.15);user-select:none;}
  #hl-toolbar .btn{display:inline-block;padding:0 6px;font-weight:600;}
  .mb{margin-bottom:16px;}
  .meta{opacity:.85;font-size:${Math.max(12, fontSize - 2)}px;margin-bottom:10px;}
  .divider{height:1px;background:var(--border);margin:14px 0;}
</style>
</head>
<body>
<div id="shell">
  <div id="content">
    ${title ? `<h1>${title}</h1>` : ''}
    <div class="divider"></div>
    ${inner}
  </div>
</div>
<div id="hl-toolbar"><span class="btn" id="btn-highlight">Highlight</span></div>

<script>
(function(){
  const RN = window.ReactNativeWebView;
  const contentEl = document.getElementById('content');
  const bar = document.getElementById('hl-toolbar');
  const btnHighlight = document.getElementById('btn-highlight');
  let lastRange = null;

  function saveToRN(){ try{ RN.postMessage(JSON.stringify({ type:'save', html: contentEl.innerHTML })); }catch(e){} }
  function clearUI(){
    bar.style.display='none';
    const sel = window.getSelection(); if (sel) sel.removeAllRanges();
    lastRange = null;
  }
  function inside(node){
    if(!node) return false;
    if(node === contentEl) return true;
    return contentEl.contains(node.nodeType === Node.TEXT_NODE ? node.parentNode : node);
  }
  function valid(range){
    if (!range) return false;
    if (!inside(range.commonAncestorContainer)) return false;
    let n = range.commonAncestorContainer;
    if (n.nodeType === Node.TEXT_NODE) n = n.parentElement;
    if (n && n.closest && n.closest('mark[data-highlight]')) return false;
    const frag = range.cloneContents();
    if (frag && frag.querySelector && frag.querySelector('mark[data-highlight]')) return false;
    return true;
  }
  function placeToolbar(range){
    try{
      const rect = range.getBoundingClientRect();
      const top = Math.max(8, rect.top + window.scrollY - 44);
      const left = Math.max(8, rect.left + window.scrollX);
      bar.style.top = top + 'px';
      bar.style.left = left + 'px';
      bar.style.display = 'block';
    }catch(e){ bar.style.display='none'; }
  }

  document.addEventListener('selectionchange', function(){
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) { bar.style.display='none'; return; }
    const r = sel.getRangeAt(0);
    if (sel.isCollapsed || sel.toString().trim().length === 0) { bar.style.display='none'; return; }
    if (!valid(r)) { bar.style.display='none'; return; }
    lastRange = r;
    placeToolbar(r);
  });

  btnHighlight.addEventListener('click', function(){
    try{
      if (!lastRange || !valid(lastRange)) { clearUI(); return; }
      const mark = document.createElement('mark');
      mark.setAttribute('data-highlight','true');
      mark.appendChild(lastRange.extractContents());
      lastRange.insertNode(mark);
      mark.parentNode && mark.parentNode.normalize();
      saveToRN();
    }catch(e){}
    clearUI();
  });

  contentEl.addEventListener('click', function(e){
    const t = e.target;
    if (t && t.tagName === 'MARK' && t.getAttribute('data-highlight')) {
      const parent = t.parentNode;
      const frag = document.createDocumentFragment();
      while(t.firstChild){ frag.appendChild(t.firstChild); }
      parent.replaceChild(frag, t);
      parent.normalize();
      saveToRN();
      clearUI();
      e.preventDefault(); e.stopPropagation();
    }
  }, true);

  RN && RN.postMessage(JSON.stringify({ type:'ready' }));
})();
</script>
</body>
</html>`;

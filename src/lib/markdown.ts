const AMP = ["&", "amp;"].join("");
const LT = ["&", "lt;"].join("");
const GT = ["&", "gt;"].join("");
const QUOT = ["&", "quot;"].join("");

function escapeHtml(src: string) {
  return src
    .replace(/&/g, AMP)
    .replace(/</g, LT)
    .replace(/>/g, GT)
    .replace(/"/g, QUOT);
}

function inline(src: string) {
  return escapeHtml(src)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\((https?:[^)]+)\)/g,
      '<a href="$2" rel="noopener noreferrer">$1</a>',
    );
}

export function renderMarkdown(md: string) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (!line.trim()) {
      i += 1;
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2] ?? "")}</h${level}>`);
      i += 1;
      continue;
    }
    if (line.startsWith("> ")) {
      out.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`);
      i += 1;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i] ?? "").startsWith("- ")) {
        items.push(`<li>${inline((lines[i] ?? "").slice(2))}</li>`);
        i += 1;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      (lines[i] ?? "").trim() &&
      !/^(#{1,3}\s|- |> )/.test(lines[i] ?? "")
    ) {
      para.push(lines[i] ?? "");
      i += 1;
    }
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }
  return out.join("\n");
}

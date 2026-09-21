/* 卡片模式（配合 markdown-it-card 插件）
 * ------------------------------------------------------------------
 * 卡片模式把每个顶层 --- 区间包成 <section class="card">，卡片高度跟内容走，
 * 可以单独截图分享。本文件只提供卡片该有的骨架：
 *
 *   卡片外框 / 编号 01、02 / 金句面板 / 隐藏分卡符 / 代码块圆角
 *
 * 标题、正文、引用、代码的配色与排版一律交给当前主题；骨架里的强调色
 * （编号徽章、金句面板）从所选主题提取的主色生成（见 extractAccent），
 * 换主题卡片整体跟着变。卡片外框保持中性（白底 + 浅灰描边），
 * 无论什么主题都能直接贴进公众号。本样式只在「卡片模式」开关打开时注入，
 * 关闭时对应的 style 标签为空，对其它主题零影响。
 *
 * 写作约定（技术卡四件套，非技术卡可以省略代码和结果）：
 *
 *   ## 标题          ← 标题
 *   正文段落……       ← 正文
 *   \`\`\`js          ← 代码
 *   > 结果：……       ← 结果
 *   **金句**         ← 整段只有一处加粗
 *   ---
 *
 * ⚠️ 分隔线 --- 建议【前面留一个空行】。正文紧跟着写 ---（中间没有空行）时
 *    markdown 会把它当成 setext 二级标题下划线，那一行会变成标题、而且不产生
 *    分割线。插件已经把这种情况还原成段落并补回分割线，但仍建议照常写空行。
 *
 * 想在卡片里画一条真正的分割线，用 *** 或 ___（不要用 ---，那是分卡符）。
 *
 * 本文件刻意不用 @media / display:flex / position:absolute / CSS 计数器 / :has()，
 * 因为这些在「juice 内联 → 粘贴到公众号」这条链路上会被丢弃或破坏，导致预览与实际不符。
 * ------------------------------------------------------------------ */

const FALLBACK_ACCENT = "#4a5bd6";

// 主题里的颜色写法：#abc / #aabbcc / #aabbccdd / rgb() / rgba() / hsl() / hsla()
export const parseColor = (value) => {
  if (!value) {
    return null;
  }
  const str = String(value).trim();
  let match = str.match(/^#([0-9a-f]{3,8})$/i);

  if (match) {
    let hex = match[1];
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length !== 6 && hex.length !== 8) {
      return null;
    }
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  match = str.match(/^rgba?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)/i);
  if (match) {
    return {r: Math.round(+match[1]), g: Math.round(+match[2]), b: Math.round(+match[3])};
  }

  match = str.match(/^hsla?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)%\s*[,\s]\s*([\d.]+)%/i);
  if (match) {
    const h = (((+match[1] % 360) + 360) % 360) / 360;
    const s = +match[2] / 100;
    const l = +match[3] / 100;
    if (s === 0) {
      const v = Math.round(l * 255);
      return {r: v, g: v, b: v};
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const channel = (t) => {
      let x = t;
      if (x < 0) x += 1;
      if (x > 1) x -= 1;
      if (x < 1 / 6) return p + (q - p) * 6 * x;
      if (x < 1 / 2) return q;
      if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
      return p;
    };
    return {
      r: Math.round(channel(h + 1 / 3) * 255),
      g: Math.round(channel(h) * 255),
      b: Math.round(channel(h - 1 / 3) * 255),
    };
  }

  return null;
};

const toHex = ({r, g, b}) => "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");

// 平均亮度太高（近白）当没用
const isTooLight = ({r, g, b}) => (r + g + b) / 3 > 230;
// 灰阶（水墨、极简黑这类通篇无彩色的主题）不算强调色
const isGrayscale = ({r, g, b}) => Math.max(r, g, b) - Math.min(r, g, b) <= 12;

const stripComments = (css) => String(css || "").replace(/\/\*[\s\S]*?\*\//g, "");

const selectorBlocks = (css) => {
  const blocks = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let match = re.exec(css);
  while (match) {
    blocks.push({
      selectors: match[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      body: match[2],
    });
    match = re.exec(css);
  }
  return blocks;
};

const propValue = (body, name) => {
  const match = body.match(new RegExp("(?:^|;)\\s*" + name + "\\s*:\\s*([^;]+)", "i"));
  return match ? match[1].trim() : "";
};

// border-left: 3px solid #xxx 与 border-left-color: #xxx 都认
const borderColorOf = (body) => {
  const direct = propValue(body, "border-left-color");
  if (direct) {
    return direct;
  }
  const shorthand = propValue(body, "border-left");
  const found = shorthand.match(/#[0-9a-f]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)/i);
  return found ? found[0] : "";
};

const valueFor = (blocks, selector, getter) => {
  const matched = blocks.filter((block) => block.selectors.indexOf(selector) !== -1);
  for (let i = 0; i < matched.length; i += 1) {
    const value = getter(matched[i].body);
    if (value) {
      return value;
    }
  }
  return "";
};

// 从主题 CSS 里按优先级猜主色：二级标题 → 三级标题 → 引用线 → 链接。
// 候选里先挑彩色的；整篇没有彩色的主题（水墨、极简黑）退一步接受中性灰；
// 什么都找不到才用兜底靛蓝。返回 #rrggbb。
export const extractAccent = (themeCss) => {
  const blocks = selectorBlocks(stripComments(themeCss));
  const from = (selector, getter) => valueFor(blocks, selector, getter);
  const color = (name) => (body) => propValue(body, name);
  const candidates = [
    from("#nice h2 .content", color("color")),
    from("#nice h2 .content", borderColorOf),
    from("#nice h2 .content", color("background-color")),
    from("#nice h2", color("color")),
    from("#nice h2", borderColorOf),
    from("#nice h2", color("background-color")),
    from("#nice h3 .content", color("color")),
    from("#nice h3 .content", borderColorOf),
    from("#nice h3 .content", color("background-color")),
    from("#nice h3", color("color")),
    from("#nice blockquote", borderColorOf),
    from("#nice a", color("color")),
    from("#nice .multiquote-1", borderColorOf),
  ];

  const usable = (value, allowGrayscale) => {
    const rgb = parseColor(value);
    if (!rgb || isTooLight(rgb)) {
      return null;
    }
    if (!allowGrayscale && isGrayscale(rgb)) {
      return null;
    }
    return rgb;
  };

  const pick = (allowGrayscale) => {
    for (let i = 0; i < candidates.length; i += 1) {
      const rgb = usable(candidates[i], allowGrayscale);
      if (rgb) {
        return toHex(rgb);
      }
    }
    return "";
  };

  return pick(false) || pick(true) || FALLBACK_ACCENT;
};

// 用主题主色生成卡片骨架样式；不传就用兜底色
export default (accent = FALLBACK_ACCENT) => {
  const rgb = parseColor(accent) || parseColor(FALLBACK_ACCENT);
  const accentHex = toHex(rgb);
  const tint = (alpha) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  const shade = (ratio) =>
    `rgb(${Math.round(rgb.r * (1 - ratio))}, ${Math.round(rgb.g * (1 - ratio))}, ${Math.round(rgb.b * (1 - ratio))})`;

  return `/* 分卡符（---）本身藏掉，卡片之间的间距由卡片自身的 margin 提供。
   只藏 .card-sep：*** 和 ___ 是作者画的分割线，照常显示。
   特异性 (1,1,1) 高于主题里的 #nice hr (1,0,1)，平局也稳。 */
#nice > hr.card-sep {
  display: none;

  height: 0;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
}

/* =========================================================
   卡片外框（保持中性，不跟随主题）
   ========================================================= */

#nice .card {
  box-sizing: border-box;

  margin: 0 0 16px;
  padding: 24px 18px;

  background: #ffffff;
  border: 1px solid #e7e9ef;
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(24, 30, 50, 0.04);
}

#nice .card > *:last-child {
  margin-bottom: 0;
}

/* =========================================================
   卡片编号（插件写入的真实文本；配色取主题主色）
   ========================================================= */

#nice .card-no {
  display: inline-block;

  margin: 0 0 14px;
  padding: 3px 9px;

  border-radius: 99px;
  background: ${tint(0.12)};
  color: ${shade(0.12)};

  font-family: Menlo, Consolas, "Courier New", monospace;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 1px;
}

/* =========================================================
   金句：整段只有一处加粗的段落（配色取主题主色）
   ========================================================= */

/* class 由 markdown-it-card 插件在 token 流里打，不要用 p > strong:only-child——
   juice 的 cheerio 不把文本节点算作兄弟节点，预览正常但粘进公众号会误判 */
#nice .card strong.card-punch {
  display: block;

  margin: 18px 0 0;
  padding: 13px 15px;

  border-left: 3px solid ${accentHex};
  border-radius: 0 10px 10px 0;
  background: ${tint(0.09)};

  font-size: 16px;
  font-weight: 700;
  line-height: 1.75;
  color: ${shade(0.5)};

  text-align: left;
}

/* =========================================================
   代码块外形（配色交给代码主题）
   ========================================================= */

#nice .card pre.custom {
  margin: 14px 0 16px;

  border-radius: 10px;
  overflow: hidden;
}
`;
};

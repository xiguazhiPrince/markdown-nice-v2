// 卡片模式的分卡插件。
//
// 约定：顶层（不在引用 / 列表里）的 --- 是一张卡片的结束符，内容写在 --- 之前。
//
// 这个文件做两件事：
//   1. 还原 setext —— markdown 会把紧跟在正文下一行的 --- 当成二级标题下划线，
//      那一行会变成 <h2> 而且【不产生 hr token】，卡片就分不开。这里把它还原成段落，
//      并把被吃掉的 hr 补回来。
//   2. 按顶层 hr 把 token 流切成若干区间，每段包进 <section class="card">。
//
// 插件通过 state.env.cardMode 自我门禁：卡片模式关闭时 env 里没有这个标记，
// 两个规则都直接返回，产物与原生 markdown-it 完全一致。
//
// 编号（01 / 02…）必须是真实文本节点：CSS 计数器会被 juice 破坏
// （content: counter(c) 会被实体化成字面量 "ounter(c"），所以编号由插件写死。

const DEFAULT_OPTIONS = {
  cardClass: "card",
  cardNoClass: "card-no",
  cardNumber: true, // 是否在每张卡片开头输出 01 这样的编号
  cardSepClass: "card-sep", // 分卡符本身的标记，卡片模式的 CSS 用它把分隔线藏掉
  punchClass: "card-punch", // 金句（整段只有一处加粗）的标记
};

// 需要看 token.content 才知道有没有内容的块级 token
const RAW_CONTENT_TOKENS = {
  fence: true,
  code_block: true,
  html_block: true,
  math_block: true,
};

// markdownItSpan 注入的 `<span class="prefix/content/suffix">`
const SPAN_CLASS_RE = /class="(prefix|content|suffix)"/;

const formatCardNo = (n) => (n < 10 ? "0" + n : String(n));

// 区间 [from, to) 里是否存在可见内容
const hasContent = (tokens, from, to) => {
  for (let i = from; i < to; i++) {
    const token = tokens[i];

    if (token.type === "imageFlow") {
      return true; // 图片存在 meta 里
    }

    if (token.type === "inline") {
      if (token.content && token.content.trim() !== "") {
        return true;
      }
      if (token.children && token.children.length > 0) {
        return true;
      }
      continue;
    }

    if (RAW_CONTENT_TOKENS[token.type] && token.content && token.content.trim() !== "") {
      return true;
    }
  }
  return false;
};

// 只有 --- 是分卡符。
// *** 和 ___ 同样产出 hr token，但它们是留给作者画真正的分割线用的，
// markdown-it 把实际写下的字符放在 markup 里（"---" / "***" / "___"），据此区分。
// 用 /^-+$/ 而不是全等，这样 ----- 这类写法也认。
const isCardSeparator = (token) => token.type === "hr" && /^-+$/.test(token.markup || "");

// 找出所有「顶层」hr 的下标。
// state.tokens 是一维数组，靠 nesting 累加/递减还原块级嵌套深度：
// 先出栈再判断，保证 blockquote_close 之后深度已经回到 0，
// 这样引用块里的 --- 不会被误当成分卡符。
const collectTopLevelHr = (tokens) => {
  const result = [];
  let depth = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.nesting < 0) {
      depth -= 1;
    }
    if (depth === 0 && isCardSeparator(token)) {
      result.push(i);
    }
    if (token.nesting > 0) {
      depth += 1;
    }
  }

  return result;
};

// setext 标题还原。
// markup 为 "-" 才是 setext（atx 的 ## 是 "##"；"===" 是 h1，不动）。
const makeUnsetextRule = () => {
  return function restoreSetext(state) {
    if (!state.env || !state.env.cardMode) {
      return;
    }

    const {tokens} = state;

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== "heading_open" || tokens[i].markup !== "-") {
        continue;
      }

      tokens[i].type = "paragraph_open";
      tokens[i].tag = "p";

      const inline = tokens[i + 1];
      const close = tokens[i + 2];

      // 变成段落后，markdownItSpan 塞进来的 prefix/content/suffix span 必须拆掉，
      // 否则金句的 `p > strong:only-child` 选择器会失效。
      // 在这里处理而不是靠 core.ruler.before 抢顺序，是为了跟两个插件的注册先后无关。
      if (inline && inline.children) {
        inline.children = inline.children.filter((child) => !SPAN_CLASS_RE.test(child.content || ""));
      }

      if (close && close.type === "heading_close") {
        close.type = "paragraph_close";
        close.tag = "p";
      }

      // 光还原成段落不够：--- 那一行已经被 setext 解析吃掉了，
      // 不补回 hr 的话卡片依然分不开。
      // markup 必须设成 "---"，否则它过不了 isCardSeparator 的检查。
      const hr = new state.Token("hr", "hr", 0);
      hr.block = true;
      hr.markup = "---";
      hr.map = tokens[i].map;
      tokens.splice(i + 3, 0, hr);
    }
  };
};

// 判断一个段落是不是「整段只有一处加粗」—— 也就是金句。
const isWholeParagraphStrong = (inline) => {
  if (!inline || inline.type !== "inline" || !inline.children) {
    return false;
  }

  // 忽略纯空白的文本节点，这样 `**金句** ` 后面拖个空格也算
  const kids = inline.children.filter((child) => !(child.type === "text" && child.content.trim() === ""));
  if (kids.length < 3) {
    return false;
  }
  if (kids[0].type !== "strong_open" || kids[kids.length - 1].type !== "strong_close") {
    return false;
  }

  // 加粗必须罩住整段：中途 nesting 回到 0，就说明 strong 之外还有别的内容
  // （比如 `**甲** 和 **乙**` 这种，首尾看着像，其实不是金句）
  let depth = 0;
  for (let i = 0; i < kids.length; i++) {
    depth += kids[i].nesting;
    if (depth === 0 && i < kids.length - 1) {
      return false;
    }
  }
  return depth === 0;
};

// 给金句打标记。
//
// 为什么不在 CSS 里用 `p > strong:only-child`：
// juice 用的 cheerio/css-select 把 :only-child 实现成了 :only-of-type 的语义 ——
// 它【不把文本节点算作兄弟节点】。于是 <p>这就是 <strong>Jev</strong> 。</p>
// 在浏览器里不匹配（正确），在 juice 里却匹配上了，
// 结果就是预览正常、粘进公众号后所有「整段只有一处加粗」的段落全变成金句面板。
// 所以这里在 token 流里判定（信息是精确的），打成 class 交给 CSS。
const makePunchlineRule = (options) => {
  return function markPunchlines(state) {
    if (!state.env || !state.env.cardMode) {
      return;
    }

    const {tokens} = state;
    let depth = 0;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // depth 为 0 表示这是卡片的顶层段落，排除引用块 / 列表里的段落 ——
      // 那些地方的加粗是强调，不该变成金句面板
      if (token.type === "paragraph_open" && depth === 0) {
        const inline = tokens[i + 1];
        if (isWholeParagraphStrong(inline)) {
          inline.children.filter((child) => child.type === "strong_open")[0].attrSet("class", options.punchClass);
        }
      }

      if (token.nesting < 0) {
        depth -= 1;
      } else if (token.nesting > 0) {
        depth += 1;
      }
    }
  };
};

const makeCardOpen = (state, index, options) => {
  const token = new state.Token("card_open", "section", 1);
  token.block = true;
  token.attrSet("class", options.cardClass);
  token.meta = {cardIndex: index};
  return token;
};

const makeCardNo = (state, index, options) => {
  const token = new state.Token("card_no", "section", 0);
  token.block = true;
  token.attrSet("class", options.cardNoClass);
  token.content = formatCardNo(index);
  return token;
};

const makeCardClose = (state) => {
  const token = new state.Token("card_close", "section", -1);
  token.block = true;
  return token;
};

const makeCardRule = (options) => {
  return function splitIntoCards(state) {
    if (!state.env || !state.env.cardMode) {
      return;
    }

    const {tokens} = state;
    const splits = collectTopLevelHr(tokens);

    // 给分卡符本身打个标记：保留它在 DOM 里（不删），由卡片模式的 CSS 藏掉。
    // 不能直接删也不能靠 CSS 选择器区分 —— 渲染成 <hr> 之后，
    // *** 和 ___ 产出的分割线跟它长得一模一样。
    splits.forEach((i) => tokens[i].attrSet("class", options.cardSepClass));

    // -1 与 length 是两端，中间的每个 hr 都是一个切点
    const bounds = [-1].concat(splits, [tokens.length]);
    const output = [];
    let cursor = 0;
    let cardIndex = 0;

    for (let k = 0; k < bounds.length - 1; k++) {
      const from = bounds[k] + 1; // 跳过作为分隔符的那个 hr
      const to = bounds[k + 1];

      // 空区间（开头就是 ---、连续两个 ---、结尾多余的 ---）不产生卡片。
      // 这里不动 cursor：这些 token 会在后面某次 flush 或收尾时原样带出去，
      // 保证不会有任何内容被吞掉。
      if (!hasContent(tokens, from, to)) {
        continue;
      }

      for (let i = cursor; i < from; i++) {
        output.push(tokens[i]);
      }

      cardIndex += 1;
      output.push(makeCardOpen(state, cardIndex, options));
      if (options.cardNumber) {
        output.push(makeCardNo(state, cardIndex, options));
      }
      for (let i = from; i < to; i++) {
        output.push(tokens[i]);
      }
      output.push(makeCardClose(state));

      cursor = to;
    }

    // 收尾：没内容的区间、末尾多余的 --- 都原样保留
    for (let i = cursor; i < tokens.length; i++) {
      output.push(tokens[i]);
    }

    state.tokens = output;
  };
};

export default (md, opts) => {
  // 不要写成 md.utils.assign(DEFAULT_OPTIONS, opts)：
  // markdown-it-span 那样写会污染模块级的默认值对象
  const options = md.utils.assign({}, DEFAULT_OPTIONS, opts);

  md.core.ruler.push("unsetext", makeUnsetextRule());
  md.core.ruler.push("card_punchline", makePunchlineRule(options));
  md.core.ruler.push("card_split", makeCardRule(options));

  md.renderer.rules.card_open = (tokens, idx) => '<section class="' + tokens[idx].attrGet("class") + '">\n';
  md.renderer.rules.card_close = () => "</section>\n";
  md.renderer.rules.card_no = (tokens, idx) =>
    '<section class="' + tokens[idx].attrGet("class") + '">' + tokens[idx].content + "</section>\n";
};

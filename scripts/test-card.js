/**
 * 卡片主题回归测试。
 *
 * 覆盖两块，这两块都出过问题、且都不容易靠眼睛发现：
 *
 *   1. 分卡逻辑（src/utils/markdown-it-card.js）—— 靠操作 markdown-it 的 token 流实现，
 *      跟 markdownItSpan / markdownItLi / markdownItLinkfoot 处在同一条 core 链上，
 *      改动任何一个插件都可能悄悄影响它。
 *   2. 主题 CSS 经 juice 内联后是否还活着（src/template/markdown/card.js）——
 *      juice 对不支持的选择器是【静默丢弃】的，预览里好好的，粘进公众号才没样式。
 *
 * 用法：
 *   yarn test:card          正常跑
 *   yarn test:card -v       额外打印渲染出的 HTML，便于排查
 *
 * 注意：仓库整体的 jest 配置是坏的（package.json 里有 CRA 不支持的选项），
 * 所以这里做成独立脚本，不依赖测试框架。
 */

"use strict";

const path = require("path");
const Module = require("module");
const babel = require("@babel/core");
const MarkdownIt = require("markdown-it");
const juice = require("juice");

const ROOT = path.resolve(__dirname, "..");
const VERBOSE = process.argv.includes("-v") || process.argv.includes("--verbose");

// src/ 下是 ESM，用 babel 转成 CJS 再 require
const loadSrc = (relPath) => {
  const filename = path.join(ROOT, relPath);
  const {code} = babel.transformFileSync(filename, {
    plugins: [require.resolve("@babel/plugin-transform-modules-commonjs")],
    babelrc: false,
    configFile: false,
  });
  const mod = new Module(filename, null);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod._compile(code, filename);
  return mod.exports;
};

const defaultOf = (mod) => (mod && mod.__esModule ? mod.default : mod);

const markdownItCard = defaultOf(loadSrc("src/utils/markdown-it-card.js"));
const markdownItSpan = defaultOf(loadSrc("src/utils/markdown-it-span.js"));
const markdownItLiReplacer = defaultOf(loadSrc("src/utils/markdown-it-li.js"));
const cardTheme = defaultOf(loadSrc("src/template/markdown/card.js"));
const basicTheme = defaultOf(loadSrc("src/template/basic.js"));

// 复刻 helper.js 里两条解析链共同的部分（微信链多一个 removepre，与分卡无关）
const buildParser = () => {
  const md = new MarkdownIt({html: true});
  return md.use(markdownItSpan).use(markdownItLiReplacer).use(markdownItCard, {cardNumber: true});
};

const md = buildParser();
const renderCard = (src) => md.render(src, {cardMode: true});
const renderPlain = (src) => md.render(src, {});

// ---------------------------------------------------------------- 断言工具

let passed = 0;
const failures = [];

const check = (name, condition, detail) => {
  if (condition) {
    passed += 1;
    console.log("  ✅ " + name);
  } else {
    failures.push({name, detail});
    console.log("  ❌ " + name);
    if (detail) {
      console.log("     " + String(detail).split("\n").join("\n     "));
    }
  }
};

const group = (title) => console.log("\n" + title);

const countCards = (html) => (html.match(/<section class="card">/g) || []).length;
const countHr = (html) => (html.match(/<hr/g) || []).length;

// ---------------------------------------------------------------- 分卡逻辑

group("分卡：--- 是分卡符");

const twoCards = renderCard("## 甲\n\n正文 A\n\n---\n\n## 乙\n\n正文 B\n");
check("--- 切出 2 张卡", countCards(twoCards) === 2, twoCards);
check("编号 01 / 02 是真实文本", /<section class="card-no">01<\/section>/.test(twoCards) &&
  /<section class="card-no">02<\/section>/.test(twoCards), twoCards);
check("分隔线被标记为 .card-sep", /<hr class="card-sep">/.test(twoCards), twoCards);

group("分卡：*** / ___ 不是分卡符，它们是真正的分割线");

const starHr = renderCard("正文 A\n\n***\n\n正文 B\n");
check("*** 不切卡", countCards(starHr) === 1, starHr);
check("*** 的分割线保留且未被标记", countHr(starHr) === 1 && !/card-sep/.test(starHr), starHr);

const underHr = renderCard("正文 A\n\n___\n\n正文 B\n");
check("___ 不切卡", countCards(underHr) === 1, underHr);
check("___ 的分割线保留且未被标记", countHr(underHr) === 1 && !/card-sep/.test(underHr), underHr);

group("分卡：不该切的地方");

const quoted = renderCard("## T\n\n> a\n>\n> ---\n>\n> b\n");
check("引用块里的 --- 不切卡", countCards(quoted) === 1, quoted);
check("引用块里的 --- 仍是一条分割线", /<blockquote>[\s\S]*?<hr[\s\S]*?<\/blockquote>/.test(quoted), quoted);

group("分卡：setext 陷阱（金句紧接 ---，中间没空行）");

const setext = renderCard("**金句在这**\n---\n下一张卡\n");
check("被吃掉的 --- 已补回，切出 2 张卡", countCards(setext) === 2, setext);
check("金句还原成普通段落（不再是 h2）", !/<h2>/.test(setext), setext);
check("金句是干净的 p > strong（没混进 span）",
  /<p><strong>金句在这<\/strong><\/p>/.test(setext), setext);

const realHeading = renderCard("## 真标题\n\n**金句**\n---\n下一张\n");
check("真标题的 span.content 没被误伤", /<h2><span class="prefix"><\/span><span class="content">真标题/.test(realHeading), realHeading);

group("分卡：边界情况");

check("空文档不产卡", countCards(renderCard("")) === 0);
check("开头就是 --- ：不产生空卡", countCards(renderCard("---\n\n内容\n")) === 1);
check("连续两个 --- ：不产生空卡", countCards(renderCard("A\n\n---\n\n---\n\nB\n")) === 2);
check("末尾多余的 --- ：不产生空卡", countCards(renderCard("A\n\n---\n")) === 1);
check("没有 --- 的文档整体是一张卡", countCards(renderCard("只有文字\n")) === 1);

const longDash = renderCard("A\n\n-----\n\nB\n");
check("----- 也能分卡", countCards(longDash) === 2, longDash);

group("回归：其它主题（cardMode 关闭）不受影响");

const plain = renderPlain("## 甲\n\n正文 A\n\n---\n\n## 乙\n\n正文 B\n");
check("产物里没有任何 card 标记", !/class="card/.test(plain), plain);
check("--- 仍是原样的分割线", countHr(plain) === 1 && !/card-sep/.test(plain), plain);
check("标题 span 照常注入", /<h2><span class="prefix">/.test(plain), plain);

const plainStar = renderPlain("A\n\n***\n\nB\n");
check("*** 在非卡片模式下行为不变", countHr(plainStar) === 1, plainStar);

// ---------------------------------------------------------------- juice 内联

group("juice 内联：关键样式是否存活（静默丢弃是这条链路的老问题）");

const SAMPLE = [
  "## 标题",
  "",
  "正文，含 `行内代码`。",
  "",
  "> 结果：xxx",
  "",
  "**金句**",
  "",
  "***",
  "",
  "分割线下面的内容",
  "",
  "---",
  "",
  "## 第二张卡",
  "",
  "正文。",
  "",
].join("\n");

const inlined = juice.inlineContent(
  '<section id="nice">' + renderCard(SAMPLE) + "</section>",
  basicTheme + cardTheme,
  {inlinePseudoElements: true, preserveImportant: true}
);

const styleOf = (re) => {
  const m = inlined.match(re);
  return m ? m[0] : "";
};

check("卡片盒子拿到 min-height", /min-height:\s*600px/.test(styleOf(/<section class="card"[^>]*>/)),
  styleOf(/<section class="card"[^>]*>/));
check("卡片盒子拿到圆角", /border-radius:\s*14px/.test(styleOf(/<section class="card"[^>]*>/)));
check("编号是真文本不是计数器", /class="card-no"[^>]*>01</.test(inlined));
check("编号样式已内联", /background:\s*#eef1ff/.test(styleOf(/<section class="card-no"[^>]*>/)));

// 把两条 hr 分别拎出来判：带 .card-sep 的是分卡符（该藏），不带的是 *** 画的线（该留）
const hrTags = inlined.match(/<hr[^>]*>/g) || [];
const sepHrs = hrTags.filter((tag) => /class="card-sep"/.test(tag));
const ruleHrs = hrTags.filter((tag) => !/class="card-sep"/.test(tag));

check("分卡符带上了 .card-sep 标记", sepHrs.length >= 1, hrTags.join("\n"));
check("分卡符被藏掉（display:none）",
  sepHrs.length >= 1 && sepHrs.every((tag) => /display:\s*none/.test(tag)), sepHrs.join("\n"));
check("*** 的分割线没被藏掉",
  ruleHrs.length === 1 && !/display:\s*none/.test(ruleHrs[0]), ruleHrs.join("\n"));
check("*** 的分割线拿到了线样式", ruleHrs.length === 1 && /border-top/.test(ruleHrs[0]), ruleHrs.join("\n"));

check("金句 display:block 存活", /<strong style="[^"]*display:\s*block/.test(inlined));
check("金句拿到强调底色", /background:\s*#fff8e8/.test(styleOf(/<strong style="[^"]*"/)));
check("结果面板拿到绿底", /background:\s*#f2f7f4/.test(inlined));
check("正文 p 的 padding 被清掉（金句靠 margin 合并排版）",
  /<p style="[^"]*padding:\s*0/.test(inlined));

if (VERBOSE) {
  console.log("\n---------------- 渲染结果 ----------------");
  console.log(renderCard(SAMPLE));
  console.log("\n---------------- 内联结果（截断） ----------------");
  console.log(inlined.slice(0, 3000));
}

// ---------------------------------------------------------------- 汇总

console.log("\n" + "=".repeat(52));
if (failures.length === 0) {
  console.log("全部通过：" + passed + " 项");
  process.exit(0);
} else {
  console.log("通过 " + passed + " 项，失败 " + failures.length + " 项：");
  failures.forEach((f) => console.log("  - " + f.name));
  process.exit(1);
}

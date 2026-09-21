export default `/* 卡片主题 card
 * ------------------------------------------------------------------
 * 一张卡片 = 一个知识点，高度至少约一屏，可以单独截图分享。
 *
 * 写作约定（技术卡四件套，非技术卡可以省略代码和结果）：
 *
 *   ## 标题
 *
 *   正文段落……
 *
 *   \`\`\`js
 *   代码
 *   \`\`\`
 *
 *   > 结果：……
 *
 *   **金句**
 *
 *   ---
 *
 *   ## 下一张卡片
 *
 * 四件套是怎么认出来的：
 *   标题  → ## 二级标题
 *   代码  → 围栏代码块
 *   结果  → > 引用块
 *   金句  → 整段加粗（整段只有一处 **加粗**）
 *   编号  → 插件自动生成 01 / 02，是真实文本，不是 CSS 计数器
 *
 * ⚠️ 分隔线 --- 建议【前面留一个空行】。
 *    正文紧跟着写 ---（中间没有空行）时 markdown 会把它当成 setext 二级标题下划线，
 *    那一行会变成标题、而且不产生分割线。最容易踩的是金句，因为它正好写在 --- 前面。
 *    插件已经把这种情况还原成段落并补回分割线了，但仍建议照常写空行 ——
 *    这样文档在别的 markdown 编辑器里也正常。
 *
 * 想在卡片里画一条真正的分割线，用 *** 或 ___（不要用 ---，那是分卡符）。
 * --- 会被插件吃掉当作卡片边界，*** / ___ 则会正常渲染成一条线。
 *
 * 本主题刻意不用 @media / display:flex / position:absolute / CSS 计数器 / :has()，
 * 因为这些在「juice 内联 → 粘贴到公众号」这条链路上会被丢弃或破坏，导致预览与实际不符。
 * ------------------------------------------------------------------ */

/* =========================================================
   画布
   ========================================================= */

#nice {
  padding: 10px 10px 6px;

  background: #eef0f4;

  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    sans-serif;

  font-size: 15px;
  line-height: 1.85;
  color: #33363d;

  word-break: break-word;
  overflow-wrap: break-word;
}

/* 分卡符（---）本身藏掉，卡片之间的间距由卡片自身的 margin 提供。
   只藏 .card-sep：*** 和 ___ 是你画的分割线，照常显示。 */
#nice > hr.card-sep {
  display: none;

  height: 0;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
}

/* *** / ___ 写的分割线，以及卡片内部的 --- （引用块里的 --- 也走这条） */
#nice hr {
  height: 0;
  margin: 20px 0;

  border: 0;
  border-top: 1px solid #d9dde6;
  background: none;
}

/* =========================================================
   卡片
   ========================================================= */

#nice .card {
  box-sizing: border-box;

  /* 公众号正文宽约 343px，600 / 343 ≈ 1.75，约等于一台 375×667 手机的比例。
     取偏保守的值：现代手机上卡片会略矮于一屏，是不会翻车的方向。 */
  min-height: 600px;

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
   卡片编号（插件写入的真实文本）
   ========================================================= */

#nice .card-no {
  display: inline-block;

  margin: 0 0 14px;
  padding: 3px 9px;

  border-radius: 99px;
  background: #eef1ff;
  color: #4a5bd6;

  font-family: Menlo, Consolas, "Courier New", monospace;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 1px;
}

/* =========================================================
   标题
   ========================================================= */

#nice .card h1,
#nice .card h2 {
  margin: 0 0 16px;
  padding: 0 0 0 12px;

  border-left: 4px solid #4a5bd6;

  font-size: 21px;
  font-weight: 700;
  line-height: 1.4;
  color: #1b1d23;
  letter-spacing: 0.2px;
}

/* 标题里被 markdown-it-span 塞进来的 span，必须一并覆盖，否则会串到别的主题的配色 */
#nice .card h1 .content,
#nice .card h2 .content {
  display: inline;

  margin: 0;
  padding: 0;

  border: none;
  background: none;

  font-size: 21px;
  font-weight: 700;
  line-height: 1.4;
  color: #1b1d23;
}

#nice .card h1 .prefix,
#nice .card h1 .suffix,
#nice .card h2 .prefix,
#nice .card h2 .suffix {
  display: none;
}

/* basic.js 给 h2 留了装饰位，这里统一关掉 */
#nice h2:before,
#nice h2:after {
  display: none;
}

#nice .card h3 {
  margin: 20px 0 10px;
  padding: 0;

  font-size: 17px;
  font-weight: 700;
  line-height: 1.5;
  color: #1b1d23;
}

#nice .card h3 .content {
  margin: 0;
  padding: 0;

  border: none;
  background: none;

  font-size: 17px;
  font-weight: 700;
  color: #1b1d23;
}

#nice .card h4,
#nice .card h5,
#nice .card h6 {
  margin: 18px 0 8px;

  font-size: 15px;
  font-weight: 700;
  line-height: 1.6;
  color: #1b1d23;
}

/* =========================================================
   正文
   ========================================================= */

/* 只允许用 margin 做间距，绝不能用 padding：
   basic.js 给 #nice p 设了上下 padding，padding 不合并，
   会让金句周围多出死空间，也会挡住金句外边距的向外合并 */
#nice .card p {
  margin: 0 0 14px;
  padding: 0;

  font-size: 15px;
  line-height: 1.85;
  color: #33363d;

  letter-spacing: 0;
  text-align: left;
}

#nice .card p + p {
  margin-top: 0;
}

/* =========================================================
   结果（引用块）
   ========================================================= */

#nice .card blockquote {
  margin: 16px 0;
  padding: 12px 14px;

  border: 1px solid #dcebe2;
  border-left: 3px solid #3f9e6f;
  border-radius: 10px;
  background: #f2f7f4;
}

#nice .card blockquote p {
  margin: 0;

  font-size: 14.5px;
  line-height: 1.75;
  color: #2c5340;
}

#nice .card blockquote p + p {
  margin-top: 6px;
}

#nice .card blockquote strong {
  color: #26694a;
}

/* =========================================================
   金句：整段只有一处加粗的段落
   ========================================================= */

/* 用 .card-punch 这个 class，不要用「p > strong:only-child」。
   juice 的 cheerio/css-select 把 :only-child 当成 :only-of-type 实现，
   不把文本节点算作兄弟节点 —— 于是「这就是 **Jev** 。」这种段落在浏览器里不匹配、
   在 juice 里却匹配，预览正常但粘进公众号会整段变成金句面板。
   class 由 markdown-it-card 插件在 token 流里打，判定是精确的。 */
#nice .card strong.card-punch {
  display: block;

  margin: 18px 0 0;
  padding: 13px 15px;

  border-left: 3px solid #e8b23c;
  border-radius: 0 10px 10px 0;
  background: #fff8e8;

  font-size: 16px;
  font-weight: 700;
  line-height: 1.75;
  color: #7a5310;

  text-align: left;
}

/* =========================================================
   代码块
   ========================================================= */

/* 微信代码主题：一行一个 <code> 兄弟节点。
   顺带把 basic.js 的 display:flex 压回 block（靠特异性，不用 !important） */
#nice .card .code-snippet__fix {
  display: block;

  margin: 14px 0 16px;
  padding: 0;

  border: 1px solid #eceef3;
  border-radius: 10px;
  background: #f7f8fa;
  overflow: hidden;

  line-height: 1.75;
}

#nice .card .code-snippet__fix pre {
  margin: 0;
  padding: 14px 15px;

  white-space: normal;
  overflow-x: auto;
}

#nice .card .code-snippet__fix pre code {
  display: block;

  margin: 0;
  padding: 0;

  border-radius: 0;
  background: transparent;

  font-family: Menlo, Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.75;
  color: #2b2e36;

  white-space: pre-wrap;
  word-break: break-word;
}

/* 其它代码主题：<pre class="custom"><code class="hljs">。
   配色交给代码主题自己（它的样式排在 markdown 主题之后），这里只管外形 */
#nice .card pre.custom {
  margin: 14px 0 16px;
  padding: 0;

  border-radius: 10px;
  overflow: hidden;
}

#nice .card pre.custom code {
  display: block;

  font-size: 13px;
  line-height: 1.75;

  white-space: pre-wrap;
  word-break: break-word;
}

/* =========================================================
   行内代码
   ========================================================= */

#nice .card p code,
#nice .card li code,
#nice .card h1 code,
#nice .card h2 code,
#nice .card h3 code {
  margin: 0 2px;
  padding: 1px 5px;

  border-radius: 4px;
  background: #f1f2f6;
  color: #3b4bd8;

  font-family: Menlo, Consolas, Monaco, monospace;
  font-size: 13px;
  line-height: 1.6;
}

/* =========================================================
   列表
   ========================================================= */

#nice .card ul,
#nice .card ol {
  margin: 0 0 14px;
  padding-left: 22px;

  font-size: 15px;
  line-height: 1.85;
  color: #33363d;
}

#nice .card ul {
  list-style-type: disc;
}

#nice .card ol {
  list-style-type: decimal;
}

#nice .card li {
  margin: 0 0 6px;
  line-height: 1.85;
}

/* markdown-it-li 会给每个 li 套一层 section */
#nice .card li section {
  margin: 0;

  font-size: 15px;
  line-height: 1.85;
  color: #33363d;
}

#nice .card li p {
  margin: 0;
}

/* =========================================================
   表格
   ========================================================= */

#nice .card table {
  width: 100%;
  margin: 14px 0;

  border-collapse: collapse;

  font-size: 14px;
  line-height: 1.7;
}

#nice .card table tr th,
#nice .card table tr td {
  padding: 8px 10px;

  border: 1px solid #e7e9ef;
  text-align: left;
}

#nice .card table tr th {
  background: #f7f8fa;

  font-weight: 700;
  color: #1b1d23;
}

/* =========================================================
   图片
   ========================================================= */

#nice .card img {
  display: block;

  width: auto;
  max-width: 100%;
  height: auto;

  margin: 14px auto;

  border-radius: 8px;
}

#nice .card figcaption {
  margin: -6px 0 14px;

  font-size: 13px;
  line-height: 1.6;
  color: #8a8f9c;

  text-align: center;
}

#nice .card .imageflow-layer1 {
  margin: 14px auto;
}

#nice .card .imageflow-layer1 img {
  margin: 0;

  border-radius: 0;
}

/* =========================================================
   链接 / 强调 / 删除线
   ========================================================= */

#nice .card a {
  color: #3b4bd8;

  border-bottom: 1px solid #c3caf5;
  text-decoration: none;
}

#nice .card strong {
  background: none;

  font-weight: 700;
  color: #1b1d23;
}

#nice .card em {
  font-style: italic;
  color: #33363d;
}

#nice .card em strong {
  font-weight: 700;
  color: #1b1d23;
}

#nice .card del {
  color: #9aa0ad;
}

/* =========================================================
   脚注
   ========================================================= */

#nice .card .footnotes-sep {
  width: auto;
  margin: 22px 0 0;
  padding: 0;

  border: 0;
  border-top: 1px solid #e7e9ef;
  background: none;
}

#nice .card .footnotes-sep:before {
  content: "参考";

  display: block;
  margin: 14px 0 8px;

  font-size: 13px;
  font-weight: 700;
  color: #8a8f9c;
}

#nice .card .footnotes {
  padding-left: 0;

  border-left: 0;
}

#nice .card .footnote-word,
#nice .card .footnote-ref {
  color: #3b4bd8;
}

#nice .card .footnote-num {
  color: #9aa0ad;

  font-size: 80%;
}

#nice .card .footnote-item p {
  margin: 0 0 6px;

  font-size: 13px;
  line-height: 1.7;
  color: #8a8f9c;
}

#nice .card .footnote-item p em {
  font-size: 13px;
  color: #8a8f9c;
}

/* =========================================================
   公式（MathJax 渲染成 svg）
   ========================================================= */

#nice .card .block-equation {
  margin: 14px 0;
  overflow-x: auto;
}

#nice .card .block-equation svg,
#nice .card .inline-equation svg {
  max-width: 100%;
}
`;

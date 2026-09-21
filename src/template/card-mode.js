export default `/* 卡片模式（配合 markdown-it-card 插件）
 * ------------------------------------------------------------------
 * 卡片模式把每个顶层 --- 区间包成 <section class="card">，高度至少约一屏，
 * 可以单独截图分享。本文件只提供卡片该有的骨架：
 *
 *   卡片外框 / 编号 01、02 / 金句面板 / 隐藏分卡符 / 代码块圆角
 *
 * 标题、正文、引用、代码的配色与排版一律交给当前主题 ——
 * 换主题只换配色，卡片结构不变。本样式只在「卡片模式」开关打开时注入，
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

/* 分卡符（---）本身藏掉，卡片之间的间距由卡片自身的 margin 提供。
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
   卡片外框
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
   金句：整段只有一处加粗的段落
   ========================================================= */

/* class 由 markdown-it-card 插件在 token 流里打，不要用 p > strong:only-child——
   juice 的 cheerio 不把文本节点算作兄弟节点，预览正常但粘进公众号会误判 */
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
   代码块外形（配色交给代码主题）
   ========================================================= */

#nice .card pre.custom {
  margin: 14px 0 16px;

  border-radius: 10px;
  overflow: hidden;
}
`;

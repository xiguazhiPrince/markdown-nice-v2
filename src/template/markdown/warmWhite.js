export default `/* 自定义样式，实时生效 */
/*
 * 风格：
 * 米白 / 暖灰底
 * 深灰正文
 * 砖红标题
 * 中文衬线标题
 * 蓝色代码
 * 大留白、低装饰
 * 适合微信公众号手机阅读
 */

#nice {
  /* 整体 */
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px;

  /* 背景 */
  background: #fafaf9;

  /* 正文字体 */
  font-family:
    "Noto Sans SC",
    "PingFang SC",
    "Microsoft YaHei",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;

  font-size: 15px;
  line-height: 1.9;
  color: #4a4a45;

  word-break: break-word;
  overflow-wrap: break-word;
}


/* =========================================================
   正文
   ========================================================= */

#nice p {
  margin: 0 0 14px;
  padding: 0;

  font-family:
    "Noto Sans SC",
    "PingFang SC",
    "Microsoft YaHei",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;

  font-size: 15px;
  line-height: 1.9;
  color: #4a4a45;

  letter-spacing: 0;
  text-align: left;

  word-break: break-word;
  overflow-wrap: break-word;
}


/* 连续段落之间稍微增加呼吸感 */
#nice p + p {
  margin-top: 4px;
}


/* =========================================================
   一级标题
   ========================================================= */

#nice h1 {
  margin: 28px 0 18px;
  padding: 0 0 10px;

  font-family:
    "Noto Serif SC",
    "Songti SC",
    STSong,
    Georgia,
    serif;

  font-size: 26px;
  line-height: 1.4;
  font-weight: 700;

  color: #cf4436;

  border-bottom: 1px solid rgba(120, 120, 112, 0.18);
}


#nice h1 .content {
  color: #cf4436;
  font-weight: 700;
}


/* =========================================================
   二级标题
   ========================================================= */

#nice h2 {
  margin: 34px 0 8px;
  padding: 0;

  font-family:
    "Noto Serif SC",
    "Songti SC",
    STSong,
    Georgia,
    serif;

  font-size: 22px;
  line-height: 1.4;
  font-weight: 700;

  color: #cf4436;

  word-break: break-word;
  overflow-wrap: break-word;
}


#nice h2 .content {
  display: inline;

  font-family:
    "Noto Serif SC",
    "Songti SC",
    STSong,
    Georgia,
    serif;

  font-size: 22px;
  line-height: 1.4;
  font-weight: 700;

  color: #cf4436;

  padding: 0;
  margin: 0;

  background: none;
}


/* 二级标题不要额外装饰 */
#nice h2:after {
  display: none;
}


/* =========================================================
   三级标题
   ========================================================= */

#nice h3 {
  margin: 26px 0 10px;
  padding: 0;

  font-family:
    "Noto Serif SC",
    "Songti SC",
    STSong,
    Georgia,
    serif;

  font-size: 18px;
  line-height: 1.55;
  font-weight: 700;

  color: #4a4a45;
}


#nice h3 .content {
  color: #4a4a45;
  font-weight: 700;
  font-size: 18px;

  padding: 0;
  border: none;
}


/* =========================================================
   四级标题
   ========================================================= */

#nice h4 {
  margin: 22px 0 8px;

  font-size: 16px;
  line-height: 1.6;
  font-weight: 700;

  color: #4a4a45;
}


#nice h5,
#nice h6 {
  margin: 20px 0 8px;

  font-size: 15px;
  line-height: 1.6;
  font-weight: 700;

  color: #4a4a45;
}


/* =========================================================
   标题与正文之间
   ========================================================= */

#nice h1 + p,
#nice h2 + p,
#nice h3 + p,
#nice h4 + p {
  margin-top: 0;
}


/* =========================================================
   加粗
   ========================================================= */

#nice strong {
  color: #3d3d39;
  font-weight: 700;
}


/* 强调语句不要做荧光背景 */
#nice strong {
  background: none;
}


/* =========================================================
   链接
   ========================================================= */

#nice a {
  color: #007aaa;

  text-decoration: none;

  border: none;
}


#nice a:hover {
  color: #007aaa;
  text-decoration: underline;
}


/* =========================================================
   引用
   ========================================================= */

#nice blockquote {
  margin: 22px 0;
  padding: 2px 0 2px 14px;

  border-left: 3px solid #cf4436;

  background: transparent;
}


#nice blockquote p {
  margin: 0;

  color: #666660;

  font-size: 15px;
  line-height: 1.85;
}


/* =========================================================
   无序 / 有序列表
   ========================================================= */

#nice ul,
#nice ol {
  margin: 0 0 18px;
  padding-left: 22px;

  font-size: 15px;
  line-height: 1.9;
  color: #4a4a45;
}


#nice li {
  margin: 0 0 4px;
  padding: 0;

  line-height: 1.9;
}


#nice li p {
  margin: 0;
}


/* 列表不要太花 */
#nice ul {
  list-style-type: disc;
}


#nice ol {
  list-style-type: decimal;
}


/* =========================================================
   分割线
   ========================================================= */

#nice hr {
  height: 0;

  margin: 26px 0;

  border: 0;
  border-top: 1px solid rgba(120, 120, 112, 0.18);
}


/* =========================================================
   图片
   ========================================================= */

#nice img {
  display: block;

  width: 100%;
  max-width: 100%;
  height: auto;

  margin: 22px auto;

  border-radius: 2px;
}


#nice figcaption {
  margin: -10px 0 18px;

  text-align: center;

  font-size: 13px;
  line-height: 1.6;

  color: #8a8a84;
}


/* =========================================================
   行内代码
   ========================================================= */

#nice p code,
#nice li code,
#nice h1 code,
#nice h2 code,
#nice h3 code,
#nice h4 code {
  font-family:
    "JetBrains Mono",
    "SF Mono",
    Menlo,
    Consolas,
    monospace;

  font-size: 13px;
  line-height: 1.5;

  color: #007aaa;

  background: rgba(26, 26, 24, 0.06);

  padding: 1px 5px;

  border-radius: 3px;

  word-break: break-word;
  overflow-wrap: break-word;
}


/* =========================================================
   代码块
   ========================================================= */

#nice pre {
  margin: 20px 0;

  padding: 14px 16px;

  background: #f1f1ef;

  border: none;
  border-radius: 4px;

  overflow-x: auto;

  line-height: 1.7;
}


#nice pre code {
  display: block;

  padding: 0;

  margin: 0;

  font-family:
    "JetBrains Mono",
    "SF Mono",
    Menlo,
    Consolas,
    monospace;

  font-size: 13px;
  line-height: 1.7;

  color: #3f6672;

  background: transparent;

  border-radius: 0;

  white-space: pre-wrap;
  word-break: break-word;
}


/* =========================================================
   表格
   ========================================================= */

#nice table {
  width: 100%;

  margin: 20px 0;

  border-collapse: collapse;

  font-size: 14px;
  line-height: 1.7;

  color: #4a4a45;
}


#nice table th,
#nice table td {
  padding: 8px 10px;

  text-align: left;

  border-bottom: 1px solid rgba(120, 120, 112, 0.16);
}


#nice table th {
  font-weight: 700;
  color: #3d3d39;
}


/* =========================================================
   删除线
   ========================================================= */

#nice del {
  color: #8b8b85;
}


/* =========================================================
   脚注
   ========================================================= */

#nice .footnote-word {
  color: #cf4436;
  padding: 2px;
}


#nice .footnote-ref {
  color: #cf4436;

  margin: 0 2px;
  padding: 0 2px;
}


/* =========================================================
   参考资料
   ========================================================= */

#nice .footnotes-sep {
  margin-top: 30px;
}


#nice .footnotes-sep:before {
  content: "参考资料";

  display: block;

  margin: 30px 0 16px;

  font-family:
    "Noto Serif SC",
    "Songti SC",
    STSong,
    Georgia,
    serif;

  font-size: 18px;
  font-weight: 700;

  color: #cf4436;
}


#nice .footnote-item p {
  margin-bottom: 8px;

  font-size: 13px;
  line-height: 1.7;

  color: #888880;
}


/* =========================================================
   行间公式
   ========================================================= */

#nice .block-equation {
  margin: 20px 0;
  overflow-x: auto;
}


#nice .block-equation svg {
  max-width: 100%;
}


/* =========================================================
   行内公式
   ========================================================= */

#nice .inline-equation svg {
  max-width: 100%;
}


/* =========================================================
   手机端进一步优化
   ========================================================= */

@media screen and (max-width: 480px) {

  #nice {
    padding: 22px 16px;

    font-size: 15px;
  }

  #nice p {
    font-size: 15px;
    line-height: 1.9;
  }

  #nice h1 {
    margin-top: 24px;
    font-size: 24px;
    line-height: 1.4;
  }

  #nice h2 {
    margin-top: 32px;
    font-size: 21px;
  }

  #nice h2 .content {
    font-size: 21px;
  }

  #nice h3 {
    margin-top: 24px;
    font-size: 17px;
  }

  #nice h3 .content {
    font-size: 17px;
  }

  #nice blockquote {
    padding-left: 12px;
  }

  #nice pre {
    padding: 12px 13px;
  }

  #nice pre code {
    font-size: 12.5px;
  }

  #nice table {
    font-size: 13px;
  }

}
`;

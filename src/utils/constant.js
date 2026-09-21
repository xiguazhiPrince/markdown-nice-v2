export const MJX_DATA_FORMULA = "data-formula";
export const MJX_DATA_FORMULA_TYPE = "data-formula-type";

export const CONTENT = "content";
export const STYLE = "style";
export const TEMPLATE_NUM = "template_num";
export const CODE_NUM = "code_num";
export const PREVIEW_TYPE = "preview_type";
export const IS_SYNC_SCROLL = "is_sync_scroll";
export const IS_MAC_CODE = "is_mac_code";
export const IS_CARD_MODE = "is_card_mode";
export const NEWEST_VERSION = "newest_version";
export const BASIC_THEME_ID = "basic-theme";
export const CODE_THEME_ID = "code-theme";
export const MARKDOWN_THEME_ID = "markdown-theme";
export const FONT_THEME_ID = "font-theme";
// 卡片模式：需要 markdown-it-card 插件配合（按 --- 把内容包成卡片），
// 这个 id 是卡片骨架样式的 style 标签，只在开关打开时写入内容
export const CARD_MODE_THEME_ID = "card-mode-theme";
export const LAYOUT_ID = "nice";
export const BOX_ID = "nice-rich-text-box";

export const RIGHT_SYMBOL = "✔️";
export const EXPORT_FILENAME_SUFFIX = ".md";

export const STYLE_LABELS = ["basic-theme", "markdown-theme", "code-theme", "font-theme", "card-mode-theme"];

export const ENTER_DELAY = 0.5;
export const LEAVE_DELAY = 0.0;

export const TEMPLATE_OPTIONS = [
  {
    id: "normal",
    name: "默认主题",
    author: "zhning12",
  },
  {
    id: "shanchui",
    name: "山吹",
    author: "ElyhG",
  },
  {
    id: "rose",
    name: "蔷薇紫",
    author: "HeyRain",
  },
  {
    id: "fullStackBlue",
    name: "全栈蓝",
    author: "Nealyang",
  },
  {
    id: "nightPurple",
    name: "凝夜紫",
    author: "童欧巴",
    isNew: true,
  },
  {
    id: "cuteGreen",
    name: "萌绿",
    author: "koala",
  },
  {
    id: "extremeBlack",
    name: "极简黑",
    author: "小鱼",
    isNew: true,
  },
  {
    id: "warmWhite",
    name: "暖白",
    author: "自定义",
    isNew: true,
  },
  {
    id: "orangeHeart",
    name: "橙心",
    author: "zhning12",
  },
  {
    id: "ink",
    name: "墨黑",
    author: "Mayandev",
  },
  {
    id: "purple",
    name: "姹紫",
    author: "djmaxwow",
  },
  {
    id: "green",
    name: "绿意",
    author: "夜尽天明",
  },
  {
    id: "cyan",
    name: "嫩青",
    author: "画手",
  },
  {
    id: "wechatFormat",
    name: "WeChat-Format",
    author: "画手",
  },
  {
    id: "blueCyan",
    name: "兰青",
    author: "Krahets",
  },
  {
    id: "blueMountain",
    name: "前端之巅同款",
    author: "HeyRain",
  },
  {
    id: "geekBlack",
    name: "极客黑",
    author: "hyper-xx",
  },
  {
    id: "red",
    name: "红绯",
    author: "HeyRain",
  },
  {
    id: "blue",
    name: "蓝莹",
    author: "谭淞宸",
  },
  {
    id: "scienceBlue",
    name: "科技蓝",
    author: "夜尽天明",
  },
  {
    id: "simple",
    name: "简",
    author: "aco",
  },
  {
    id: "custom",
    name: "自定义",
    author: "",
  },
];

export const TEMPLATE_CUSTOM_NUM = TEMPLATE_OPTIONS.length - 1;

// 卡片主题曾是主题列表的第 21 项，现已改为独立的“卡片模式”开关。
// 老 localStorage 里存的是旧下标，列表删项后整体前移，这里统一迁移：
//   21（旧卡片主题）→ 回到默认主题；22（旧自定义）→ 21（新自定义）
export const normalizeTemplateNum = (num) => {
  const LEGACY_CARD_NUM = 21;
  if (!Number.isInteger(num)) return 0;
  if (num === LEGACY_CARD_NUM) return 0;
  const next = num > LEGACY_CARD_NUM ? num - 1 : num;
  return TEMPLATE_OPTIONS[next] ? next : 0;
};

export const CODE_OPTIONS = [
  {
    id: "wechat",
    name: "微信代码主题",
  },
  {
    id: "atomOneDark",
    macId: "macAtomOneDark",
    name: "atom-one-dark",
  },
  {
    id: "atomOneLight",
    macId: "macAtomOneLight",
    name: "atom-one-light",
  },
  {
    id: "monokai",
    macId: "macMonokai",
    name: "monokai",
  },
  {
    id: "github",
    macId: "macGithub",
    name: "github",
  },
  {
    id: "vs2015",
    macId: "macVs2015",
    name: "vs2015",
  },
  {
    id: "xcode",
    macId: "macXcode",
    name: "xcode",
  },
];

export const SITDOWN_OPTIONS = [
  {
    key: "wechat",
    value: "微信公众号 - https://mp.weixin.qq.com/",
  },
  {
    key: "zhihu",
    value: "知乎专栏 - https://zhuanlan.zhihu.com/",
  },
  {
    key: "juejin",
    value: "掘金 - https://juejin.im/post/",
  },
  {
    key: "csdn",
    value: "CSDN - https://blog.csdn.net/",
  },
  {
    key: "other",
    value: "其他",
  },
];

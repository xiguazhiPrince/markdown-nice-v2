import React, {Component} from "react";
import PropTypes from "prop-types";
import {Result} from "antd";
import {Provider} from "mobx-react";

import "./index.css";

import App from "./App";

import content from "./store/content";
import navbar from "./store/navbar";
import dialog from "./store/dialog";
import imageHosting from "./store/imageHosting";
import view from "./store/view";

import {isPC} from "./utils/helper";
import appContext from "./utils/appContext";
import SvgIcon from "./icon";
import {solveWeChatMath, solveZhihuMath, solveHtml} from "./utils/converter";
import {LAYOUT_ID} from "./utils/constant";

class Lib extends Component {
  getWeChatHtml() {
    const layout = document.getElementById(LAYOUT_ID); // 保护现场
    const html = layout.innerHTML;
    solveWeChatMath();
    const res = solveHtml();
    layout.innerHTML = html; // 恢复现场
    return res;
  }

  getZhihuHtml() {
    const layout = document.getElementById(LAYOUT_ID); // 保护现场
    const html = layout.innerHTML;
    solveZhihuMath();
    const res = solveHtml();
    layout.innerHTML = html; // 恢复现场
    return res;
  }

  render() {
    const {defaultTitle, defaultText, onTextChange, useImageHosting} = this.props;
    const appCtx = {
      defaultTitle,
      useImageHosting,
    };
    return (
      <Provider content={content} navbar={navbar} dialog={dialog} imageHosting={imageHosting} view={view}>
        {isPC() ? (
          <appContext.Provider value={appCtx}>
            <App defaultText={defaultText} onTextChange={onTextChange} useImageHosting={useImageHosting} />
          </appContext.Provider>
        ) : (
          <Result
            icon={<SvgIcon name="smile" style={style.svgIcon} />}
            title="请使用 PC 端打开排版工具"
            subTitle="本工具需要较大屏幕，请在电脑浏览器中访问"
          />
        )}
      </Provider>
    );
  }
}

const style = {
  svgIcon: {
    width: "72px",
    height: "72px",
  },
};

Lib.defaultProps = {
  defaultTitle: "",
  defaultText: "",
  onTextChange: () => {},
  // eslint-disable-next-line react/default-props-match-prop-types
  useImageHosting: {
    url: "",
    name: "",
    isSmmsOpen: false,
    isAliyunOpen: true,
  },
};
Lib.propTypes = {
  defaultTitle: PropTypes.string,
  defaultText: PropTypes.string,
  onTextChange: PropTypes.func,
  // eslint-disable-next-line react/require-default-props
  useImageHosting: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string,
    isSmmsOpen: PropTypes.bool,
    isAliyunOpen: PropTypes.bool,
  }),
};

export default Lib;

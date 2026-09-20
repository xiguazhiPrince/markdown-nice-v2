/**
 * 图片上传
 */
import {message} from "antd";
import axios from "axios";
import OSS from "ali-oss";
import imageHosting from "../store/imageHosting";

import {
  SM_MS_PROXY,
  ALIOSS_IMAGE_HOSTING,
  IMAGE_HOSTING_TYPE,
  IS_CONTAIN_IMG_NAME,
  IMAGE_HOSTING_NAMES,
} from "./constant";
import {toBlob, getOSSName} from "./helper";

function showUploadNoti() {
  message.loading("图片上传中", 0);
}

function uploadError(description = "图片上传失败") {
  message.error(description, 3);
}

function hideUploadNoti() {
  message.destroy();
  message.success("图片上传成功");
}

function writeToEditor({content, image}) {
  const isContainImgName = window.localStorage.getItem(IS_CONTAIN_IMG_NAME) === "true";
  console.log(isContainImgName);
  let text = "";
  if (isContainImgName) {
    text = `\n![${image.filename}](${image.url})\n`;
  } else {
    text = `\n![](${image.url})\n`;
  }
  const {markdownEditor} = content;
  const cursor = markdownEditor.getCursor();
  markdownEditor.replaceSelection(text, cursor);
  content.setContent(markdownEditor.getValue());
}

// 用户自定义的图床上传
export const customImageUpload = async ({
  formData = new FormData(),
  file = {},
  onSuccess = () => {},
  onError = () => {},
  images = [],
  content = null,
}) => {
  showUploadNoti();
  try {
    formData.append("file", file);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const postURL = imageHosting.hostingUrl;
    const result = await axios.post(postURL, formData, config);
    const names = file.name.split(".");
    names.pop();
    const filename = names.join(".");
    const image = {
      filename,
      url: encodeURI(result.data.data), // 这里要和外接图床规定好数据逻辑，否则会接入失败
    };

    if (content) {
      writeToEditor({content, image});
    }
    images.push(image);
    onSuccess(result);
    setTimeout(() => {
      hideUploadNoti();
    }, 500);
  } catch (error) {
    message.destroy();
    uploadError(error.toString());
    onError(error, error.toString());
  }
};

// SM.MS存储上传
export const smmsUpload = ({
  formData = new FormData(),
  file = {},
  action = SM_MS_PROXY,
  onProgress = () => {},
  onSuccess = () => {},
  onError = () => {},
  headers = {},
  withCredentials = false,
  images = [],
  content = null, // store content
}) => {
  showUploadNoti();
  // SM.MS图床必须这里命名为smfile
  formData.append("smfile", file);
  axios
    .post(action, formData, {
      withCredentials,
      headers,
      onUploadProgress: ({total, loaded}) => {
        onProgress(
          {
            percent: parseInt(Math.round((loaded / total) * 100).toFixed(2), 10),
          },
          file,
        );
      },
    })
    .then(({data: response}) => {
      if (response.code === "exception") {
        throw response.message;
      }
      const image = {
        filename: response.data.filename,
        url: response.data.url,
      };
      if (content) {
        writeToEditor({content, image});
      }
      images.push(image);
      onSuccess(response, file);
      setTimeout(() => {
        hideUploadNoti();
      }, 500);
    })
    .catch((error) => {
      hideUploadNoti();
      uploadError(error.toString());
      onError(error, error.toString());
    });
};

// 阿里对象存储，上传部分
const aliOSSPutObject = ({config, file, buffer, onSuccess, onError, images, content}) => {
  let client;
  try {
    client = new OSS(config);
  } catch (error) {
    message.error("OSS配置错误，请根据文档检查配置项");
    return;
  }

  const OSSName = getOSSName(file.name);

  client
    .put(OSSName, buffer)
    .then((response) => {
      const names = file.name.split(".");
      names.pop();
      const filename = names.join(".");
      const image = {
        filename, // 名字不变并且去掉后缀
        url: response.url,
      };
      if (content) {
        writeToEditor({content, image});
      }
      images.push(image);
      onSuccess(response, file);
      setTimeout(() => {
        hideUploadNoti();
      }, 500);
    })
    .catch((error) => {
      console.log(error);

      hideUploadNoti();
      uploadError("请根据文档检查配置项");
      onError(error, error.toString());
    });
};

// 阿里云对象存储上传，处理部分
export const aliOSSUpload = ({
  file = {},
  onSuccess = () => {},
  onError = () => {},
  images = [],
  content = null, // store content
}) => {
  showUploadNoti();
  const config = JSON.parse(window.localStorage.getItem(ALIOSS_IMAGE_HOSTING));
  const base64Reader = new FileReader();
  base64Reader.readAsDataURL(file);
  base64Reader.onload = (e) => {
    const urlData = e.target.result;
    const base64 = urlData.split(",").pop();
    const fileType = urlData
      .split(";")
      .shift()
      .split(":")
      .pop();

    // base64转blob
    const blob = toBlob(base64, fileType);

    // blob转arrayBuffer
    const bufferReader = new FileReader();
    bufferReader.readAsArrayBuffer(blob);
    bufferReader.onload = (event) => {
      const buffer = new OSS.Buffer(event.target.result);
      aliOSSPutObject({config, file, buffer, onSuccess, onError, images, content});
    };
  };
};

// 自动检测上传配置，进行上传
export const uploadAdaptor = (...args) => {
  const type = localStorage.getItem(IMAGE_HOSTING_TYPE); // SM.MS | 阿里云 | 用户自定义图床
  const userType = imageHosting.hostingName;
  if (type === userType) {
    return customImageUpload(...args);
  } else if (type === IMAGE_HOSTING_NAMES.smms) {
    return smmsUpload(...args);
  } else if (type === IMAGE_HOSTING_NAMES.aliyun) {
    const config = JSON.parse(window.localStorage.getItem(ALIOSS_IMAGE_HOSTING));
    if (
      !config.region.length ||
      !config.accessKeyId.length ||
      !config.accessKeySecret.length ||
      !config.bucket.length
    ) {
      message.error("请先配置阿里云图床");
      return false;
    }
    return aliOSSUpload(...args);
  }
  return true;
};

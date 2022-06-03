import React from 'react';
import { Upload, message, Button } from 'antd';
import { getOSSConfig } from '@/services/ant-design-pro/api';

export default class AliyunOSSUpload extends React.Component {
  state = {
    OSSData: {},
  };

  async componentDidMount() {
    await this.init();
  }

  init = async () => {
    try {
      const OSSData = await getOSSConfig();
      console.log(OSSData);

      this.setState({
        OSSData,
      });
    } catch (error) {
      message.error(error);
    }
  };

  onChange = ({ file }) => {
    if (file.status === 'done') {
      if (this.props.setCover) {
        this.props.setCover(file.key);
      }
      if (this.props.insertImage) {
        this.props.insertImage(file.url);
      }
    }
  };

  getExtraData = (file) => {
    const { OSSData } = this.state;

    return {
      key: file.key,
      OSSAccessKeyId: OSSData.accessid,
      policy: OSSData.policy,
      Signature: OSSData.signature,
    };
  };

  beforeUpload = async (file) => {
    const { OSSData } = this.state;
    const expire = OSSData.expire * 1000;

    if (expire < Date.now()) {
      await this.init();
    }

    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    file.key = OSSData.dir + filename;
    file.url = OSSData.host + OSSData.dir + filename;

    return file;
  };

  render() {
    const { value, accept } = this.props;
    const props = {
      ...this.props,
      accept: accept,
      name: 'file',
      fileList: value,
      action: this.state.OSSData.host,
      onChange: this.onChange,
      data: this.getExtraData,
      beforeUpload: this.beforeUpload,
      listType: 'picture',
      maxCount: 1,
    };
    return <Upload {...props}>{this.props.children}</Upload>;
  }
}

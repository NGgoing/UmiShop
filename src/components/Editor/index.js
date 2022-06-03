import React from 'react';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
// 引入编辑器样式
import AliyunOSSUpload from '../AliyunOSSUpload';
import { UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import 'braft-editor/dist/index.css';
import './index.css';

export default class EditorDemo extends React.Component {
  state = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null),
  };

  // async componentDidMount () {
  //     // 假设此处从服务端获取html格式的编辑器内容
  //     const htmlContent = await fetchEditorContent()
  //     // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
  //     this.setState({
  //         editorState: BraftEditor.createEditorState(htmlContent)
  //     })
  // }

  // submitContent = async () => {
  //     // 在编辑器获得焦点时按下ctrl+s会执行此方法
  //     // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
  //     const htmlContent = this.state.editorState.toHTML()
  //     const result = await saveEditorContent(htmlContent)
  // }

  insertImage = (url) =>
    this.setState({
      editorState: ContentUtils.insertMedias(this.state.editorState, [
        {
          type: 'IMAGE',
          url,
        },
      ]),
    });

  handleEditorChange = (editorState) => {
    this.setState({ editorState });
    if (!editorState.isEmpty()) {
      const htmlContent = this.state.editorState.toHTML();
      this.props.setDetails(htmlContent);
    } else {
      this.props.setDetails('');
    }
  };

  render() {
    const { editorState } = this.state;
    const extendControls = [
      'separator',
      {
        key: 'insertImage',
        type: 'component',
        component: (
          <AliyunOSSUpload accept="image/*" showUploadList={false} insertImage={this.insertImage}>
            <Button icon={<UploadOutlined />} className="control-item button upload-button">
              插入图片
            </Button>
          </AliyunOSSUpload>
        ),
      },
    ];

    return (
      <div className="my-component">
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
          extendControls={extendControls}
          //   onSave={this.submitContent}
        />
      </div>
    );
  }
}

import react from 'react';
import { Modal } from 'antd';
import ProForm, { ProFormGroup, ProFormText } from '@ant-design/pro-form';

const CreateModal = (props) => {
  const { isModalVisibleHandler, isModalVisible, dataHandler } = props;

  return (
    <Modal
      title="添加用戶"
      destroyOnClose={true}
      footer={false}
      visible={isModalVisible}
      onCancel={() => isModalVisibleHandler(false)}
    >
      <ProForm
        onFinish={(value) => {
          dataHandler(value);
        }}
      >
        <ProFormGroup>
          <ProFormText width="md" name="email" label="郵箱" rules={[{ required: true }]} />
          <ProFormText width="md" name="name" label="名稱" rules={[{ required: true }]} />
          <ProFormText.Password
            width="md"
            name="password"
            label="密碼"
            rules={[{ required: true }]}
          />
          <ProFormText width="md" name="avatar_url" label="圖片" />
        </ProFormGroup>
      </ProForm>
    </Modal>
  );
};

export default CreateModal;

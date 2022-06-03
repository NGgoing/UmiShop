import react, { useState, useEffect } from 'react';
import { Modal, Cascader, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ProForm, { ProFormText, ProFormTextArea, ProFormDigit } from '@ant-design/pro-form';
import { getTypeList } from '@/services/ant-design-pro/api';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import EditorDemo from '@/components/Editor';

const CreateModal = (props) => {
  const { isModalVisibleHandler, isModalVisible, dataHandler } = props;
  const [typeData, setTypeData] = useState([]);
  const [form] = ProForm.useForm();

  useEffect(() => {
    const fetchData = async () => {
      setTypeData(await getTypeList());
    };
    fetchData();
  }, []);

  const setDetails = (content) => {
    form.setFieldsValue({ details: content });
  };

  const setCover = (cover) => {
    form.setFieldsValue({ cover });
  };

  return (
    <Modal
      title="添加商品"
      destroyOnClose={true}
      footer={false}
      visible={isModalVisible}
      onCancel={() => isModalVisibleHandler(false)}
    >
      <ProForm
        form={form}
        onFinish={(value) => {
          dataHandler(value);
        }}
      >
        <ProForm.Item width="md" name="category_id" label="分类" rules={[{ required: true }]}>
          <Cascader options={typeData} fieldNames={{ label: 'name', value: 'id' }} />
        </ProForm.Item>
        <ProFormText width="md" name="title" label="商品名" rules={[{ required: true }]} />
        <ProFormTextArea width="md" name="description" label="描述" rules={[{ required: true }]} />
        <ProFormDigit width="md" name="price" label="价格" min={0} rules={[{ required: true }]} />
        <ProFormDigit width="md" name="stock" label="库存" min={0} rules={[{ required: true }]} />
        <ProForm.Item width="md" name="cover" label="封面" rules={[{ required: true }]}>
          <>
            <AliyunOSSUpload accept="image/*" setCover={setCover}>
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </AliyunOSSUpload>
          </>
        </ProForm.Item>
        <ProForm.Item width="md" name="details" label="详情" rules={[{ required: true }]}>
          <EditorDemo setDetails={setDetails} />
        </ProForm.Item>
      </ProForm>
    </Modal>
  );
};

export default CreateModal;

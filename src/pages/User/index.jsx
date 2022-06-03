import react, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Switch, Avatar, message } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { getUserList, setIsLocked, register, updateUser } from '@/services/ant-design-pro/api';
import CreateModal from './components/CreateModal';
import { isEqual } from 'lodash';

const User = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); //控制Modal显示
  const actionRef = useRef();

  //获取用户列表数据
  const fetchData = async (params) => {
    const resData = await getUserList(params);
    return {
      data: resData.data,
      success: true,
      total: resData.meta.pagination.total,
    };
  };

  //控制账户是否锁定
  const isLockedHandler = (uid) => {
    return async () => {
      await setIsLocked(uid);
      message.success('操作成功');
    };
  };

  //改变Modal显示的状态
  const isModalVisibleHandler = (isShow) => {
    setIsModalVisible(isShow);
  };

  //注册用户并刷新
  const dataHandler = async (data) => {
    await register(data);
    message.success('操作成功');
    actionRef.current.reload();
    setIsModalVisible(false);
  };

  //更新用户数据
  const updateUserData = async (data) => {
    await updateUser(data);
    actionRef.current.reload();
  };

  //定义表格字段
  const columns = [
    {
      dataIndex: 'id',
      hideInSearch: true,
      editable: false,
    },
    {
      title: '頭像',
      hideInSearch: true,
      dataIndex: 'avatar_url',
      render: (_, record) => <Avatar src={record.avatar_url} size={64} icon={<UserOutlined />} />,
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '郵箱',
      dataIndex: 'email',
    },
    {
      title: '是否禁用',
      hideInSearch: true,
      dataIndex: 'is_locked',
      editable: false,
      render: (_, record) => (
        <Switch
          defaultChecked={record.is_locked === 1 ? true : false}
          onClick={isLockedHandler(record.id)}
        />
      ),
    },
    {
      title: '創建時間',
      hideInSearch: true,
      editable: false,
      dataIndex: 'created_at',
    },
    {
      title: '操作',
      valueType: 'option',
      hideInSearch: true,
      // render: () => <a href="#components-anchor-demo-basic">編輯</a>,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a href={record.url} key="delete">
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        // dataSource={userList}
        request={async (params = {}, sort, filter) => {
          return fetchData(params);
        }}
        editable={{
          type: 'single',
          onSave: (key, row, originRow) => {
            if (!isEqual(row, originRow)) updateUserData(row);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="用戶列表"
        toolBarRender={() => [
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => isModalVisibleHandler(true)}
          >
            新建
          </Button>,
          <CreateModal
            isModalVisibleHandler={isModalVisibleHandler}
            isModalVisible={isModalVisible}
            dataHandler={dataHandler}
          />,
        ]}
      />
    </PageContainer>
  );
};

export default User;

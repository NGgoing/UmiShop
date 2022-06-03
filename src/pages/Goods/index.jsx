import react, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Switch, Image, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  addGoods,
  getGoodsList,
  setIsOn,
  setIsRecommend,
  updateGoods,
} from '@/services/ant-design-pro/api';
import CreateModal from '@/pages/Goods/components/CreateModal';
import { isEqual } from 'lodash';

const Goods = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); //控制Modal显示
  const actionRef = useRef();

  //获取商品列表数据
  const fetchData = async (params) => {
    const resData = await getGoodsList(params);
    return {
      data: resData.data,
      success: true,
      total: resData.meta.pagination.total,
    };
  };

  //控制商品是否上架
  const isOnHandler = (gid) => {
    return async () => {
      await setIsOn(gid);
      message.success('操作成功');
      actionRef.current.reload();
    };
  };

  //控制商品是否推荐
  const isRecommendHandler = (gid) => {
    return async () => {
      await setIsRecommend(gid);
      message.success('操作成功');
      actionRef.current.reload();
    };
  };

  //改变Modal显示的状态
  const isModalVisibleHandler = (isShow) => {
    setIsModalVisible(isShow);
  };

  //注册用户并刷新
  const dataHandler = async (data) => {
    await addGoods({ ...data, category_id: data.category_id[1] });
    actionRef.current.reload();
    setIsModalVisible(false);
  };

  //更新用户数据
  const updateGoodsData = async (data) => {
    await updateGoods(data);
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
      title: '商品图',
      hideInSearch: true,
      dataIndex: 'cover_url',
      render: (_, record) => <Image width={64} src={record.cover_url} />,
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '价格',
      hideInSearch: true,
      dataIndex: 'price',
    },
    {
      title: '库存',
      hideInSearch: true,
      dataIndex: 'stock',
    },
    {
      title: '是否上架 ',
      dataIndex: 'is_on',
      valueType: 'radioButton',
      editable: false,
      valueEnum: {
        1: {
          text: '已上架',
        },
        0: { text: '未上架' },
      },
      render: (_, record) => {
        return (
          <Switch
            defaultChecked={record.is_on === 1 ? true : false}
            onClick={isOnHandler(record.id)}
          />
        );
      },
    },
    {
      title: '是否推荐 ',
      dataIndex: 'is_recommend',
      valueType: 'radioButton',
      valueEnum: {
        1: {
          text: '已推荐',
        },
        0: { text: '未推荐' },
      },
      editable: false,
      render: (_, record) => (
        <Switch
          defaultChecked={record.is_recommend === 1 ? true : false}
          onClick={isRecommendHandler(record.id)}
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
            if (!isEqual(row, originRow)) updateGoodsData(row);
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
        headerTitle="商品列表"
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

export default Goods;

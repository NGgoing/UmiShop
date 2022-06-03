import react, { useEffect, useState } from 'react';
import { Statistic, Card, Row, Col, Skeleton } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getStat } from '@/services/ant-design-pro/api';
import { isEqual } from 'lodash';

const Dashboard = () => {
  const [stat, setStat] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const temp = await getStat();
        setStat(temp);
      } catch (e) {
        throw e;
      }
    };
    fetchData();
  }, []);

  return isEqual(stat, {}) ? (
    <Skeleton active={true} />
  ) : (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="用戶數"
              value={stat.users_count}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="商品數"
              value={stat.goods_count}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="訂單數"
              value={stat.order_count}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

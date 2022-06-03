import React from 'react';
import request from '@/utils/request';
import { Button } from 'antd';
import { register } from '@/services/ant-design-pro/api';

const Test = () => {
  const sendRequest = async () => {
    const res = await register();
  };

  return (
    <div>
      ...Test...
      <Button onClick={sendRequest}>click send register</Button>
    </div>
  );
};

export default Test;

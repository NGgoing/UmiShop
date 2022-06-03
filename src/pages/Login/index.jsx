import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login, register } from '@/services/ant-design-pro/api';
import styles from './index.less';

const Login = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const { initialState, setInitialState } = useModel('@@initialState');
  // const { userInfo: ui } = useModel('user');
  const intl = useIntl();

  // useEffect(() => {
  //   const userInfo = localStorage.getItem('userInfo');
  //   if (userInfo) {
  //     history.replace('/');
  //     return;
  //   }
  // }, []);
  useEffect(() => {
    localStorage.clear();
  }, []);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => {
        return { ...s, currentUser: userInfo };
      });
    }
  };

  // 處理表單提交
  const handleSubmit = async (values) => {
    try {
      // 獲取登录信息, 本地有記錄則拿取，無則請求
      let msg = undefined;
      const access_token = localStorage.getItem('access_token');
      if (access_token) {
        msg = access_token;
      } else {
        const temp = await login({ ...values });
        msg = temp.access_token;
      }
      if (msg) {
        message.success('登录成功！');
        await fetchUserInfo();
        /** 此方法会跳转到 / */
        history.push('/');
        return;
      }
      // const msg = await register();
      console.log(msg); // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      console.log(error);
      message.error('登录失败，请重试！');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          subTitle={intl.formatMessage({
            id: 'pages.layouts.userLayout.title',
          })}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          {
            // 表單佈局
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="email: super@a.com"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入郵箱!"
                      />
                    ),
                  },
                  {
                    type: 'email',
                    message: '輸入正確的郵箱',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="密码: 123123"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          }
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

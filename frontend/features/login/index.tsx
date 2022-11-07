import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { User, UserReponse } from '../../models/User';
import styles from './styles';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUser } from '../../slices/AuthSlice';
import { useRouter } from 'next/router';
import Loading from '../../components/Loading';
import { openNotification } from '../../utils/helper';
import { UserOutlined } from '@ant-design/icons';
import { AxiosResponse } from 'axios';

const LoginComponent = () => {
  const { auth } = useAppSelector((state) => state);
  const { data, status } = auth;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isLoading = status === 'loading';

  const onFinish = (values: User) => {
    dispatch(loginUser(values))
      .unwrap()
      .then((response: AxiosResponse<UserReponse>) => {
        router.push('/');
        openNotification({
          status: 'open',
          placement: 'topRight',
          message: `Welcome ${response.user.username}`,
          description: '',
          icon: <UserOutlined />,
        });
      })
      .catch((err) => {
        openNotification({
          status: 'error',
          placement: 'bottomRight',
          message: err,
          description: '',
          icon: null,
        });
      });
  };

  return (
    <div style={styles.container}>
      <Loading visible={isLoading} />
      <Form
        name='formLogin'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: false, password: '', username: '' }}
        onFinish={onFinish}
        autoComplete='off'
        style={styles.loginWrapper}
      >
        <Form.Item
          label='Username'
          name='username'
          rules={[
            { required: true, message: 'Please input your username!' },
            // { pattern: regex, message: 'Do not contain spaces!' },
            { min: 6 },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6 },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='remember'
          valuePropName='checked'
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <span>If you don't have account?</span>
            <Link href='/register'>
              <a>Register</a>
            </Link>
          </div>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginComponent;

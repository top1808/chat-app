import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { User } from '../../models/User';
import styles from './styles';
import Link from 'next/link';
import { useAppDispatch } from '../../redux/hooks';
import { registerUser } from '../../slices/AuthSlice';
import { useRouter } from 'next/router';

const RegisterComponent = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onFinish = (values: User) => {
    const body: User = {
      username: values.username,
      password: values.password,
      email: values.email,
    };
    dispatch(registerUser(body)).then(() => {
      router.push('/login');
    });
  };

  return (
    <div style={styles.container}>
      <Form
        name='basic'
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        initialValues={{ remember: true }}
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
          hasFeedback
        >
          <Input defaultValue='' />
        </Form.Item>

        <Form.Item
          label='Email'
          name='email'
          rules={[{ required: true }, { type: 'email' }]}
          hasFeedback
        >
          <Input defaultValue='' />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6 },
          ]}
          hasFeedback
        >
          <Input.Password defaultValue='' />
        </Form.Item>

        <Form.Item
          label='Confirm password'
          name='confirmPassword'
          dependencies={['password']}
          rules={[
            {
              required: true,
            },
            ({ getFieldValue }) => ({
              validator(e, value) {
                if (!value || value === getFieldValue('password'))
                  return Promise.resolve();
                return Promise.reject('Password are not match');
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password defaultValue='' />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <span>If you have an account?</span>
            <Link href='/login'>
              <a>Login</a>
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

export default RegisterComponent;

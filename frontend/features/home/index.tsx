import { Button, PageHeader } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import { User } from '../../models/User';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logoutUser } from '../../slices/AuthSlice';
import { getAllUser } from '../../slices/UserSlice';
import { openNotification } from '../../utils/helper';

const HomeComponent: React.FC = () => {
  const { auth, user } = useAppSelector((state) => state);
  console.log('🚀 ~ file: index.tsx ~ line 13 ~ user', user);
  console.log('🚀 ~ file: index.tsx ~ line 13 ~ auth', auth);
  const listUser = user.data;

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    dispatch(logoutUser({ accessToken: auth.data.accessToken, id: '' }))
      .unwrap()
      .then(() => {
        openNotification({
          status: 'success',
          placement: 'bottomRight',
          message: 'Đăng xuất thành công',
          description: '',
          icon: '',
        });
        router.push('/login');
      })
      .catch((error) => {
        console.log(
          '🚀 ~ file: index.tsx ~ line 29 ~ handleLogOut ~ error',
          error
        );
      });
  };

  useEffect(() => {
    return () => {
      if (!auth) {
        openNotification({
          status: 'error',
          placement: 'bottomRight',
          message: 'Bạn chưa đăng nhập',
          description: '',
          icon: '',
        });
        router.push('/login');
      }
      dispatch(getAllUser({ accessToken: auth.data.accessToken, user: null }));
    };
  }, []);

  return (
    <div>
      <Loading visible={false} />
      <PageHeader
        className='site-page-header'
        title=''
        extra={[
          <Button key='logout' onClick={handleLogOut}>
            Log out
          </Button>,
        ]}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {listUser.length > 0 &&
          listUser.map((user: User) => (
            <div style={{ padding: 8, width: '25%' }} key={user._id}>
              <div
                style={{
                  width: '100%',
                  height: 200,
                  backgroundColor: '#ccc',
                  padding: 8,
                  textAlign: 'center',
                }}
              >
                <p>Name: {user.username}</p>
                <p>{user.admin ? 'Admin' : 'User'}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HomeComponent;

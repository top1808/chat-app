import { Spin } from 'antd';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

type Props = {
  visible: boolean;
};

const Loading = (props: Props) => {
  const { visible } = props;

  if (!visible) return <></>;
  return (
    <div className='loading_container'>
      <Spin
        tip='Loading...'
        size='large'
        indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />}
      />
    </div>
  );
};

export default Loading;

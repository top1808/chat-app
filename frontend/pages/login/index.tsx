import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React from 'react';
import LoginComponent from '../../features/login';

const index = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { name } = props;
  return <LoginComponent name={name} />;
};

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      name: 'top'
    }
  };
};

export default index;

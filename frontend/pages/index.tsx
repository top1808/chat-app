import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import HomeComponent from '../features/home';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

const Home: NextPage = () => {
  return <HomeComponent />;
};

Home.displayName = 'Home';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      name: 'top',
    },
  };
};

export default Home;

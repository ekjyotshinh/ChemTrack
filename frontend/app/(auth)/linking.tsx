import * as Linking from 'expo-linking';

const linking = {
  prefixes: ['chemtrack://'],
  config: {
    screens: {
      customSignup1: 'signup',
    },
  },
};

export default linking;

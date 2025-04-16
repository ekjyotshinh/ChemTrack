
import * as Linking from 'expo-linking';

const linking = {
  prefixes: ['chemtrack://'],
  config: {
    screens: {
      signup: 'customSignup1', // Matches the deep link path
    },
  },
};

export default linking;

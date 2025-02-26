
import * as Linking from 'expo-linking';

const linking = {
  prefixes: ['chemtrack://'],
  config: {
    screens: {
      signup: 'signup', // Matches the deep link path
    },
  },
};

export default linking;

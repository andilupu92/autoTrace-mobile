import { Text } from 'react-native';
import { Box } from '@/components/ui/box';

export default function HomeScreen() {
  return (
    <Box>
      <Text className="text-lg font-bold text-center text-gray-800 dark:text-white">
        Welcome to the Home Screen!
      </Text>
    </Box>
  );
}
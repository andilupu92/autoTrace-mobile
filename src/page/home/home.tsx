import { Box } from '@/components/ui/box';
import Cars from './cars';
import AddCarCard from './addCar';

export default function HomeScreen() {
    
  return (
    <Box className="flex-1 dark:bg-slate-950">

        <Box className="mb-6">
            <Cars />
         </Box>
         {/*<Box className="mt-32 px-4">
            <AddCarCard />
         </Box>*/}

    </Box>
  );
}
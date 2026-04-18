import { useFCM, useNotifications } from '@/hooks';

const useHomeScreen = () => {
  useFCM();
  useNotifications();

};

export default useHomeScreen;

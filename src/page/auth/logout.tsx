import { TouchableOpacity, Text } from 'react-native';
import { authApi } from "../../api/services/authService";
import { useAuthStore } from "../../store/authStore";


export const LogoutButton = () => {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await logout();
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Text>Logout</Text>
    </TouchableOpacity>
  );
};
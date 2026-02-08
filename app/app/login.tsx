import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Alert, View } from "react-native";
import axios from "axios";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      router.replace("/(tabs)");
    } catch (error) {
      let errorMessage = "Failed to login. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (!error.response) {
          errorMessage = "Cannot connect to server";
        }
      }

      Alert.alert("Login Failed", errorMessage);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <AuthForm mode="login" onSubmit={handleLogin} />
    </View>
  );
}

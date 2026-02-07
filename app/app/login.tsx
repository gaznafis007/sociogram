import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Alert, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to login. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <AuthForm mode="login" onSubmit={handleLogin} />
    </View>
  );
}

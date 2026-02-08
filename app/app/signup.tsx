import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Alert, View } from "react-native";
import axios from "axios";

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();

  const handleSignup = async (data: {
    email: string;
    password: string;
    username?: string;
    fullName?: string;
  }) => {
    try {
      if (!data.username || !data.fullName) {
        Alert.alert("Error", "Username and full name are required");
        return;
      }

      await signup(data.username, data.email, data.password, data.fullName);
      router.replace("/(tabs)");
    } catch (error) {
      let errorMessage = "Failed to create account. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 409) {
          errorMessage = "Username or email already exists";
        } else if (error.response?.status === 400) {
          errorMessage = "Invalid input. Please check your details.";
        }
      }

      Alert.alert("Signup Failed", errorMessage);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <AuthForm mode="signup" onSubmit={handleSignup} />
    </View>
  );
}

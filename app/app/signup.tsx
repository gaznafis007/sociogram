import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Alert, View } from "react-native";

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();

  const handleSignup = async (data: {
    email: string;
    password: string;
    username?: string;
  }) => {
    try {
      if (!data.username) {
        Alert.alert("Error", "Username is required");
        return;
      }

      await signup(data.username, data.email, data.password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to create account. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <AuthForm mode="signup" onSubmit={handleSignup} />
    </View>
  );
}

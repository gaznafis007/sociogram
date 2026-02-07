import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Button from "../ui/Button";
import Input from "../ui/Input";

type AuthFormProps = {
  mode: "login" | "signup";
  onSubmit: (data: {
    email: string;
    password: string;
    username?: string;
  }) => Promise<void>;
};

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    username?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Signup specific validations
    if (isSignup) {
      if (!username.trim()) {
        newErrors.username = "Username is required";
      } else if (username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit({
        email: email.trim(),
        password,
        username: isSignup ? username.trim() : undefined,
      });
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    if (isSignup) {
      router.push("/login");
    } else {
      router.push("/signup");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center p-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-md mx-auto">
          {/* Title */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
              {isSignup ? "Create Account" : "Welcome Back"}
            </Text>
            <Text className="text-gray-600 text-center">
              {isSignup ? "Sign up to get started" : "Sign in to continue"}
            </Text>
          </View>

          {/* Form Fields */}
          <View className="mb-6">
            {isSignup && (
              <Input
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                error={errors.username}
                autoCapitalize="none"
              />
            )}

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              error={errors.password}
              secureTextEntry
            />

            {isSignup && (
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                secureTextEntry
              />
            )}
          </View>

          {/* Submit Button */}
          <Button
            title={isSignup ? "Sign Up" : "Sign In"}
            onPress={handleSubmit}
            loading={loading}
          />

          {/* Switch Mode Link */}
          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-600">
              {isSignup
                ? "Already have an account? "
                : "Don't have an account? "}
            </Text>
            <Pressable onPress={handleNavigate}>
              <Text className="text-blue-500 font-semibold">
                {isSignup ? "Sign In" : "Sign Up"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

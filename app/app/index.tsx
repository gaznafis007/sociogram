// This file is no longer needed - auth routing is handled in _layout.tsx
// Keeping as placeholder for app root
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/login" />;
}

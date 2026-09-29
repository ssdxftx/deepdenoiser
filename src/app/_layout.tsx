import UpdateModal from "@/src/components/UpdateModal";
import { COLORS, FONT_SIZE, Styles } from "@/src/constants/theme";
import { Feather } from "@expo/vector-icons";
import * as Audio from "expo-audio";
import { useFonts } from "expo-font";
import { usePermissions } from "expo-media-library";
import { createPermissionHook } from "expo-modules-core";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Host, LoadingIndicator } from "@expo/ui/jetpack-compose";
import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaProvider
} from "react-native-safe-area-context";


// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const useMicrophonePermissions = createPermissionHook({
  getMethod: Audio.getRecordingPermissionsAsync,
  requestMethod: Audio.requestRecordingPermissionsAsync,
});

export default function RootLayout() {
  const [mediaPermissionResponse, requestMediaPermission] = usePermissions();
  const [micPermissionResponse, requestMicPermission] = useMicrophonePermissions();

  const [fontsLoaded, fontError] = useFonts({
    ...Feather.font,
  });

  const appIsReady = fontsLoaded || fontError;

  // Splash — hide when fonts are ready
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady && !fontError) {
    return null;
  }

  // Handle Permissions
  if (!mediaPermissionResponse || !micPermissionResponse) {
    // Permission response is still loading
    return (
      <View style={[Styles.container, styles.centered]}>
        <Host matchContents colorScheme="dark">
          <LoadingIndicator color={COLORS.primary} />
        </Host>
      </View>
    );
  }

  const allPermissionsGranted = mediaPermissionResponse.granted && micPermissionResponse.granted;

  if (!allPermissionsGranted) {
    const handleRequestPermissions = async () => {
      if (!mediaPermissionResponse.granted) {
        await requestMediaPermission();
      }
      if (!micPermissionResponse.granted) {
        await requestMicPermission();
      }
    };

    return (
      <View style={[Styles.container, styles.centered]}>
        <Feather
          name="shield-off"
          size={64}
          color={COLORS.error}
          style={{ marginBottom: 20 }}
        />
        <Text style={styles.permissionTitle}>需要授予权限</Text>
        <Text style={styles.permissionSubtitle}>
          DeepDenoiser 需要访问您的媒体库以导入和保存音频文件，并需要麦克风权限用于语音录制和实时降噪。
        </Text>
        <TouchableOpacity style={Styles.button} onPress={handleRequestPermissions}>
          <Text style={Styles.buttonText}>授予权限</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">

        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="processing" />
      </Stack>
      <UpdateModal />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  permissionTitle: {
    fontSize: FONT_SIZE.heading,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
    textAlign: "center",
  },
  permissionSubtitle: {
    fontSize: FONT_SIZE.body,
    color: COLORS.subtext,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
});

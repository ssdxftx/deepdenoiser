import * as theme from "@/src/constants/theme";
import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import DonationModal from "@/src/components/DonationModal";
import SettingsSidebar from "@/src/components/SettingsSidebar";
import Constants from "expo-constants";

export default function AboutScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={theme.Styles.container}>
      <ScrollView
        contentContainerStyle={theme.Styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setSettingsVisible(true)}
        >
          <Feather name="settings" size={24} color={theme.COLORS.text} />
        </TouchableOpacity>
        <View style={theme.Styles.header}>

          <Text style={theme.Styles.title}>关于 DeepDenoiser</Text>
          <Text style={theme.Styles.subtitle}>版本 {Constants.expoConfig?.version}</Text>
        </View>

        <View style={[theme.Styles.card, styles.infoCard]}>
          <Text style={styles.cardTitle}>DeepDenoiser 是什么？</Text>
          <Text style={styles.cardText}>
            DeepDenoiser 是一款开源工具，致力于让每个人都能使用专业级的音频降噪功能。它采用前沿的深度学习技术，实时分离语音并去除视频和音频中的背景噪音。您的文件始终不会离开设备，全部处理都在本机完成。
          </Text>
        </View>

        <Text style={styles.sectionTitle}>联系我们</Text>
        <View style={styles.linkContainer}>
          <TouchableOpacity
            style={[theme.Styles.button, styles.linkButton]}
            onPress={() => openLink("https://github.com/sayampy/deepdenoiser")}
          >
            <Feather name="github" size={20} color={theme.COLORS.background} />
            <Text style={[theme.Styles.buttonText, { marginLeft: 10 }]}>
              GitHub 仓库
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              theme.Styles.button,
              theme.Styles.buttonSecondary,
              styles.linkButton,
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Feather name="user" size={20} color={theme.COLORS.primary} />
            <Text
              style={[
                theme.Styles.buttonText,
                theme.Styles.buttonTextSecondary,
                { marginLeft: 10 },
              ]}
            >
              打赏支持
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>法律信息</Text>
        <View style={styles.linkContainer}>
          <TouchableOpacity
            style={[
              theme.Styles.button,
              theme.Styles.buttonSecondary,
              styles.linkButton,
            ]}
            onPress={() => router.push("/about/licenses")}
          >
            <Feather name="file-text" size={20} color={theme.COLORS.primary} />
            <Text
              style={[
                theme.Styles.buttonText,
                theme.Styles.buttonTextSecondary,
                { marginLeft: 10 },
              ]}
            >
              开源许可
            </Text>
          </TouchableOpacity>
        </View>



        <View style={styles.footer}>
          <Text style={styles.footerText}>
            由 Sayampy 用{" "}
            <Image
              source={require("@/assets/images/heart_india.png")}
              style={{
                width: 15,
                height: 15,
                // marginTop: 5,
              }}
            />{" "}
            制作
          </Text>
        </View>

        <DonationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />

        <SettingsSidebar
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    position: "absolute",
    right: 0,
    marginTop: 14,
    padding: 10,
  },
  infoCard: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: theme.FONT_SIZE.heading,
    fontWeight: "700",
    color: theme.COLORS.primary,
    marginBottom: 8,
  },
  cardText: {
    fontSize: theme.FONT_SIZE.body,
    color: theme.COLORS.text,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: theme.FONT_SIZE.heading,
    fontWeight: "700",
    color: theme.COLORS.text,
    marginBottom: 16,
    marginTop: 8,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  featureItem: {
    width: "48%",
    backgroundColor: theme.COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(0, 229, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: theme.FONT_SIZE.body,
    fontWeight: "700",
    color: theme.COLORS.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: theme.FONT_SIZE.small,
    color: theme.COLORS.subtext,
    lineHeight: 18,
  },
  linkContainer: {
    gap: 12,
    marginBottom: 32,
  },
  linkButton: {
    width: "100%",
  },
  footer: {
    alignItems: "center",
    marginTop: 8,
    paddingBottom: 24,
  },
  footerText: {
    color: theme.COLORS.subtext,
    fontSize: theme.FONT_SIZE.small,
  },
});

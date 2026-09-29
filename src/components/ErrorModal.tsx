import * as theme from "@/src/constants/theme";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface ErrorModalProps {
  visible: boolean;
  error: Error | null;
  onClose: () => void;
}

export default function ErrorModal({ visible, error, onClose }: ErrorModalProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!error) return null;

  const interpretError = (err: Error) => {
    const msg = err.message.toLowerCase();
    const stack = err.stack?.toLowerCase() || "";
    if (msg.includes("out of memory") || msg.includes("allocation failed") || stack.includes("outofmemory")) {
      return {
        title: "内存不足",
        description: "您的设备内存已耗尽，通常发生在处理超大文件时。请尝试关闭其他应用，或处理更短的音频片段。",
        icon: "cpu" as const,
      };
    }
    if (msg.includes("no audio track") || stack.includes("no audio track")) {
      return {
        title: "未找到音频轨道",
        description: "请确认文件未损坏且包含音频轨道",
        icon: "mic-off" as const,
      };
    }
    if (msg.includes("illegal character") || stack.includes("illegal character")) {
      return {
        title: "文件名包含非法字符",
        description: "请将文件重命名为不含任何 ASCII 符号的有效文件名",
        icon: "file" as const,
      };
    }

    if (msg.includes("decoder") || msg.includes("mediacodec") || msg.includes("transcode failed") || msg.includes("format")) {
      return {
        title: "媒体解码失败",
        description: "您设备的硬件（MediaCodec）无法处理该文件格式或分辨率。请尝试其他文件格式（如 .mp3 或 .mp4）。",
        icon: "video-off" as const,
      };
    }

    if (msg.includes("onnx") || msg.includes("session") || msg.includes("model")) {
      return {
        title: "AI 模型错误",
        description: "降噪模型初始化或运行失败，可能是由于硬件加速不兼容导致的。",
        icon: "activity" as const,
      };
    }

    if (msg.includes("permission") && msg.includes("denied")) {
      return {
        title: "权限被拒绝",
        description: "应用没有访问您文件的权限。请检查应用设置。",
        icon: "lock" as const,
      };
    }

    return {
      title: "出错了",
      description: "处理过程中发生了意外错误。详情请查看下方信息。",
      icon: "alert-circle" as const,
    };
  };

  const interpretation = interpretError(error);

  const copyToClipboard = async () => {
    const textToCopy = `Error: ${error.message}\n\nStack: ${error.stack}`;
    await Clipboard.setStringAsync(textToCopy);
  };

  const submitToGithub = () => {
    const title = encodeURIComponent(`[Bug]: ${interpretation.title}`);
    const body = encodeURIComponent(
      `**错误解读：**\n${interpretation.title}: ${interpretation.description}\n\n` +
      `**堆栈信息：**（粘贴错误详情）\n\n` +
      `**设备信息：**\n（请在此填写您的设备型号、内存大小和系统版本）`
    );
    const url = `https://github.com/sayampy/deepdenoiser/issues/new?title=${title}&body=${body}`;
    Linking.openURL(url);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: theme.COLORS.error + "20" }]}>
              <Feather name={interpretation.icon} size={28} color={theme.COLORS.error} />
            </View>
            <Text style={styles.modalTitle}>{interpretation.title}</Text>
          </View>

          <Text style={styles.description}>{interpretation.description}</Text>

          <TouchableOpacity
            style={styles.detailsToggle}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text style={styles.detailsToggleText}>
              {showDetails ? "隐藏技术详情" : "显示技术详情"}
            </Text>
            <Feather
              name={showDetails ? "chevron-up" : "chevron-down"}
              size={16}
              color={theme.COLORS.subtext}
            />
          </TouchableOpacity>

          {showDetails && (
            <View style={styles.errorContainer}>
              <ScrollView style={styles.errorScrollView} nestedScrollEnabled={true}>
                <Text style={styles.errorText}>{error.message}</Text>
                {error.stack && (
                  <Text style={[styles.errorText, { marginTop: 8, opacity: 0.7 }]}>
                    {error.stack}
                  </Text>
                )}
              </ScrollView>
            </View>
          )}

          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Feather name="copy" size={16} color={theme.COLORS.primary} />
            <Text style={styles.copyButtonText}>复制错误详情</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.githubHint}>
            如果您认为这是应用本身的问题，而非设备问题：
          </Text>

          <TouchableOpacity style={styles.githubButton} onPress={submitToGithub}>
            <Feather name="github" size={20} color={theme.COLORS.background} />
            <Text style={styles.githubButtonText}>在 GitHub 上反馈</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              theme.Styles.button,
              theme.Styles.buttonSecondary,
              styles.closeButton,
            ]}
            onPress={onClose}
          >
            <Text style={[theme.Styles.buttonText, theme.Styles.buttonTextSecondary]}>
              关闭
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.COLORS.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: theme.FONT_SIZE.heading,
    fontWeight: "700",
    color: theme.COLORS.text,
    flex: 1,
  },
  description: {
    fontSize: theme.FONT_SIZE.body,
    color: theme.COLORS.subtext,
    lineHeight: 22,
    marginBottom: 20,
  },
  detailsToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  detailsToggleText: {
    fontSize: theme.FONT_SIZE.small,
    color: theme.COLORS.subtext,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#00000040",
    borderRadius: 12,
    padding: 12,
    maxHeight: 150,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
  },
  errorScrollView: {
    flexGrow: 0,
  },
  errorText: {
    fontSize: 12,
    fontFamily: theme.FONTS?.mono || "monospace",
    color: "#FFAAAA",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    alignSelf: "center",
    marginBottom: 16,
  },
  copyButtonText: {
    fontSize: theme.FONT_SIZE.small,
    color: theme.COLORS.primary,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: theme.COLORS.border,
    width: "100%",
    marginBottom: 16,
  },
  githubHint: {
    fontSize: theme.FONT_SIZE.xsmall,
    color: theme.COLORS.subtext,
    textAlign: "center",
    marginBottom: 12,
    fontStyle: "italic",
  },
  githubButton: {
    flexDirection: "row",
    backgroundColor: theme.COLORS.text,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },
  githubButtonText: {
    color: theme.COLORS.background,
    fontSize: theme.FONT_SIZE.body,
    fontWeight: "700",
  },
  closeButton: {
    width: "100%",
    height: 48,
  },
});

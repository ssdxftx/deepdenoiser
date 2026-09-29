import * as theme from "@/src/constants/theme";
import type { SilenceTrimSettings } from "@/src/scripts/silenceTrim";
import Feather from "@expo/vector-icons/Feather";
import { Host, Switch } from "@expo/ui/jetpack-compose";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomSlider from "./customSlider";
import InfoBubble from "./InfoBubble";

interface SilenceTrimProps {
  settings: SilenceTrimSettings;
  onChange: (settings: SilenceTrimSettings) => void;
}

const THRESHOLD_STEPS = [-60, -55, -50, -45, -40, -35, -30, -25, -20];

const MIN_PAUSE_STEPS = [200, 300, 400, 500, 600, 800, 1000, 1500, 2000];

// eslint-disable-next-line @typescript-eslint/no-redeclare -- component name matches its props type by convention
export default function SilenceTrimSettings({
  settings,
  onChange,
}: SilenceTrimProps) {
  const setMode = (mode: "auto" | "manual") => {
    if (settings.mode === mode) return;
    onChange({ ...settings, mode });
  };

  return (
    <View>
      <View style={[styles.settingItem, { marginBottom: 10 }]}>
        <View style={styles.settingLabelRow}>
          <View style={theme.Styles.row}>
            <Text style={styles.settingLabel}>裁剪静音</Text>
            <View style={styles.betaTag}>
              <Text style={styles.betaText}>测试版</Text>
            </View>
            <InfoBubble
              text={`从降噪后的音频中移除安静的停顿，从而缩短时长。\n\n自动：分析音频并自动选取阈值。\n手动：由您设置阈值和最短停顿时长。\n\n只有既足够安静又足够长的停顿才会被移除。`}
            >
              <Feather
                name="help-circle"
                size={18}
                color={theme.COLORS.subtext}
              />
            </InfoBubble>
          </View>
          <Host matchContents style={{ width: 52, height: 32 }} colorScheme="dark">
            <Switch
              value={settings.enabled}
              onCheckedChange={(value) => onChange({ ...settings, enabled: value })}
              colors={{
                uncheckedTrackColor: theme.COLORS.border,
                checkedTrackColor: theme.COLORS.primary,
                checkedThumbColor: theme.COLORS.text,
                uncheckedThumbColor: theme.COLORS.text,
              }}
            />
          </Host>
        </View>
      </View>

      {settings.enabled && (
        <View>
          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[
                styles.modePill,
                settings.mode === "auto" && styles.modePillActive,
              ]}
              onPress={() => setMode("auto")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modeText,
                  settings.mode === "auto" && styles.modeTextActive,
                ]}
              >
                自动
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modePill,
                settings.mode === "manual" && styles.modePillActive,
              ]}
              onPress={() => setMode("manual")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modeText,
                  settings.mode === "manual" && styles.modeTextActive,
                ]}
              >
                手动
              </Text>
            </TouchableOpacity>
          </View>

          {settings.mode === "manual" && (
            <View>
              <CustomSlider
                label="静音阈值"
                value={settings.thresholdDb}
                onValueChange={(value) =>
                  onChange({ ...settings, thresholdDb: value })
                }
                min={-60}
                max={-20}
                steps={THRESHOLD_STEPS}
                info={`一段音频需要多安静才会被视为静音。越高越激进。`}
              />
              <CustomSlider
                label="最短停顿长度"
                value={settings.minSilenceMs}
                onValueChange={(value) =>
                  onChange({ ...settings, minSilenceMs: value })
                }
                min={200}
                max={2000}
                steps={MIN_PAUSE_STEPS}
                unit="ms"
                info={`只有超过此时长的静音才会被移除。\n\n500ms = 推荐值（自然停顿更短，更长的多为犹豫）。\n200-400ms = 移除更多。\n800ms 以上 = 仅移除长停顿。`}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    marginTop: theme.SPACING.small,
  },
  settingLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  settingLabel: {
    color: theme.COLORS.subtext,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  modePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  modePillActive: {
    backgroundColor: theme.COLORS.primary,
    borderColor: theme.COLORS.primary,
  },
  modeText: {
    color: theme.COLORS.subtext,
    fontSize: 13,
    fontWeight: "700",
  },
  modeTextActive: {
    color: theme.COLORS.background,
  },
  betaTag: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
  },
  betaText: {
    color: theme.COLORS.background,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});

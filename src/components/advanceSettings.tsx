import * as theme from "@/src/constants/theme";
import type { SilenceTrimSettings } from "@/src/scripts/silenceTrim";
import Feather from "@expo/vector-icons/Feather";
import { Host, Switch } from "@expo/ui/jetpack-compose";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomSlider from "./customSlider";
import InfoBubble from "./InfoBubble";
import SilenceTrimSettingsBlock from "./silenceTrimSettings";

interface AdvanceSettingsProps {
  attenLimDb: number;
  onAttenLimDbChange: (value: number) => void;
  normalize: {
    toggle: boolean;
    targetRMS: number;
    maxPeakDb: number;
  };
  onNormalizeChange: (value: any) => void;
  silenceTrim: SilenceTrimSettings;
  onSilenceTrimChange: (value: SilenceTrimSettings) => void;
  /** Hide the silence-trim section entirely (e.g. video files). */
  showSilenceTrim?: boolean;
}

const ALSTEPS = [0, 5, 10, 15, 20, 30, 40];

export default function AdvanceSettings({
  attenLimDb,
  onAttenLimDbChange,
  normalize,
  onNormalizeChange,
  silenceTrim,
  onSilenceTrimChange,
  showSilenceTrim = true,
}: AdvanceSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleNormalize = () => {
    onNormalizeChange({
      ...normalize,
      toggle: !normalize.toggle,
    });
  };

  const handleTargetRMSChange = (val: number) => {
    onNormalizeChange({
      ...normalize,
      targetRMS: val,
    });
  };

  const handleMaxPeakChange = (val: number) => {
    onNormalizeChange({
      ...normalize,
      maxPeakDb: val,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View style={theme.Styles.row}>
          <Feather
            name="settings"
            size={18}
            color={theme.COLORS.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.headerText}>高级设置</Text>
        </View>
        <Feather
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.COLORS.subtext}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>
          <View style={[styles.settingItem, { marginBottom: 10 }]}>
            <View style={styles.settingLabelRow}>
              <View style={theme.Styles.row}>
                <Text style={styles.settingLabel}>响度标准化</Text>
                <InfoBubble text={`提升过小的音量，以便 AI 能有效降噪。\n当录音音量太小或忽大忽小时使用。\n若语音已经处于舒适的聆听音量，可跳过此项。`}>
                  <Feather name="help-circle" size={18} color={theme.COLORS.subtext} />
                </InfoBubble>
              </View>
              <Host matchContents style={{ width: 52, height: 32 }} colorScheme="dark">
                <Switch
                  value={normalize.toggle}
                  onCheckedChange={handleToggleNormalize}
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

          {normalize.toggle && (
            <View>
              <CustomSlider
                label="目标 RMS"
                value={normalize.targetRMS}
                onValueChange={handleTargetRMSChange}
                min={-20}
                max={-10}
                decimalPlaces={0}
                info={`输出音频的目标响度。\n-14dB = 推荐默认值。\n-20dB = 更安静，动态范围更大。\n-10dB = 更响亮，余量更小。`}
              />
              <CustomSlider
                label="峰值限制"
                value={normalize.maxPeakDb}
                onValueChange={handleMaxPeakChange}
                min={-10}
                max={0}
                decimalPlaces={0}
                info={`最大峰值音量的硬性上限。\n-1.0dB = 安全默认值，可防止削波。\n-10dB = 保守设置，留有充足余量。\n0dB = 最大音量，有失真风险。`}
              />
            </View>
          )}

          <View style={{ height: 1, backgroundColor: "rgba(255, 255, 255, 0.05)", marginVertical: 15 }} />

          <CustomSlider
            label="衰减限制"
            value={attenLimDb}
            onValueChange={onAttenLimDbChange}
            min={0}
            max={40}
            steps={ALSTEPS}
            info={`限制 AI 去除噪音的强度。\n0dB = 最强（背景最安静）。\n40dB = 几乎保留所有环境音。\n建议从 0dB 开始，若音频听起来过度处理再逐步调高。`}
          />

          {showSilenceTrim && (
            <>
              <View style={{ height: 1, backgroundColor: "rgba(255, 255, 255, 0.05)", marginVertical: 15 }} />
              <SilenceTrimSettingsBlock
                settings={silenceTrim}
                onChange={onSilenceTrimChange}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    marginTop: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.SPACING.medium,
  },
  headerText: {
    color: theme.COLORS.text,
    fontSize: theme.FONT_SIZE.body,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: theme.SPACING.medium,
    paddingBottom: theme.SPACING.medium,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
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
});

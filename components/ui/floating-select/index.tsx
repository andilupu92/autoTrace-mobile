import { useState, useRef } from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useColorScheme } from 'nativewind';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';

interface SelectOption {
  label: string;
  value: any;
}

interface FloatingSelectProps {
  label: string;
  value: any;
  onValueChange: (value: any) => void;
  options: SelectOption[];
  isInvalid?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  className?: string;
  maxVisibleOptions?: number;
}

export default function FloatingSelect({
  label,
  value,
  onValueChange,
  options,
  isInvalid = false,
  isDisabled = false,
  leftIcon,
  className = '',
  maxVisibleOptions = 4,
}: FloatingSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0 });

  const [scrollThumbTop, setScrollThumbTop] = useState(0);
  const [scrollThumbHeight, setScrollThumbHeight] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);

  const triggerRef = useRef<View>(null);
  const { colorScheme } = useColorScheme();
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  const OPTION_HEIGHT = 48;
  const scrollMaxHeight = maxVisibleOptions * OPTION_HEIGHT;
  const SCROLLBAR_WIDTH = 3;
  const SCROLLBAR_MARGIN = 6;

  const openDropdown = () => {
    if (isDisabled) return;
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownLayout({ x, y: y + height + 6, width });
      setIsOpen(true);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  };

  const closeDropdown = () => {
    setIsOpen(false);
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSelect = (option: SelectOption) => {
    onValueChange(option.value);
    closeDropdown();
  };

  const handleContentSizeChange = (_: number, contentHeight: number) => {
    const scrollable = contentHeight > scrollMaxHeight;
    setIsScrollable(scrollable);
    if (scrollable) {
      const thumbH = (scrollMaxHeight / contentHeight) * scrollMaxHeight;
      setScrollThumbHeight(thumbH);
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    if (contentSize.height <= layoutMeasurement.height) return;
    const scrollRatio = contentOffset.y / (contentSize.height - layoutMeasurement.height);
    const maxThumbTop = scrollMaxHeight - scrollThumbHeight;
    setScrollThumbTop(scrollRatio * maxThumbTop);
  };

  const selectedLabel = options.find((o) => o.value === value)?.label;

  const labelTop = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -10],
  });

  const labelFontSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const getLabelColor = () => {
    if (isInvalid) return '#f87171';
    if (isOpen) return '#3b82f6';
    if (value) return colorScheme === 'dark' ? '#94a3b8' : '#6b7280';
    return colorScheme === 'dark' ? '#a7a8a8' : '#9ca3af';
  };

  const getLabelBackgroundColor = () =>
    colorScheme === 'dark' ? '#0f172a' : '#f9fafb';

  const getBorderColor = () => {
    if (isInvalid) return 'border-red-400';
    if (isOpen) return 'border-blue-500';
    return 'border-gray-100 dark:border-slate-800';
  };

  const getDropdownBg = () =>
    colorScheme === 'dark' ? '#1e293b' : '#ffffff';

  const getDropdownBorder = () =>
    colorScheme === 'dark' ? '#334155' : '#e2e8f0';

  const scrollbarTrackColor = colorScheme === 'dark' ? '#1e3a5f' : '#e0eaff';
  const scrollbarThumbColor = '#3b82f6';

  const dividerColor = colorScheme === 'dark' ? '#2d3f55' : '#f0f4ff';

  return (
    <Box style={{ position: 'relative', zIndex: 1 }} className={className}>
      {/* Floating Label */}
      <Animated.Text
        style={{
          position: 'absolute',
          left: leftIcon ? 48 : 16,
          top: labelTop,
          fontSize: labelFontSize,
          fontWeight: '600',
          color: getLabelColor(),
          backgroundColor: getLabelBackgroundColor(),
          paddingHorizontal: 4,
          borderRadius: 4,
          zIndex: 10,
        }}
      >
        {label}
      </Animated.Text>

      {/* Trigger */}
      <TouchableOpacity
        ref={triggerRef}
        onPress={isOpen ? closeDropdown : openDropdown}
        activeOpacity={isDisabled ? 1 : 0.7}
      >
        <Box
          className={`
            bg-gray-50 dark:bg-slate-900
            border ${getBorderColor()}
            rounded-2xl px-4 py-4
            ${isDisabled ? 'opacity-50' : ''}
          `}
        >
          <HStack className="items-center" space="md">
            {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}

            <View style={{ flex: 1, height: 28, justifyContent: 'center' }}>
              <Text
                className="font-bold text-base text-gray-800 dark:text-white"
                numberOfLines={1}
              >
                {selectedLabel ?? ''}
              </Text>
            </View>

            <Ionicons
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colorScheme === 'dark' ? '#94a3b8' : '#9ca3af'}
            />
          </HStack>
        </Box>
      </TouchableOpacity>

      {/* Modal Dropdown */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  position: 'absolute',
                  top: dropdownLayout.y,
                  left: dropdownLayout.x,
                  width: dropdownLayout.width,
                  backgroundColor: getDropdownBg(),
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: getDropdownBorder(),
                  shadowColor: '#3b82f6',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.12,
                  shadowRadius: 20,
                  elevation: 10,
                  paddingVertical: 8,
                  flexDirection: 'row',
                }}
              >
                {/* ── Options list ── */}
                <ScrollView
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 1, maxHeight: scrollMaxHeight }}
                  nestedScrollEnabled={true}
                  onScroll={handleScroll}
                  onContentSizeChange={handleContentSizeChange}
                  scrollEventThrottle={16}
                >
                  {options.map((item, index) => {
                    const isSelected = item.value === value;
                    const isLast = index === options.length - 1;

                    return (
                      <View key={item.value}>
                        <TouchableOpacity
                          onPress={() => handleSelect(item)}
                          activeOpacity={0.6}
                          style={{
                            marginHorizontal: 8,
                            marginVertical: 2,
                            borderRadius: 12,
                            backgroundColor: isSelected
                              ? colorScheme === 'dark' ? '#1e3a5f' : '#eff6ff'
                              : 'transparent',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            paddingVertical: 12,
                          }}
                        >
                          {/* Left accent bar */}
                          <View
                            style={{
                              width: 3,
                              height: 20,
                              borderRadius: 2,
                              backgroundColor: isSelected ? '#3b82f6' : 'transparent',
                              marginRight: 12,
                            }}
                          />

                          {/* Label */}
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 15,
                              fontWeight: isSelected ? '700' : '400',
                              color: isSelected
                                ? '#3b82f6'
                                : colorScheme === 'dark' ? '#e2e8f0' : '#374151',
                              letterSpacing: isSelected ? 0.2 : 0,
                            }}
                          >
                            {item.label}
                          </Text>

                          {/* Checkmark pill */}
                          {isSelected && (
                            <View
                              style={{
                                backgroundColor: '#3b82f6',
                                borderRadius: 20,
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <Ionicons name="checkmark" size={11} color="#ffffff" />
                              <Text style={{ fontSize: 11, color: '#ffffff', fontWeight: '600' }}>
                                Selected
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>

                        {/* Divider — hidden after the last item */}
                        {!isLast && (
                          <View
                            style={{
                              marginHorizontal: 20,
                              height: 1,
                              borderRadius: 1,
                              backgroundColor: dividerColor,
                            }}
                          />
                        )}
                      </View>
                    );
                  })}
                </ScrollView>

                {/* ── Right scrollbar ── */}
                {isScrollable && (
                  <View
                    style={{
                      width: SCROLLBAR_WIDTH,
                      maxHeight: scrollMaxHeight,
                      marginRight: SCROLLBAR_MARGIN,
                      marginVertical: 4,
                      borderRadius: SCROLLBAR_WIDTH / 2,
                      backgroundColor: scrollbarTrackColor,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        position: 'absolute',
                        top: scrollThumbTop,
                        left: 0,
                        width: SCROLLBAR_WIDTH,
                        height: scrollThumbHeight,
                        borderRadius: SCROLLBAR_WIDTH / 2,
                        backgroundColor: scrollbarThumbColor,
                      }}
                    />
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Box>
  );
}

export { FloatingSelect };
import { useState, useRef } from 'react';
import { Animated, View, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';

interface SelectOption {
  label: string;
  value: string;
}

interface FloatingSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
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
  const { colorScheme } = useColorScheme();

  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  const toggleDropdown = () => {
    if (isDisabled) return;
    if (!isOpen) {
      setIsOpen(true);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      closeDropdown();
    }
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

  const getLabelBackgroundColor = () => {
    return colorScheme === 'dark' ? '#0f172a' : '#f9fafb';
  };

  const getBorderColor = () => {
    if (isInvalid) return 'border-red-400';
    if (isOpen) return 'border-blue-500';
    return 'border-gray-100 dark:border-slate-800';
  };

  const getDropdownBg = () => {
    return colorScheme === 'dark' ? '#1e293b' : '#ffffff';
  };

  const getDropdownBorder = () => {
    return colorScheme === 'dark' ? '#334155' : '#e2e8f0';
  };

  const getOptionBg = (optionValue: string) => {
    if (optionValue !== value) return 'transparent';
    return colorScheme === 'dark' ? '#1e3a5f' : '#eff6ff';
  };

  const getOptionTextColor = (optionValue: string) => {
    return optionValue === value
      ? '#3b82f6'
      : colorScheme === 'dark'
      ? '#e2e8f0'
      : '#374151';
  };

  // Each option row is ~48px tall
  const OPTION_HEIGHT = 48;
  const dropdownHeight = Math.min(options.length, maxVisibleOptions) * OPTION_HEIGHT;

  return (
    <Box style={{ position: 'relative', zIndex: isOpen ? 999 : 1 }} className={className}>
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
      <TouchableOpacity onPress={toggleDropdown} activeOpacity={isDisabled ? 1 : 0.7}>
        <Box
          className={`
            bg-gray-50 dark:bg-slate-900
            border ${getBorderColor()}
            rounded-2xl px-4 py-4
            ${isDisabled ? 'opacity-50' : ''}
          `}
        >
          <HStack className="items-center" space="md">
            {leftIcon && (
              <View style={{ marginRight: 8 }}>
                {leftIcon}
              </View>
            )}

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

      {/* Inline Dropdown */}
      {isOpen && (
        <View
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 6,
            backgroundColor: getDropdownBg(),
            borderRadius: 20,
            borderWidth: 1,
            borderColor: getDropdownBorder(),
            maxHeight: dropdownHeight + 16,
            overflow: 'hidden',
            shadowColor: '#3b82f6',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.12,
            shadowRadius: 20,
            elevation: 10,
            zIndex: 999,
            paddingVertical: 8,
          }}
        >
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {options.map((item, index) => {
              const isSelected = item.value === value;
              return (
                <TouchableOpacity
                  key={item.value}
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
              );
            })}
          </ScrollView>
        </View>
      )}
    </Box>
  );
}

export { FloatingSelect };
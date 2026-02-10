import React, { useRef } from 'react';
import { View, Dimensions, TouchableOpacity, Animated } from 'react-native';
import Svg, { Defs, ClipPath, Path, Text as SvgText, Circle, G } from 'react-native-svg';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

interface WelcomeCardProps {
  primaryTitle: string;
  secondaryTitle: string;
  contain: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const screenWidth = Dimensions.get('window').width;

const W = screenWidth;
const H = 270;
const r = 28;
const curveR = 115;

// Theme for SVG colors
const THEMES = {
  light: {
    cardColor: '#F0A83A',
    iconColor: '#FDB022',
    backIconColor: '#f8f6f6',
    backButtonBg: 'rgba(255, 255, 255, 0.3)',
    backArrowColor: '#FFFFFF',
  },
  dark: {
    cardColor: '#2D3748',
    iconColor: '#E2E8F0',
    backIconColor: '#2D3748',
    backButtonBg: 'rgba(255, 255, 255, 0.15)',
    backArrowColor: '#E2E8F0',
  },
};

const cardPath = [
  `M ${r} 0`,
  `L ${W - r} 0`,
  `A ${r} ${r} 0 0 1 ${W} ${r}`,
  `L ${W} ${H - curveR}`,
  `A ${curveR} ${curveR} 0 0 0 ${W - curveR} ${H}`,
  `L ${r} ${H}`,
  `A ${r} ${r} 0 0 1 0 ${H - r}`,
  `L 0 ${r}`,
  `A ${r} ${r} 0 0 1 ${r} 0`,
  'Z',
].join(' ');

export default function WelcomeCard({primaryTitle, secondaryTitle, contain, showBackButton, onBackPress}: WelcomeCardProps) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const theme = isDark ? THEMES.dark : THEMES.light;

  const handleToggle = () => {
    toggleColorScheme();

    // Animation of rotate smooth
    Animated.timing(rotateAnim, {
      toValue: isDark ? 0 : 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Position of the white circle in the round corner
  const iconX = W - curveR * 0.35;
  const iconY = H - curveR * 0.35;
  const iconRadius = 32;

  // Back button position
  const backButtonX = 45;
  const backButtonY = 80;
  const backButtonRadius = 22;

  return (
    <View style={{ width: '100%' }}>
      <Svg width={W} height={H} pointerEvents="none" viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <ClipPath id="cardClip">
            <Path d={cardPath} />
          </ClipPath>
        </Defs>

        {/* Card background */}
        <Path d={cardPath} fill={theme.cardColor} />

        {/* Text */}
        <SvgText
          x={32}
          y={150}
          fontSize={35}
          fontWeight="700"
          fill="#FFFFFF"
          letterSpacing={-0.5}
        >
          {primaryTitle}
        </SvgText>
        <SvgText
          x={32}
          y={190}
          fontSize={35}
          fontWeight="700"
          fill="#FFFFFF"
          letterSpacing={-0.5}
        >
          {secondaryTitle}
        </SvgText>

        <SvgText
          x={32}
          y={235}
          fontSize={14}
          fill="rgba(255,255,255,0.87)"
        >
          {contain}
        </SvgText>

        {/* White circle for icon */}
        <Circle
          cx={iconX}
          cy={iconY}
          r={iconRadius}
          fill={theme.backIconColor}
          opacity={0.95}
        />

        {/* Sun/moon icon - dynamically changes */}
        {!isDark ? (
          // Sun
          <G>
            <Circle cx={iconX} cy={iconY} r={11} fill={theme.iconColor} />
            {/* ray */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = iconX + Math.cos(rad) * 16;
              const y1 = iconY + Math.sin(rad) * 16;
              const x2 = iconX + Math.cos(rad) * 20;
              const y2 = iconY + Math.sin(rad) * 20;
              return (
                <Path
                  key={i}
                  d={`M ${x1} ${y1} L ${x2} ${y2}`}
                  stroke={theme.iconColor}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              );
            })}
          </G>
        ) : (
          // Moon with stars - simpler version
          <G>
            {/* Moon - bigger */}
            <Path
              d={`M ${iconX + 5} ${iconY - 14} 
                  A 16 16 0 1 0 ${iconX + 5} ${iconY + 14} 
                  A 12 12 0 1 1 ${iconX + 5} ${iconY - 14} Z`}
              fill={theme.iconColor}
            />
            
            {/* Star 1 - using small circle */}
            <Circle cx={iconX + 15} cy={iconY - 7} r={2} fill={theme.iconColor} opacity={0.9} />
            
            {/* Star 2 - smaller */}
            <Circle cx={iconX + 7} cy={iconY + 10} r={1.5} fill={theme.iconColor} opacity={0.8} />
          </G>
        )}
      </Svg>

      {/* Back button with icon - positioned outside SVG */}
        {showBackButton && onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              position: 'absolute',
              left: backButtonX - backButtonRadius,
              top: backButtonY - backButtonRadius,
              width: backButtonRadius * 2,
              height: backButtonRadius * 2,
              borderRadius: backButtonRadius,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 99,
            }}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="arrow-back-circle-sharp" 
              size={32} 
              color={theme.backArrowColor} 
            />
          </TouchableOpacity>
        )}

      {/* TouchableOpacity over the circle for toggle */}
      <Animated.View
        style={{
          position: 'absolute',
          right: curveR * 0.35 - iconRadius,
          bottom: curveR * 0.35 - iconRadius,
          width: iconRadius * 2,
          height: iconRadius * 2,
          zIndex: 99,
          transform: [{ rotate: rotation }],
        }}
      >
        
        <TouchableOpacity
          onPress={handleToggle}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: iconRadius,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={0.7}
        />
        <View style={{ flex: 1 }} />
      </Animated.View>
    </View>
  );
}
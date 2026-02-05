import React, { useRef } from 'react';
import { View, Dimensions, TouchableOpacity, Animated } from 'react-native';
import Svg, { Defs, ClipPath, Path, Text as SvgText, Circle, G } from 'react-native-svg';
import { useColorScheme } from 'nativewind';

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
  },
  dark: {
    cardColor: '#2D3748',
    iconColor: '#E2E8F0',
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

export default function WelcomeCard() {
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

        {/* Highlight */}
        {/*<Path
          d={`M ${r} 0 L ${W - r} 0 A ${r} ${r} 0 0 1 ${W} ${r} L ${W} 80 L 0 80 L 0 ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`}
          fill="rgba(255,255,255,0.08)"
        />*/}

        {/* Text */}
        <SvgText
          x={32}
          y={130}
          fontSize={38}
          fontWeight="700"
          fill="#FFFFFF"
          letterSpacing={-0.5}
        >
          Welcome
        </SvgText>
        <SvgText
          x={32}
          y={170}
          fontSize={38}
          fontWeight="700"
          fill="#FFFFFF"
          letterSpacing={-0.5}
        >
          Back
        </SvgText>

        <SvgText
          x={32}
          y={215}
          fontSize={14}
          fill="rgba(255,255,255,0.87)"
        >
          Please sign in to continue
        </SvgText>

        {/* White circle for icon */}
        <Circle
          cx={iconX}
          cy={iconY}
          r={iconRadius}
          fill="#F9FAFB"
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
          // Moon
          <Path
            d={`M ${iconX - 6} ${iconY - 10} 
                A 12 12 0 1 0 ${iconX - 6} ${iconY + 10} 
                A 9 9 0 1 1 ${iconX - 6} ${iconY - 10} Z`}
            fill={theme.iconColor}
          />
        )}
      </Svg>

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
import React, { useRef } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  PanResponder,
} from 'react-native';
import colors from '../../theme/colors';
import { CallRecord, CallOutcome } from '../../types/types';

const OUTCOME_COLORS: Record<CallOutcome, string> = {
  Interested: colors.outcomeInterested,
  Callback: colors.outcomeCallback,
  Closed: colors.outcomeClosed,
  'Not Interested': colors.outcomeNotInterested,
  'No Answer': colors.outcomeNoAnswer,
};

const ACTION_WIDTH = 160; // total width of both buttons combined

interface Props {
  call: CallRecord;
  onPress?: (call: CallRecord) => void;
  onEdit?: (call: CallRecord) => void;
  onDelete?: (call: CallRecord) => void;
}

export default function CallCard({ call, onPress, onEdit, onDelete }: Props) {
  const borderColor = OUTCOME_COLORS[call.outcome] ?? colors.outcomeNoAnswer;
  const formattedDate = new Date(call.callDate).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const translateX = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow swiping left (negative dx)
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -ACTION_WIDTH));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -ACTION_WIDTH / 2) {
          // Swiped far enough — snap open
          Animated.spring(translateX, {
            toValue: -ACTION_WIDTH,
            useNativeDriver: true,
          }).start();
          isOpen.current = true;
        } else {
          // Not far enough — snap closed
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          isOpen.current = false;
        }
      },
    })
  ).current;

  const closeSwipe = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    isOpen.current = false;
  };

  return (
    <View style={styles.container}>
      {/* Action buttons sitting behind the card */}
      <Animated.View style={[
  styles.actionsContainer,
  { width: translateX.interpolate({
      inputRange: [-ACTION_WIDTH, 0],
      outputRange: [ACTION_WIDTH, 0],
      extrapolate: 'clamp',
    })
  }
]}>
  <TouchableOpacity
    style={styles.editBtn}
    onPress={() => { closeSwipe(); onEdit?.(call); }}
  >
    <Text style={styles.actionText}>Edit</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.deleteBtn}
    onPress={() => { closeSwipe(); onDelete?.(call); }}
  >
    <Text style={styles.actionText}>Delete</Text>
  </TouchableOpacity>
</Animated.View>

      {/* The card itself slides left to reveal buttons */}
      <Animated.View style={{ transform: [{ translateX }] }} {...panResponder.panHandlers}>
        <TouchableOpacity
          style={[styles.card, { borderLeftColor: borderColor }]}
          onPress={() => {
            if (isOpen.current) {
              closeSwipe();
            } else {
              onPress?.(call);
            }
          }}
          activeOpacity={0.75}
        >
          <Text style={styles.name}>{call.restaurant?.name ?? 'Unknown Restaurant'}</Text>
          <Text style={[styles.outcome, { color: borderColor }]}>{call.outcome}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
          {call.notes ? <Text style={styles.notes}>{call.notes}</Text> : null}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 10,
    borderLeftWidth: 4,
    padding: 16,
  },
  name: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  outcome: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 13,
    marginBottom: 4,
  },
  date: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 12,
    color: colors.tealLight,
    marginBottom: 4,
  },
  notes: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  actionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
    flexDirection: 'row',
  },
  editBtn: {
    flex: 1,
    backgroundColor: colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 4,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  actionText: {
    fontFamily: 'SpaceMono-Regular',
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
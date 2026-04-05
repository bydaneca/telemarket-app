import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import { CallRecord, CallOutcome } from '../../types/types';

const OUTCOME_COLORS: Record<CallOutcome, string> = {
  Interested: colors.outcomeInterested,
  Callback: colors.outcomeCallback,
  Closed: colors.outcomeClosed,
  'Not Interested': colors.outcomeNotInterested,
  'No Answer': colors.outcomeNoAnswer,
};

interface Props {
  call: CallRecord;
  onPress?: (call: CallRecord) => void;
}

export default function CallCard({ call, onPress }: Props) {
  const borderColor = OUTCOME_COLORS[call.outcome] ?? colors.outcomeNoAnswer;
  const formattedDate = new Date(call.callDate).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: borderColor }]}
      onPress={() => onPress?.(call)}
      activeOpacity={0.75}
    >
      <Text style={styles.name}>{call.restaurant?.name ?? 'Unknown Restaurant'}</Text>
      <Text style={[styles.outcome, { color: borderColor }]}>{call.outcome}</Text>
      <Text style={styles.date}>{formattedDate}</Text>
      {call.notes ? <Text style={styles.notes}>{call.notes}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 10,
    borderLeftWidth: 4,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
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
});
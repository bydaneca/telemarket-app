import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import colors from '../../theme/colors';
import { CallOutcome, Restaurant } from '../../types/types';
import { getRestaurants } from '../../api/restaurantsApi';
import { createCall } from '../../api/callsApi';

const OUTCOMES: CallOutcome[] = [
    'Interested',
    'Not Interested',
    'No Answer',
    'Callback',
    'Closed',
];

const NEXT_ACTIONS = [
    'Send Proposal',
    'Call Back',
    'Email',
    'Visit',
    'Schedule Demo',
    'Demo',
    'N/A',
    'Others',
];

const OUTCOME_COLORS: Record<CallOutcome, string> = {
    'Interested': '#F5A623',
    'Not Interested': '#D0021B',
    'No Answer': '#9B9B9B',
    'Callback': '#4A90E2',
    'Closed': '#7ED321',
};

interface Props {
    visible: boolean;
    onClose: () => void;
    onCallAdded: () => void;
}

export default function AddCallModal({ visible, onClose, onCallAdded }: Props) {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOutcome, setSelectedOutcome] = useState<CallOutcome | null>(null);
    const [contactName, setContactName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [actions, setActions] = useState<string[]>([]);
    const [actionDate, setActionDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingRestaurants, setFetchingRestaurants] = useState(true);

    useEffect(() => {
        if (visible) loadRestaurants();
    }, [visible]);

    const loadRestaurants = async () => {
        try {
            const data = await getRestaurants();
            setRestaurants(data);
        } catch (e) {
            console.error('Failed to load restaurants:', e);
        } finally {
            setFetchingRestaurants(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedRestaurant || !selectedOutcome) return;
        setLoading(true);
        try {
            await createCall({
                restaurantId: selectedRestaurant.id,
                contactName,
                contactNumber,
                outcome: selectedOutcome,
                notes,
                actions: actions.join(', '),
                actionDate: actionDate ? new Date(actionDate).toISOString() : undefined,
                callDate: new Date().toISOString(),
            });
            onCallAdded();
            onClose();
            resetForm();
        } catch (e) {
            console.error('Failed to log call:', e);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedRestaurant(null);
        setSelectedOutcome(null);
        setDropdownOpen(false);
        setContactName('');
        setContactNumber('');
        setNotes('');
        setActions([]);
        setActionDate('');
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <Text style={styles.title}>Log a Call</Text>

                    {fetchingRestaurants ? (
                        <ActivityIndicator color={colors.orange} />
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false}>

                           {/* Restaurant Dropdown */}
                          <Text style={styles.label}>Restaurant</Text>
                          <View style={styles.dropdownWrapper}>
                              <TouchableOpacity
                                  style={styles.dropdown}
                                  onPress={() => setDropdownOpen(!dropdownOpen)}
                              >
                                  <Text style={selectedRestaurant ? styles.dropdownSelected : styles.dropdownPlaceholder}>
                                      {selectedRestaurant ? selectedRestaurant.name : 'Select a restaurant...'}
                                  </Text>
                                  <Text style={styles.dropdownArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
                              </TouchableOpacity>
                              {dropdownOpen && (
                                  <View style={styles.dropdownList}>
                                      {restaurants.map(r => (
                                          <TouchableOpacity
                                              key={r.id}
                                              style={[
                                                  styles.dropdownItem,
                                                  selectedRestaurant?.id === r.id && styles.dropdownItemSelected,
                                              ]}
                                              onPress={() => {
                                                  setSelectedRestaurant(r);
                                                  setDropdownOpen(false);
                                              }}
                                          >
                                              <Text style={[
                                                  styles.dropdownItemText,
                                                  selectedRestaurant?.id === r.id && styles.dropdownItemTextSelected,
                                              ]}>
                                                  {r.name}
                                              </Text>
                                          </TouchableOpacity>
                                      ))}
                                  </View>
                              )}
                          </View>

                            {/* Outcome Chips */}
                            <Text style={styles.label}>Outcome</Text>
                            <View style={styles.chipRow}>
                                {OUTCOMES.map(o => {
                                    const isSelected = selectedOutcome === o;
                                    const outcomeColor = OUTCOME_COLORS[o];
                                    return (
                                        <TouchableOpacity
                                            key={o}
                                            style={[
                                                styles.chip,
                                                { borderColor: outcomeColor },
                                                isSelected && { backgroundColor: outcomeColor },
                                            ]}
                                            onPress={() => setSelectedOutcome(o)}
                                        >
                                            <Text style={[
                                                styles.chipText,
                                                { color: isSelected ? '#FFFFFF' : outcomeColor },
                                            ]}>
                                                {o}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Inputs */}
                            <Text style={styles.label}>Contact Name</Text>
                            <TextInput
                                style={styles.input}
                                value={contactName}
                                onChangeText={setContactName}
                                placeholderTextColor="#AAAAAA"
                                placeholder="e.g. Maria Santos"
                            />

                            <Text style={styles.label}>Contact Number</Text>
                            <TextInput
                                style={styles.input}
                                value={contactNumber}
                                onChangeText={setContactNumber}
                                placeholderTextColor="#AAAAAA"
                                placeholder="e.g. 09XX-XXX-XXXX"
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.label}>Notes</Text>
                            <TextInput
                                style={[styles.input, styles.multiline]}
                                value={notes}
                                onChangeText={setNotes}
                                placeholderTextColor="#AAAAAA"
                                placeholder="What happened on the call?"
                                multiline
                            />

                           {/* Next Actions */}
                            <Text style={styles.label}>Next Actions</Text>
                            <View style={styles.chipRow}>
                                {NEXT_ACTIONS.map(a => {
                                    const isSelected = actions.includes(a);
                                    return (
                                        <TouchableOpacity
                                            key={a}
                                            style={[
                                                styles.chip,
                                                { borderColor: colors.teal },
                                                isSelected && { backgroundColor: colors.teal },
                                            ]}
                                            onPress={() => {
                                                setActions(prev =>
                                                    prev.includes(a)
                                                        ? prev.filter(x => x !== a)  // deselect
                                                        : [...prev, a]                // select
                                                );
                                            }}
                                        >
                                            <Text style={[
                                                styles.chipText,
                                                { color: isSelected ? '#FFFFFF' : colors.teal },
                                            ]}>
                                                {a}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <Text style={styles.label}>Action Date</Text>
                            <TextInput
                                style={styles.input}
                                value={actionDate}
                                onChangeText={setActionDate}
                                placeholderTextColor="#AAAAAA"
                                placeholder="e.g. 2026-04-10"
                                keyboardType="numeric"
                            />

                            <TouchableOpacity
                                style={[
                                    styles.submitBtn,
                                    (!selectedRestaurant || !selectedOutcome) && styles.submitDisabled,
                                ]}
                                onPress={handleSubmit}
                                disabled={!selectedRestaurant || !selectedOutcome || loading}
                            >
                                {loading
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={styles.submitText}>Log Call</Text>
                                }
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#F5F5F5',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        maxHeight: '92%',
    },
    title: {
        fontFamily: 'SpaceMono-Regular',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 20,
    },
    label: {
        fontFamily: 'SpaceMono-Regular',
        fontSize: 11,
        color: '#555555',
        marginBottom: 6,
        marginTop: 14,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Dropdown
    dropdown: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownPlaceholder: {
        fontFamily: 'SpaceMono-Regular',
        fontSize: 13,
        color: '#AAAAAA',
    },
    dropdownSelected: {
        fontFamily: 'SpaceMono-Regular',
        fontSize: 13,
        color: '#1A1A1A',
    },
    dropdownArrow: {
        fontSize: 10,
        color: '#555555',
    },
    dropdownWrapper: {
    position: 'relative',
    zIndex: 999,
},
dropdownList: {
    position: 'absolute',
    top: 46,        // just below the dropdown button
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 999,
    elevation: 5,   // Android shadow so it appears above other elements
},
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    dropdownItemSelected: {
        backgroundColor: '#FFF3E0',
    },
    dropdownItemText: {
        fontFamily: 'SpaceMono-Regular',
        fontSize: 13,
        color: '#1A1A1A',
    },
    dropdownItemTextSelected: {
        color: colors.orange,
        fontWeight: 'bold',
    },

    // Outcome chips
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    chipText: {
        fontFamily: 'SpaceMono-Regular',
        fontSize: 12,
    },

    // Inputs
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        padding: 12,
        fontFamily: 'SpaceMono-Regular',
        fontSize: 13,
        color: '#1A1A1A',
    },
    multiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },

    // Buttons
    submitBtn: {
        backgroundColor: colors.orange,
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        marginTop: 24,
    },
    submitDisabled: {
        opacity: 0.4,
    },
    submitText: {
        fontFamily: 'SpaceMono-Regular',
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 14,
    },
    cancelBtn: {
        alignItems: 'center',
        padding: 12,
        marginTop: 4,
        marginBottom: 8,
    },
    cancelText: {
        fontFamily: 'SpaceMono-Regular',
        color: '#888888',
        fontSize: 13,
    },
});
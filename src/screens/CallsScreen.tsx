import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity
 } from 'react-native';
 import { getCalls } from '../api/callsApi';
 import { CallRecord } from '../types/types';
 import CallCard from '../components/calls/CallCard';
import AddCallModal from '../components/calls/AddCallModal';
import colors from '../theme/colors';

const CallsScreen = () => {
    const [calls, setCalls] = useState<CallRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchCalls();
    }, []);

    const fetchCalls = async () => {
        try {
            const data = await getCalls();
            setCalls(data);
        } catch (error)  {
            console.error('Error fetching calls:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2F7F79" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={calls}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => 
                    <CallCard call={item} />
                }
                contentContainerStyle={{ paddingVertical: 8 }}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>No calls yet. Start dialing!</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            <AddCallModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCallAdded={fetchCalls}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1F1E',
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D1F1E',
    },
    card: {
        backgroundColor: '#1A2E2D',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#2F7F79',
    },
    restaurantName: {
        fontFamily: 'SpaceMono-Bold',
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    outcome: {
        fontFamily: 'SpaceMono-Regular',
        fontSize: 12,
        color: '#F57C00',
        marginBottom: 4,
    },
    date: {
        fontFamily: 'SpaceMono-Regular',
        fontSize: 11,
        color: '#888',
        marginBottom: 4,
    },
    notes: {
        fontFamily: 'SpaceMono-Regular',
        fontSize: 12,
        color: '#CCCCCC',
    },
    emptyText: {
        fontFamily: 'SpaceMono-Regular',
        fontSize: 14,
        color: '#888',
    },
    fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.orange,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabIcon: {
    fontSize: 28,
    color: colors.bgPrimary,
    lineHeight: 32,
  },
});;

export default CallsScreen;
export type CallOutcome =
  | 'Interested'
  | 'Not Interested'
  | 'No Answer'
  | 'Callback'
  | 'Closed';

export type Restaurant = {
    id: number;
    name: string;
    address: string;
    contactNumber: string;
    contactPerson: string;
    contactPersonRole: string;
    status: string;
    notes: string;
};

export type CallRecord = {
    id: number;
    restaurantId: number;
    restaurant?: Restaurant;
    contactName: string;
    contactNumber: string;
    outcome: CallOutcome;
    notes: string;
    actions: string;
    actionDate?: string;
    callDate: string;
};
export interface PropertyRequest {
    id: number;
    uuid: string;
    message_id?: string;
    group_name?: string;
    group_id?: string;
    requester_phone?: string;
    requester_name?: string;
    message_text: string;
    budget?: string;
    location?: string;
    city?: string;
    state?: string;
    house_type?: string;
    status: 'active' | 'fulfilled';
    source: 'whatsapp' | 'platform';
    expires_at: string;
    created_at: string;
    updated_at: string;
}

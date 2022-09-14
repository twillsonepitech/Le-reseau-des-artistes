export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: Date | null;
    created_at: string;
    updated_at: string;
    profile_photo_url: string
}
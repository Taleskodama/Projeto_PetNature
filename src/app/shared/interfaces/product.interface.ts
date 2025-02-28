export interface ProductInterface {
    brand: string;
    category: string;
    created_at: number; // Timestamp do Firestore é um número
    description: string;
    image: string;
    last_edition: {
        timestamp: number;
        user: string;
    };
    name: string;
    uid: string;
}

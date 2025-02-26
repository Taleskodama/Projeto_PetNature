export interface UserInterface {
    name: string;
    email: string;
    code: string;        // Código aleatório
    created_at: number;  // Timestamp da criação
    photo: string;       // URL da foto do usuário
    role: string;        // Papel do usuário (ex: 'Usuário' ou 'admin')
    uid: string;         // ID único do usuário no Firebase Authentication
}

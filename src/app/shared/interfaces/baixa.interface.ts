export interface BaixaInterface {
  id?: string;
  produto?: string;
  qtd: number;
  usuario?: string;  // 🔹 Adicionando o usuário responsável pela baixa
  created_at?: any;  // 🔹 Permitindo o uso do Timestamp do Firestore
}

import { Timestamp } from '@angular/fire/firestore';

export interface EstoqueInterface {
  id: string;
  name: string;
  produto: string; // ID do produto vinculado ao estoque
  qtd: number;
  lote: string;
  created_at: Timestamp | number; // 🔹 Aceita Firestore.Timestamp ou número
  imagemProduto?: string; // 🔹 Opcional, pois será carregado dinamicamente
  type?: string;
  brand?: string;
  last_edition?: {
    timestamp: Timestamp | number;
    user: string;
  }; // 🔹 Adicionado conforme Firestore
}

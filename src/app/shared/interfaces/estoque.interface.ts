import { Timestamp } from '@angular/fire/firestore';

export interface EstoqueInterface {
  id: string;
  name: string;
  produto: string; // ID do produto vinculado ao estoque
  qtd: number;
  lote: number;
  created_at: number; // 🔹 Aceita Firestore.Timestamp ou número
  imagemProduto?: string; // 🔹 Opcional, pois será carregado dinamicamente
  type?: string;
  brand?: string;
  image?: string;
  last_edition?: {
    timestamp:  number;
    user: string;
  }; // 🔹 Adicionado conforme Firestore
}

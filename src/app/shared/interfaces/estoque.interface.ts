export interface EstoqueInterface {
  id: string;
  name: string;
  produto: string; // ID do produto vinculado ao estoque
  qtd: number;
  lote: string; // Adicionado
  created_at: number; // Adicionado (timestamp do Firestore)
  imagemProduto?: string; // Opcional, pois será carregado dinamicamente
  type?: string; // Tipo do produto
  brand?: string; // Marca do produto
}

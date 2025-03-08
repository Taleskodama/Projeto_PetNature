import { Component, OnInit } from '@angular/core';
import { BaixaService } from '../../shared/services/baixa.service';
import { ProductService } from '../../shared/services/product.service';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { EstoqueService } from '../../shared/services/estoque.service';




@Component({
  selector: 'app-registro-baixas',
  templateUrl: './registro-baixas.component.html',
  styleUrls: ['./registro-baixas.component.scss']
})
export class RegistroBaixasComponent implements OnInit {
  baixas: any[] = [];
  baixasFiltradas: any[] = [];
  searchTerm: string = '';

  constructor(private baixaService: BaixaService, private produtoService: ProductService,private firestore: Firestore,private estoqueService: EstoqueService ) {}


  ngOnInit(): void {
    this.carregarBaixas(); // ✅ Agora está pegando da coleção "estoques"
  }
  

  async carregarBaixas() {
    this.estoqueService.getEstoques().subscribe(async (data) => {
      console.log("📥 Estoques carregados do Firestore:", data);
  
      this.baixas = await Promise.all(
        data.map(async (estoque) => {
          // 🔹 Buscar informações do produto para obter a imagem correta
          const produto = estoque.produto
            ? await this.produtoService.getProductById(estoque.produto)
            : null;
  
          // 🔹 Buscar informações do usuário para obter o e-mail correto
          const usuario = estoque.last_edition?.user
            ? await this.baixaService.getUserById(estoque.last_edition.user)
            : { email: "Não informado" };
  
          return {
            ...estoque,
            imagemProduto: produto?.image || 'assets/imgs/default.png', // ✅ Puxa imagem corretamente
            name: estoque.name || "Desconhecido",
            qtd: Number(estoque.qtd) || 0,
            usuario, // ✅ Agora exibe o email do usuário corretamente
            created_at: Number(estoque.created_at) || Date.now(), // ✅ Converte para número corretamente
          };
        })
      );
  
      console.log("📌 Baixas processadas:", this.baixas);
      this.baixasFiltradas = [...this.baixas]; // Atualiza a exibição
    });
  }
  
  
  
  


  
  
  
  
  
  filtrarBaixas() {
    this.baixasFiltradas = this.baixas.filter((baixa) =>
      baixa.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  

  async atualizarBaixa(baixa: any) {
    try {
      const baixaRef = doc(this.firestore, 'baixas', baixa.id);
      await setDoc(baixaRef, { qtd: baixa.qtd }, { merge: true });
  
      alert('Quantidade atualizada com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      alert('Erro ao atualizar quantidade.');
    }
  }
  async atualizarQuantidade(baixa: any) {
    try {
      const estoqueRef = doc(this.firestore, 'estoques', baixa.id);
      await setDoc(estoqueRef, { qtd: Number(baixa.qtd) }, { merge: true });
  
      console.log('✅ Quantidade atualizada no Firestore:', baixa.qtd);
      alert('Quantidade atualizada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar quantidade:', error);
      alert('Erro ao atualizar quantidade.');
    }
  }
  
  
  
}

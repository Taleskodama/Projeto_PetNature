import { Component, OnInit } from '@angular/core';
import { BaixaService } from '../../shared/services/baixa.service';
import { ProductService } from '../../shared/services/product.service';
import { Firestore, collection, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
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

  filtroUsuario: string = ''; // Filtro de usuário
  filtroData: string = ''; // Filtro de data
  mostrarFiltros: boolean = false; // Controla a exibição do dropdown

  constructor(private baixaService: BaixaService, private produtoService: ProductService,private firestore: Firestore,private estoqueService: EstoqueService ) {}


  ngOnInit(): void {
    this.carregarBaixas(); // ✅ Agora está pegando da coleção "estoques"
  }
  

  async carregarBaixas() {
    this.estoqueService.getEstoques().subscribe(async (data) => {
      console.log("📥 Estoques carregados do Firestore:", data);
  
      this.baixas = await Promise.all(
        data.map(async (estoque) => {
          let userCode = "Desconhecido"; // Valor padrão
  
          // 🔹 Se o campo last_edition.user existir, verificar se é um uid ou um code
          if (estoque.last_edition?.user) {
            if (estoque.last_edition.user.length <= 6) {
              // ✅ Se for um code, usá-lo diretamente
              userCode = estoque.last_edition.user;
            } else {
              // 🔍 Se for um uid, buscar o code no Firestore
              const usersRef = collection(this.firestore, "users");
              const q = query(usersRef, where("uid", "==", estoque.last_edition.user));
              const querySnapshot = await getDocs(q);
  
              if (!querySnapshot.empty) {
                userCode = querySnapshot.docs[0].data()['code']; // ✅ Obtém o code
              }
            }
          }
  
          return {
            ...estoque,
            imagemProduto: estoque.image && estoque.image !== '' ? estoque.image : 'assets/imgs/default.png',
            name: estoque.name || "Desconhecido",
            qtd: Number(estoque.qtd) || 0,
            usuario: userCode, // ✅ Agora exibe corretamente o code ou "Desconhecido"
            created_at: Number(estoque.created_at) || Date.now(),
          };
        })
      );
  
      console.log("📌 Baixas processadas:", this.baixas);
      this.baixasFiltradas = [...this.baixas];
    });
  }
  
  filtrarBaixas() {
    this.baixasFiltradas = this.baixas.filter((baixa) => {
      const nomeFiltrado = baixa.name.toLowerCase().includes(this.searchTerm.toLowerCase());
  
      // 🔹 Converter timestamp (número) para formato 'YYYY-MM-DD'
      const dataCadastro = new Date(baixa.created_at).toISOString().split('T')[0];
  
      const dataFiltrada = this.filtroData ? dataCadastro === this.filtroData : true;
      const usuarioFiltrado = this.filtroUsuario ? baixa.usuario === this.filtroUsuario : true;
  
      return nomeFiltrado && dataFiltrada && usuarioFiltrado;
    });
  }
  

  resetarFiltros() {
    this.filtroUsuario = '';
    this.filtroData = '';
    this.filtrarBaixas();
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
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
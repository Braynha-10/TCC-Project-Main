## 📋 Levantamento de Requisitos

### ✅ Requisitos Funcionais (RF)
- RF01: Cadastrar, editar e remover clientes.
- RF02: Cadastrar, editar e remover veículos associados aos clientes.
- RF03: Registrar ordens de serviço com detalhes como diagnóstico, peças utilizadas e mão de obra.
- RF04: Gerenciar estoque de peças, incluindo entrada e saída de produtos.
- RF05: Emitir orçamentos e faturas para os serviços realizados.
- RF06: Controlar o fluxo financeiro, registrando receitas e despesas.
- RF07: Gerenciar profissionais, incluindo cadastro, especialidades e disponibilidade.
- RF08: Gerar relatórios de serviços realizados, movimentações de estoque e fluxo financeiro.
- RF09: Autenticar usuários com diferentes níveis de acesso (administrador, mecânico, atendente).
- RF10: Permitir a busca e filtragem de informações por diversos critérios (cliente, veículo, data, etc.).

### 🚫 Requisitos Não Funcionais (RNF)
- RNF01 – Usabilidade: A interface do sistema deve ser intuitiva e de fácil navegação para os usuários.
- RNF02 – Segurança: As informações dos clientes e do sistema devem ser protegidas contra acessos não autorizados.
- RNF03 – Desempenho: O sistema deve responder às ações dos usuários em tempo razoável, sem atrasos perceptíveis.
- RNF04 – Compatibilidade: O sistema deve ser compatível com os principais navegadores web modernos.
- RNF05 – Manutenibilidade: O código do sistema deve ser estruturado de forma a facilitar futuras manutenções e atualizações.

## 🎯 Diagrama de Caso de Uso
+---------------------+
|     Gerente         |
+---------------------+
          |
          |-----------------------------+-----------------------------------
          |                             |                                  |
          v                             v                                  v
+---------------------+       +---------------------+          +-------------------------+
| Gerenciar Usuários  |       | Gerenciar Profissionais |      |    Gerenciar Financias   |
+---------------------+       +---------------------+          +--------------------------+
          |
          v
+---------------------+
|   Gerar Relatórios  |
+---------------------+

+---------------------+
|      Mecanico       |
+---------------------+
          |
          |-------------------------------------------------------------+
          |                             |                               |
          v                             v                               v
+---------------------+       +---------------------+       +---------------------+
|  CRUD Clientes |            |    CRUD Veículos    |       | Solicitar Serviços    |
+---------------------+       +---------------------+       +---------------------+
          |                             |                               |
          v                             v                               v
+---------------------+       +---------------------+       +---------------------+
| Verificar Serviços  |       |  Verificar Estoque  |       | Gerenciar Peças  |
+---------------------+       +---------------------+       +---------------------+

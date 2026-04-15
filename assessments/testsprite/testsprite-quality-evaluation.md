# TestSprite Assessment — API Test Coverage

Este assessment avalia a capacidade do TestSprite em cobrir contrato, regras de negócio e cenários de erro na geração de testes.

## Contexto

Este assessment utiliza a API Atelier Booking como sistema de referência.

A API permite:
- cadastrar workshops
- cadastrar participantes
- inscrever participantes em workshops
- cancelar inscrições

As inscrições possuem estados:
- `CONFIRMED`
- `WAITLIST`
- `CANCELLED`

Quando uma inscrição confirmada é cancelada, uma vaga é liberada e o próximo participante na fila de espera é automaticamente promovido.

Mais detalhes sobre o serviço:
[Atelier Booking API](./../../apps/atelier-booking/backend/README.md)

---

## Setup da TestSprite no VS Code

A configuração da TestSprite no VS Code pode ser feita seguindo a [documentação oficial](https://docs.testsprite.com/mcp/getting-started/installation#installation) e leva menos de 5 minutos.

---

## Condições do teste da ferramenta

Para a configuração inicial, foram fornecidos à TestSprite:
- a [especificação OpenAPI do projeto](../../apps/atelier-booking/backend/docs/openapi.yaml)
- acesso à [base de código do backend](../../apps/atelier-booking/backend/), para entendimento do domínio e das regras de negócio

Com o uso do [cloc](https://formulae.brew.sh/formula/cloc), foi identificado o seguinte volume no backend analisado:
- 31 arquivos TypeScript
- 512 linhas de código
- 110 linhas em branco

No total, isso representa aproximadamente **622 linhas analisadas**.

Nesse contexto, a ferramenta levou **23 minutos** para gerar os testes.

**Etapas observadas na geração dos testes:**
- **Bootstrapping**: inicialização do contexto do projeto.
- **Code scanning**: varredura do repositório.
- **Geração de artefatos intermediários**: criação da pasta [testsprite_tests/tmp](../../apps/atelier-booking/backend/testsprite_tests/tmp/), contendo os arquivos enviados à ferramenta — neste caso, a especificação OpenAPI — além do arquivo `code_summary.yaml` gerado.
- **Normalização do domínio**: correlação entre código e contrato.
- **Geração do test plan**: elaboração do plano de testes a partir dos insumos analisados.

---

## Avaliação de Cobertura — TestSprite vs OpenAPI + Regras de Negócio

> Avaliação exploratória baseada em uma execução pontual da ferramenta.

Dimensões usadas:
- **Impacto**: dano caso o cenário falhe
- **Probabilidade**: chance prática de falha ou regressão
- **Risco**: combinação de impacto × probabilidade
- **Prioridade de teste**: ordem operacional de execução/investigação

| ID | Endpoint | Cenário | Categoria de validação | Tipo de regra | Impacto | Probabilidade | Risco | Prioridade | Cobertura do agente | Evidência observada | Observação técnica |
|---|---|---|---|---|---|---|---|---|---|---|---|
| H01 | `GET /health` | Retornar `200` com `{ "status": "ok" }` | Disponibilidade | Contrato operacional | Médio | Alta | Alto | **P0** | ✅ Sim | Teste valida `200`, JSON e `status=ok` | Cobertura adequada para smoke e pós-deploy |
| P01 | `POST /api/participants` | Criar participante válido com `201` | Happy path | Contrato + persistência | Alto | Média | Alto | P1 | ✅ Sim | Teste valida `id`, `name`, `email`, `createdAt` | Boa cobertura do retorno principal |
| P02 | `POST /api/participants` | Rejeitar payload inválido com `400` | Validação de entrada | Contrato sintático | Alto | Alta | Alto | P1 | ⚠️ Parcial | Teste cobre ausência de `email` | Não cobre `name` curto, email inválido, body vazio, tipos inválidos |
| P03 | `POST /api/participants` | Rejeitar email duplicado com `409` | Regra de negócio | Unicidade | Alto | Média | Alto | P1 | ✅ Sim | Teste cria participante e repete email | Boa cobertura da regra de unicidade |
| W01 | `POST /api/workshops` | Criar workshop válido com `201` | Happy path | Contrato + persistência | Alto | Média | Alto | P1 | ✅ Sim | Teste valida `id`, `title`, `description`, `capacity`, `scheduledAt`, `createdAt` | Cobertura adequada do retorno principal |
| W02 | `POST /api/workshops` | Rejeitar payload inválido com `400` | Validação de entrada | Contrato sintático | Alto | Alta | Alto | P1 | ⚠️ Parcial | Teste cobre ausência de `scheduledAt` e data malformada | Não cobre `title` curto, `description` curta, `capacity` ausente, tipo inválido |
| W03 | `POST /api/workshops` | Rejeitar `capacity < 1` com `400` | Validação de entrada | Restrição de domínio declarada no schema | Alto | Média | Alto | P1 | ✅ Sim | Teste envia `capacity=0` e espera `400` | Boa cobertura de regra explicitamente modelada no schema |
| W04 | `POST /api/workshops` | Rejeitar violação de regra de negócio com `422` | Regra de negócio | Validação semântica | Alto | Média | Alto | P1 | ⚠️ Parcial | Teste infere conflito de agendamento e espera `422` | O OpenAPI prevê `422` genérico, mas não explicita qual regra semântica concreta dispara esse erro :contentReference[oaicite:1]{index=1} |
| W05 | `GET /api/workshops/{id}` | Retornar detalhes de workshop existente com `200` | Consulta | Contrato de leitura | Alto | Média | Alto | P1 | ✅ Sim | Teste valida dados básicos, `summary` e `enrollments` | Boa cobertura estrutural do schema de detalhe |
| W06 | `GET /api/workshops/{id}` | Retornar `404` para workshop inexistente | Integridade de recurso | Recurso não encontrado | Médio | Média | Médio | P2 | ✅ Sim | Teste usa id inexistente e espera `404` | Cobertura adequada |
| E01 | `POST /api/enrollments` | Criar inscrição válida com `201` | Happy path | Contrato + vínculo entre entidades | **Crítico** | Média | **Muito Alto** | **P1** | ✅ Sim | Teste cria participante, workshop e inscrição | Cobertura adequada do fluxo central |
| E02 | `POST /api/enrollments` | Retornar status `CONFIRMED` quando há vaga | Regra de negócio | Capacidade / alocação | **Crítico** | Média | **Muito Alto** | **P1** | ✅ Sim | Primeiro inscrito recebe `CONFIRMED` | Boa cobertura da regra de alocação inicial |
| E03 | `POST /api/enrollments` | Retornar status `WAITLIST` quando capacidade foi atingida | Regra de negócio | Fila de espera | **Crítico** | Média | **Muito Alto** | **P1** | ✅ Sim | Segundo inscrito recebe `WAITLIST` em workshop com capacidade 1 | Cobertura importante de comportamento semântico |
| E04 | `POST /api/enrollments` | Rejeitar payload inválido com `400` | Validação de entrada | Contrato sintático | Alto | Alta | Alto | P1 | ❌ Não | Não há teste específico | Gap relevante no endpoint central |
| E05 | `POST /api/enrollments` | Retornar `404` para `participantId` inexistente | Integridade referencial | Referência inválida | **Crítico** | Média | **Muito Alto** | **P1** | ❌ Não | Não há teste específico | Gap importante de integridade |
| E06 | `POST /api/enrollments` | Retornar `404` para `workshopId` inexistente | Integridade referencial | Referência inválida | **Crítico** | Média | **Muito Alto** | **P1** | ❌ Não | Não há teste específico | Gap importante de integridade |
| E07 | `POST /api/enrollments` | Rejeitar inscrição duplicada com `409` | Regra de negócio | Unicidade por participante+workshop | **Crítico** | Alta | **Muito Alto** | **P0** | ❌ Não | Não há teste específico | Gap crítico; esse já apareceu como defeito real no sistema |
| C01 | `PATCH /api/enrollments/{id}/cancel` | Cancelar inscrição existente com `200` | Mutação de estado | Transição explícita | **Crítico** | Média | **Muito Alto** | **P1** | ⚠️ Parcial | O cancelamento aparece apenas no cleanup | Cleanup não equivale a teste assertivo de contrato nem de regra |
| C02 | `PATCH /api/enrollments/{id}/cancel` | Retornar `404` para inscrição inexistente | Integridade de recurso | Recurso não encontrado | Alto | Média | Alto | P1 | ❌ Não | Não há teste específico | Gap contratual |
| C03 | `PATCH /api/enrollments/{id}/cancel` | Cancelar inscrição `CONFIRMED` deve liberar vaga | Regra de negócio | Capacidade dinâmica | **Crítico** | Média | **Muito Alto** | **P0** | ❌ Não | Não há teste específico | Gap central do domínio |
| C04 | `PATCH /api/enrollments/{id}/cancel` | Primeiro da `WAITLIST` deve ser promovido para `CONFIRMED` | Regra de negócio | Promoção automática | **Crítico** | Média | **Muito Alto** | **P0** | ❌ Não | Não há teste específico | Gap mais importante do fluxo de estado |
| C05 | `PATCH /api/enrollments/{id}/cancel` | `CANCELLED` deve ser estado terminal | Regra de negócio | Máquina de estados | Alto | Média | Alto | P1 | ❌ Não | Não há teste específico | Não há evidência de proteção contra cancelamento inválido repetido |
| G01 | `GET /api/workshops/{id}` | `summary.confirmed` deve refletir inscrições `CONFIRMED` | Consistência agregada | Invariante de leitura | **Crítico** | Média | **Muito Alto** | **P1** | ⚠️ Parcial | Teste valida estrutura de `summary`, não a correlação com estados reais | Valida forma, não consistência semântica |
| G02 | `GET /api/workshops/{id}` | `summary.waitlist` deve refletir inscrições `WAITLIST` | Consistência agregada | Invariante de leitura | **Crítico** | Média | **Muito Alto** | **P1** | ❌ Não | Não há teste comparando lista e resumo | Gap importante |
| G03 | `GET /api/workshops/{id}` | `summary.cancelled` deve refletir inscrições `CANCELLED` | Consistência agregada | Invariante de leitura | Alto | Média | Alto | P1 | ❌ Não | Não há teste específico | Gap relevante |
| G04 | `GET /api/workshops/{id}` | `confirmed_count <= capacity` deve sempre ser verdadeiro | Consistência agregada | Invariante de domínio | **Crítico** | Média | **Muito Alto** | **P0** | ❌ Não | Não há teste específico | Gap importante de segurança funcional |
| G05 | `GET /api/workshops/{id}` | Lista `enrollments` deve refletir o estado mais recente após mutações | Consistência agregada | Pós-mutação | **Crítico** | Média | **Muito Alto** | **P0** | ❌ Não | Não há teste de leitura após cancelamento/promoção | Gap forte em comportamento real do sistema |


### Cobertura consolidada por classe

| Classe | Total de cenários | Cobertos | Parciais | Não cobertos | Leitura |
|---|---:|---:|---:|---:|---|
| Contrato sintático / schema | 11 | 7 | 3 | 1 | Cobertura razoável |
| Integridade referencial | 4 | 1 | 0 | 3 | Cobertura baixa |
| Regras de negócio | 8 | 4 | 1 | 3 | Cobertura intermediária, mas incompleta nos pontos mais sensíveis |
| Consistência agregada | 5 | 0 | 1 | 4 | Cobertura muito baixa |

---

### Conclusão

O conjunto gerado pelo agente apresenta utilidade para:
- smoke
- happy path
- validações iniciais de contrato
- bootstrap de suíte de testes

No entanto, a cobertura permanece concentrada em:
- validação estrutural do contrato (schema e status codes)
- estrutura de resposta
- cenários positivos

As principais lacunas estão em áreas centrais do domínio:
- **regras de negócio**: cobertura incompleta de cenários e ausência de validação de regras críticas; em alguns casos, há inferência de comportamento não explicitado no domínio
- **integridade entre entidades**: ausência de validação consistente de referências inválidas
- **transições de estado**: falta de verificação das regras de evolução (`CONFIRMED → CANCELLED`, promoção de `WAITLIST`)
- **consistência agregada**: ausência de validação entre `summary` e o estado real das inscrições

> O agente cobre a superfície do contrato com alguma profundidade, mas não valida de forma consistente o comportamento semântico central do domínio.

---

### Próximos passos

Como próximos passos, ainda vale investigar:

- **Uso em CI/CD**: entender como a ferramenta se comporta em pipelines, incluindo tempo de execução, previsibilidade, estabilidade da geração e impacto no fluxo de entrega
- **Consumo de créditos**: validar de forma objetiva como o consumo é contabilizado. Neste teste, o plano disponível indicava 540 créditos e não houve redução aparente na interface inicial, o que exige confirmação para evitar interpretação incorreta do custo real de uso
- **Escopo de análise do código**: avaliar a diferença entre fornecer acesso à base completa e restringir a ferramenta ao contrato OpenAPI ou a partes específicas do repositório
- **Segurança da informação**: entender os riscos de expor a base integral do projeto, especialmente em cenários com segredos, dados sensíveis, regras proprietárias ou integrações internas
- **Estratégia para regressão**: verificar como a ferramenta se comporta quando o código evolui, diferenciando:
  - geração de testes com base na base completa
  - varredura apenas do código alterado
  - reutilização dos testes já gerados em fluxos regressivos
- **Incrementalidade**: entender se a ferramenta consegue trabalhar bem em mudanças pequenas, sem exigir nova análise completa do repositório a cada execução
- **Governança de artefatos**: avaliar como versionar, revisar e manter os testes gerados, evitando acúmulo de artefatos pouco confiáveis ou difíceis de sustentar
- **Privacidade e retenção**: confirmar quais arquivos são enviados, quais artefatos intermediários são gerados, por quanto tempo ficam disponíveis e como ocorre o tratamento desses dados
- **Critério de adoção**: definir em quais contextos a ferramenta faz sentido, por exemplo:
  - bootstrap inicial de suíte
  - apoio exploratório
  - geração inicial a partir de contrato
  - uso contínuo em pipelines
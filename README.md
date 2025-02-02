# Uso do banco de dados Firebase


## Resumo

Testes do novo sistema da Plena, usando banco de dados Firebase.  
O código foi inicialmente feito no Bolt. Consiste em uma sidebar e rotas para cadastrar funcionários, projetos, horas apontadas/ apontar horas, e calcular os custos.  

À época, achei bem fácil de fazer, sem maiores problemas para configurar o banco de dados, mas como o código foi feito na maior parte com o Bolt, parece não ter sido usado muitas vantagens do Remix (a maior parte do código está em UseEffect, e não vi funções de loader ou de action)

**Ao tentar usar o projeto em outro computador, deu erro de conexão com o Firebase. Esqueci quais configurações devem ser feitas no console e na aplicação para poder conectar **


## Descrição das rotas e arquivos acessórios

> * root.tsx: original do Remix, somente adicionando a importação do componente Sidebar;  
> * components/sidebar.tsx: barra lateral com links para outras rotas, usando useLocation e Link;  
> * lib/firebase.ts: contém a configuração para conexão com o banco de dados.  
Nota: o banco de dados firebase trabalha com projeto/Database, onde cada tabela é uma coleção, e dentro da coleção tem os documentos, e nos documentos tem os campos;
> * types/index.ts: contém as interfaces com os campos tudo certinho, pra não dar problema no TypeScript;  
  
> routes/  
>   * costs.tsx: chama o cliente do Firebase, repete as interfaces, e só tem função default.  
Usa UseEffect e as funções do Firebase pra popular os menus dropdown, e depois faz os cálculos sem usar nenhuma biblioteca;
>   * dashboard.tsx: parecido com o 'costs'; consulta o banco de dados e usa u UseEffect para poder atualizar os dados;  
>   * projects.tsx: parecido com os demais (por isso que eu achei fácil; todos são basicamente a mesma coisa, mudando as interfaces e os nomes dos elementos da consulta);  
>   * time-entry.tsx: idem, acrescentando a soma para fazer o resumo de horas por projeto e por funcionário  



## O que pode ser aproveitado:

Acho que nada, já que foi feito tudo aparentemente sem usar os benefícios do Remix.  
Daria pra aproveitar a ideia de usar o Firebase, já que é um banco online, e supondo a aplicação do webchat, que , já que deve ter acesso à Internet para os modelos LLM, não teria problema o banco de vetores ficar online também (evita precisar de um servidor chromadb rodando no docker)

## O que deve ser melhorado: 

Enxugar o código, usando bibliotecas apropriadas para as contas (como Lodash); 

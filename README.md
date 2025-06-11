# Neurostock no GitHub Codespaces

## Como rodar o projeto

1. Abra o Codespace.
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```sh
   npm run dev
   ```
4. Exponha a porta 5173 (clique em "Ports" e marque como Public).
5. Acesse o link gerado pelo Codespaces (ex: `https://<nome-do-codespace>-5173.app.github.dev`).

> O Codespaces já faz o proxy HTTPS automaticamente.

## Script de Inicialização

Opcionalmente, use o script abaixo para automatizar o setup:

```sh
#!/bin/bash
npm install
npm run dev
```

Salve como `start-codespace.sh` e execute:
```sh
chmod +x start-codespace.sh
./start-codespace.sh
```

## Dicas de depuração
- Verifique o terminal para mensagens de erro.
- Veja o console do navegador para erros de frontend.
- Certifique-se de que todos os arquivos e imports existem e estão corretos.
- O Vite e o React Router já estão configurados para funcionar no Codespaces.

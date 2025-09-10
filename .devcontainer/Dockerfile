# Imagem base com Ubuntu 24.04
FROM ubuntu:24.04

# Evita prompts interativos durante a construção da imagem
ENV DEBIAN_FRONTEND=noninteractive
# Define HOME para garantir consistência
ENV HOME=/root

# Instala dependências essenciais, Git e Zsh
# Corrigido: As barras invertidas devem estar no final da linha, sem espaços após.
RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y \
        curl \
        git \
        gnupg \
        zsh \
        bash \
    && rm -rf /var/lib/apt/lists/*

# Instala o Oh My Zsh de forma não interativa
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# =====================
# Instalação do NVM
# =====================
RUN mkdir -p $HOME/.nvm \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | PROFILE=$HOME/.zshrc bash

# =====================
# Instalação do Node.js via NVM (CORRIGIDO)
# =====================
RUN set -e; \
    NVM_DIR="$HOME/.nvm"; \
    echo "Verificando existência de NVM_DIR: $NVM_DIR"; \
    if [ ! -d "$NVM_DIR" ]; then \
        echo "ERRO: Diretório $NVM_DIR não encontrado!"; \
        exit 1; \
    fi; \
    NVM_SCRIPT="$NVM_DIR/nvm.sh"; \
    echo "Verificando existência de NVM_SCRIPT: $NVM_SCRIPT"; \
    if [ ! -f "$NVM_SCRIPT" ]; then \
        echo "ERRO: Arquivo $NVM_SCRIPT não encontrado!"; \
        exit 1; \
    fi; \
    bash -c "set -e; \
        echo 'Dentro do bash -c, carregando NVM...'; \
        source \"$NVM_SCRIPT\"; \
        echo 'Verificando se o comando nvm está disponível após source...'; \
        command -v nvm >/dev/null 2>&1 || { echo 'ERRO: Comando nvm não encontrado após source!'; exit 1; }; \
        echo 'Instalando a versão LTS mais recente do Node.js...'; \
        nvm install --lts; \
        echo 'Definindo o alias default para lts/*...'; \
        nvm alias default 'lts/*'; \
        echo 'Verificando as versões instaladas...'; \
        node --version; \
        npm --version; \
        echo 'Instalação do Node.js via NVM concluída com sucesso dentro do bash -c.'; \
    "; \
    echo "Comandos NVM concluídos na camada RUN.";

# Instala os plugins do Zsh para autocompletar e realce de sintaxe
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ${HOME}/.oh-my-zsh/custom/plugins/zsh-autosuggestions
RUN git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${HOME}/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting

# Instala o Starship
RUN curl -sS https://starship.rs/install.sh | sh -s -- --yes

# Configura o .zshrc para habilitar os plugins e o Starship
RUN echo '\n\
# Habilita os plugins do Oh My Zsh \n\
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)\n\
\n\
# Inicializa o prompt Starship \n\
eval "$(starship init zsh)"' >> $HOME/.zshrc

# Define o Zsh como o shell padrão para o usuário root
CMD ["zsh"]
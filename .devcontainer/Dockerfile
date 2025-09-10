# Imagem base com Ubuntu 24.04
FROM ubuntu:24.04

# Evita prompts interativos durante a construção da imagem
ENV DEBIAN_FRONTEND=noninteractive

# Instala dependências essenciais, Git e Zsh
# Removemos 'nodejs' e 'npm' do apt, pois o NVM os gerenciará
RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y \
    curl \
    git \
    gnupg \
    zsh \
    && rm -rf /var/lib/apt/lists/*

# Instala o Oh My Zsh de forma não interativa
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Instala o NVM
RUN mkdir -p ~/.nvm \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | PROFILE=~/.zshrc bash

# Instala a versão LTS mais recente do Node.js e a define como padrão
# Carrega o nvm.sh manualmente pois o shell da build é /bin/sh, não zsh
RUN . "$HOME/.nvm/nvm.sh" \
    && nvm install --lts \
    && nvm alias default "lts/*"

# Instala os plugins do Zsh para autocompletar e realce de sintaxe
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
RUN git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# Instala o Starship
RUN curl -sS https://starship.rs/install.sh | sh -s -- --yes

# Configura o .zshrc para habilitar os plugins e o Starship
# NOTA: O instalador do NVM já modificou o .zshrc. As linhas abaixo serão adicionadas após as do NVM.
RUN echo '\n\
# Habilita os plugins do Oh My Zsh \n\
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)\n\
\n\
# Carrega o Oh My Zsh \n\
source $ZSH/oh-my-zsh.sh\n\
\n\
# Inicializa o prompt Starship \n\
eval "$(starship init zsh)"' >> ~/.zshrc

# Define o Zsh como o shell padrão
CMD ["zsh"]
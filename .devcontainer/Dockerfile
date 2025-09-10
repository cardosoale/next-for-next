# Utilize uma imagem base (ex: ubuntu:24.04)
FROM ubuntu:24.04

# Instale dependências básicas, incluindo Zsh
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y curl git gnupg zsh bash && \
    rm -rf /var/lib/apt/lists/*

# Crie um .zshrc básico com os plugins e configurações desejadas *primeiro*
# Isso evita que o NVM o sobrescreva completamente
RUN cat << 'EOF' > /root/.zshrc
# Habilita plugins do Oh My Zsh (certifique-se de que os plugins estejam instalados)
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
  # Adicione outros plugins aqui se necessário
)

# Caminho para Oh My Zsh
export ZSH="/root/.oh-my-zsh"

# Tema do Oh My Zsh (você pode escolher outro)
ZSH_THEME="robbyrussell"

# ====================================================================
# A LINHA MAIS IMPORTANTE!
# Esta linha carrega o framework Oh My Zsh, que por sua vez
# carrega os plugins e o tema listados acima.
# ====================================================================
source $ZSH/oh-my-zsh.sh

# Configurações do Oh My Zsh
DISABLE_AUTO_UPDATE="true"
COMPLETION_WAITING_DOTS="true"

# Caminho para binários instalados localmente (por precaução)
export PATH=$PATH:/usr/local/bin

# A inicialização do Starship e do NVM serão adicionadas no final do arquivo
# por outros comandos RUN, garantindo a ordem correta de carregamento.
EOF

# Instale Oh My Zsh (não interativo)
# Use --keep-zshrc para garantir que o .zshrc criado acima não seja substituído
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended --keep-zshrc

# Instale plugins do Zsh (depois do Oh My Zsh, mas antes do NVM)
# Isso garante que os diretórios do OMZ já existam
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-/root/.oh-my-zsh/custom}/plugins/zsh-autosuggestions && \
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-/root/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# Adicione manualmente a inicialização do Starship ao .zshrc
# Fazemos isso aqui para garantir a ordem
RUN echo '' >> /root/.zshrc && \
    echo '# Inicialização do Starship (adicionada pelo Dockerfile)' >> /root/.zshrc && \
    echo 'eval "$(starship init zsh)"' >> /root/.zshrc

# Instale o NVM
# Isso baixa e executa o script de instalação do NVM.
# O script tentará adicionar as linhas de configuração ao .zshrc.
RUN mkdir -p /root/.nvm && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | PROFILE=/root/.zshrc bash

# (Opcional) Verificação/Adição explícita das linhas do NVM ao .zshrc (mantendo a sua lógica)
# Esta etapa pode ser redundante se o script do NVM funcionar corretamente,
# mas garante que as linhas estejam presentes no final.
RUN NVM_DIR="/root/.nvm"; \
    ZSHRC="/root/.zshrc"; \
    NVM_EXPORT="export NVM_DIR=\"$NVM_DIR\""; \
    NVM_SOURCE="[ -s \"$NVM_DIR/nvm.sh\" ] && \\. \"$NVM_DIR/nvm.sh\"  # This loads nvm"; \
    NVM_BASH_COMPLETION="[ -s \"$NVM_DIR/bash_completion\" ] && \\. \"$NVM_DIR/bash_completion\"  # This loads nvm bash_completion"; \
    # Verifica e adiciona a linha de exportação (no final)
    if ! grep -qF "$NVM_EXPORT" "$ZSHRC"; then \
        echo "Adicionando linha de export do NVM ao .zshrc"; \
        echo "" >> "$ZSHRC"; \
        echo "# Configuração do NVM (adicionada pelo Dockerfile)" >> "$ZSHRC"; \
        echo "$NVM_EXPORT" >> "$ZSHRC"; \
    fi; \
    # Verifica e adiciona a linha de source do nvm.sh (no final)
    if ! grep -qF "$NVM_SOURCE" "$ZSHRC"; then \
        echo "Adicionando linha de source do NVM ao .zshrc"; \
        echo "$NVM_SOURCE" >> "$ZSHRC"; \
    fi; \
    # Verifica e adiciona a linha de bash_completion (opcional, no final)
    if ! grep -qF "$NVM_BASH_COMPLETION" "$ZSHRC"; then \
        echo "Adicionando linha de bash_completion do NVM ao .zshrc"; \
        echo "$NVM_BASH_COMPLETION" >> "$ZSHRC"; \
    fi; \
    echo "Verificação/Adição das linhas do NVM ao .zshrc concluída."

# Instale o Starship
RUN curl -sS https://starship.rs/install.sh | sh -s -- --yes
# A inicialização do Starship já foi adicionada ao .zshrc anteriormente.

# Defina o shell padrão como zsh
SHELL ["/bin/zsh"]

# (Opcional) Defina o comando padrão para iniciar um shell zsh interativo.
CMD ["zsh"]
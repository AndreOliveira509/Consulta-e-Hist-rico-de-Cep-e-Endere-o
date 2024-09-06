// Função para buscar o endereço pelo CEP
async function buscarEndereco() {
    const cep = document.getElementById('cep').value.trim();

    // Verificar se o CEP é válido
    if (!/^\d{8}$/.test(cep)) {
        exibirMensagemErro('CEP inválido. Por favor, insira um CEP válido com 8 dígitos.');
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        const data = await response.json();
        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        preencherDados(data);
        adicionaHistorico(cep); // Corrigido
    } catch (error) {
        exibirMensagemErro(error.message);
    }
}

// Função para buscar o CEP pelo estado, cidade e logradouro
async function buscarCepPorEndereco() {
    const uf = document.getElementById('uf').value.trim().toUpperCase();
    const cidade = encodeURIComponent(document.getElementById('cidade').value.trim());
    const logradouro = encodeURIComponent(document.getElementById('logradouro').value.trim());

    if (!uf || !cidade || !logradouro) {
        exibirMensagemErro('Todos os campos são obrigatórios.');
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${uf}/${cidade}/${logradouro}/json/`);
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        const data = await response.json();
        if (!data.length) {
            throw new Error('Endereço não encontrado');
        }

        exibirCep(data[0].cep);
        adicionaHistorico(data[0].cep); // Corrigido
    } catch (error) {
        exibirMensagemErro(error.message);
    }
}

// Função para exibir o CEP encontrado
function exibirCep(cep) {
    const resultadoDiv = document.getElementById('cep-encontrado');
    resultadoDiv.value = cep;
    limparInputsEndereco();
    limparMensagemErro();
}

// Função para preencher os inputs com os dados retornados pela API
function preencherDados(data) {
    document.getElementById('cep-info').value = data.cep || '';
    document.getElementById('logradouro-info').value = data.logradouro || '';
    document.getElementById('bairro-info').value = data.bairro || '';
    document.getElementById('cidade-info').value = data.localidade || '';
    document.getElementById('uf-info').value = data.uf || '';
    limparMensagemErro();
}

// Função para limpar os campos de endereço após a pesquisa
function limparInputsEndereco() {
    document.getElementById('uf').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('logradouro').value = '';
}

// Função para limpar os campos de entrada e resultados
function limparCampos() {
    document.getElementById('cep').value = '';
    document.getElementById('cep-info').value = '';
    document.getElementById('logradouro-info').value = '';
    document.getElementById('bairro-info').value = '';
    document.getElementById('cidade-info').value = '';
    document.getElementById('uf-info').value = '';
    document.getElementById('cep-encontrado').value = '';
    limparMensagemErro();
}

// Função para exibir mensagem de erro
function exibirMensagemErro(mensagem) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `<p class="erro">${mensagem}</p>`;
}

// Função para limpar a mensagem de erro
function limparMensagemErro() {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';
}

// Função para adicionar CEP ao histórico
function adicionaHistorico(cep) {
    let hist = JSON.parse(localStorage.getItem('historicoCep')) || [];
    if (!hist.includes(cep)) {
        hist.push(cep);
        localStorage.setItem('historicoCep', JSON.stringify(hist));
        atualizaHistorico();
    }
}

// Atualiza a lista de históricos
function atualizaHistorico() {
    const histDiv = document.getElementById('historico');
    let hist = JSON.parse(localStorage.getItem('historicoCep')) || [];
    histDiv.innerHTML = '';
    hist.forEach(cep => {
        const btn = document.createElement('button');
        btn.innerText = cep;
        btn.onclick = () => buscaEnderecoPorCep(cep);
        histDiv.appendChild(btn);
    });

    // Adiciona botão para limpar histórico
    const limparBtn = document.createElement('button');
    limparBtn.innerText = 'Limpar Histórico';
    limparBtn.onclick = limparHistorico;
    histDiv.appendChild(limparBtn);
}

// Pesquisa endereço pelo CEP do histórico
async

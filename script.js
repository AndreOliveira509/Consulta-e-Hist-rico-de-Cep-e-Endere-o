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
        adicionarAoHistorico(cep); // Adiciona o CEP ao histórico
    } catch (error) {
        exibirMensagemErro(error.message);
    }
}

// Função para buscar o CEP pelo estado, cidade e logradouro
async function buscarCepPorEndereco() {
    const uf = document.getElementById('uf').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const logradouro = document.getElementById('logradouro').value.trim();

    // Verificar se UF, cidade e logradouro foram preenchidos corretamente
    if (uf.length === 0) {
        exibirMensagemErro('Por favor, selecione um estado (UF).');
        return;
    }

    if (cidade.length === 0) {
        exibirMensagemErro('Por favor, insira uma cidade.');
        return;
    }

    if (logradouro.length === 0) {
        exibirMensagemErro('Por favor, insira um logradouro.');
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${uf}/${cidade}/${logradouro}/json/`);
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        const data = await response.json();
        if (data.length === 0) {
            throw new Error('Endereço não encontrado');
        }

        exibirCep(data[0].cep); // Exibe o primeiro CEP encontrado
        adicionarAoHistorico(data[0].cep); // Adiciona o CEP ao histórico
    } catch (error) {
        exibirMensagemErro(error.message);
    }
}

// Função para exibir o CEP encontrado
function exibirCep(cep) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerText = `CEP encontrado: ${cep}`;
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
    document.getElementById('resultado').innerHTML = '';
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

// Função para adicionar um CEP ao histórico de pesquisas
function adicionarAoHistorico(cep) {
    let historico = JSON.parse(localStorage.getItem('historicoCep')) || [];
    
    // Evita duplicatas
    if (!historico.includes(cep)) {
        historico.push(cep);
        localStorage.setItem('historicoCep', JSON.stringify(historico));
        atualizarHistorico();
    }
}

// Função para atualizar a exibição do histórico de pesquisas
function atualizarHistorico() {
    const historicoDiv = document.getElementById('historico');
    let historico = JSON.parse(localStorage.getItem('historicoCep')) || [];
    
    historicoDiv.innerHTML = '<h2>Histórico de Pesquisas</h2>';
    historico.forEach(cep => {
        const button = document.createElement('button');
        button.innerText = cep;
        button.onclick = () => buscarEnderecoPorCep(cep);
        historicoDiv.appendChild(button);
    });
}

// Função para buscar o endereço com base no CEP do histórico
async function buscarEnderecoPorCep(cep) {
    document.getElementById('cep').value = cep;
    await buscarEndereco();
}

// Inicializa o histórico quando a página carrega
window.onload = atualizarHistorico;

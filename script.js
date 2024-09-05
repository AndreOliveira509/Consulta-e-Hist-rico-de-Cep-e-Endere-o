// Função para buscar o endereço pelo CEP
function buscarEndereco() {
    const cep = document.getElementById('cep').value;
    
    if (cep.length !== 8 || isNaN(cep)) {
        alert('Por favor, insira um CEP válido com 8 dígitos.');
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert('CEP não encontrado.');
            } else {
                document.getElementById('cep-info').value = data.cep;
                document.getElementById('logradouro-info').value = data.logradouro;
                document.getElementById('bairro-info').value = data.bairro;
                document.getElementById('cidade-info').value = data.localidade;
                document.getElementById('uf-info').value = data.uf;
            }
        })
        .catch(error => console.error('Erro:', error));
}

// Função para buscar o CEP pelo endereço
function buscarCepPorEndereco() {
    const estado = document.getElementById('estado').value;
    const cidade = document.getElementById('cidade').value;
    const logradouro = document.getElementById('logradouro').value;

    if (!estado || !cidade || !logradouro) {
        alert('Por favor, preencha todos os campos para buscar o CEP.');
        return;
    }

    fetch(`https://viacep.com.br/ws/${estado}/${cidade}/${logradouro}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert('Endereço não encontrado.');
            } else {
                document.getElementById('cep3').value = data[0].cep;
            }
        })
        .catch(error => console.error('Erro:', error));
}

// Função para limpar todos os campos
function limparCampos() {
    document.getElementById('cep').value = '';
    document.getElementById('cep-info').value = '';
    document.getElementById('logradouro-info').value = '';
    document.getElementById('bairro-info').value = '';
    document.getElementById('cidade-info').value = '';
    document.getElementById('uf-info').value = '';
    document.getElementById('cep3').value = '';
}

// Função para adicionar um CEP ao histórico
function adicionarAoHistorico() {
    const cep = document.getElementById('cep-info').value;
    if (cep) {
        const historicoDiv = document.getElementById('historico');
        const button = document.createElement('button');
        button.textContent = cep;
        button.onclick = () => buscarEnderecoPorHistorico(cep);
        historicoDiv.appendChild(button);
    }
}

// Função para buscar endereço a partir de um CEP no histórico
function buscarEnderecoPorHistorico(cep) {
    document.getElementById('cep').value = cep;
    buscarEndereco();
}

async function buscarEndereco() {
    const cep = document.getElementById('cep').value.trim();

    if (cep.length !== 8 || isNaN(cep)) {
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

        exibirEndereco(data);
    } catch (error) {
        exibirMensagemErro(error.message);
    }
}

function exibirEndereco(data) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <h2>Endereço Encontrado:</h2>
        <p><strong>Logradouro:</strong> ${data.logradouro}</p>
        <p><strong>Bairro:</strong> ${data.bairro}</p>
        <p><strong>Cidade:</strong> ${data.localidade}</p>
        <p><strong>Estado:</strong> ${data.uf}</p>
    `;
}

function exibirMensagemErro(mensagem) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `<p class="erro">${mensagem}</p>`;
}

const API_URL = 'http://localhost:3000';

let editandoMorador = false;
let editandoVeiculo = false;

async function carregarMoradores() {
    try {
        const response = await fetch(`${API_URL}/moradores`);
        const moradores = await response.json();

        const selectMorador = document.getElementById('morador');
        selectMorador.innerHTML = '<option value="">Selecione um morador</option>';

        moradores.forEach((morador) => {
            const option = document.createElement('option');
            option.value = morador.id;
            option.textContent = morador.nome;
            selectMorador.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar moradores:', error);
    }
}

async function carregarMoradoresGrade() {
    try {
        const response = await fetch(`${API_URL}/moradores`);
        const moradores = await response.json();

        const gradeMoradores = document.getElementById('gradeMoradores');
        gradeMoradores.innerHTML = '';

        moradores.forEach(morador => {
            const moradorElement = document.createElement('div');
            moradorElement.className = 'cartao-morador';
            moradorElement.innerHTML = `
                <div class="nome">${morador.nome}</div>
                <div class="bloco">Bloco: ${morador.bloco}</div>
                <div class="apartamento">Apartamento: ${morador.apartamento}</div>
                <div class="telefone">Telefone: ${morador.telefone}</div>
                <div class="email">Email: ${morador.email}</div>
                <div class="status">Status: ${morador.status}</div>
                <button onclick="editarMorador(${morador.id})" class="botao-editar">Editar</button>
                <button onclick="excluirMorador(${morador.id})" class="botao-excluir">Excluir</button>
            `;
            gradeMoradores.appendChild(moradorElement);
        });
    } catch (error) {
        console.error('Erro ao carregar moradores:', error);
    }
}

async function carregarVeiculos() {
    try {
        const response = await fetch(`${API_URL}/veiculos`);
        const veiculos = await response.json();

        const gradeVeiculos = document.getElementById('gradeVeiculos');
        gradeVeiculos.innerHTML = '';

        veiculos.forEach(veiculo => {
            const veiculoElement = document.createElement('div');
            veiculoElement.className = 'cartao-veiculo';
            veiculoElement.innerHTML = `
                <div class="placa">Placa: ${veiculo.placa}</div>
                <div class="modelo">Modelo: ${veiculo.modelo}</div>
                <div class="cor">Cor: ${veiculo.cor}</div>
                <div class="box">Box: ${veiculo.box}</div>
                <div class="dono">Morador ID: ${veiculo.morador_id}</div>
                <button onclick="editarVeiculo(${veiculo.id})" class="botao-editar">Editar</button>
                <button onclick="excluirVeiculo(${veiculo.id})" class="botao-excluir">Excluir</button>
            `;
            gradeVeiculos.appendChild(veiculoElement);
        });
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
    }
}

async function editarMorador(id) {
    try {
        console.log(`Tentando buscar morador com ID: ${id}`);
        const response = await fetch(`${API_URL}/moradores/${id}`);

        console.log('Status da resposta:', response.status);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const morador = await response.json();
        console.log('Dados do morador:', morador);

        if (!morador || morador.error) {
            throw new Error(morador.error || 'Morador não encontrado');
        }

        document.getElementById('moradorId').value = morador.id;
        document.getElementById('nomeCompleto').value = morador.nome;
        document.getElementById('bloco').value = morador.bloco;
        document.getElementById('apartamento').value = morador.apartamento;
        document.getElementById('telefone').value = morador.telefone;
        document.getElementById('email').value = morador.email;
        document.getElementById('status').value = morador.status;
        document.getElementById('botaoMorador').textContent = 'Atualizar Morador';
        document.getElementById('cancelarEdicaoMorador').style.display = 'block';
        editandoMorador = true;

        document.querySelector('#formularioMorador').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Erro detalhado:', error);
        alert(`Falha ao carregar morador: ${error.message}\nVerifique o console para mais detalhes.`);
    }
}

async function editarVeiculo(id) {
    try {
        const response = await fetch(`${API_URL}/veiculos/${id}`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const veiculo = await response.json();

        if (!veiculo || veiculo.error) {
            throw new Error(veiculo.error || 'Veículo não encontrado');
        }

        document.getElementById('veiculoId').value = veiculo.id;
        document.getElementById('placa').value = veiculo.placa || '';
        document.getElementById('modelo').value = veiculo.modelo || '';
        document.getElementById('cor').value = veiculo.cor || '';
        document.getElementById('morador').value = veiculo.morador_id || '';
        document.getElementById('numeroVaga').value = veiculo.box || '';

        const botaoVeiculo = document.getElementById('botaoVeiculo');
        if (botaoVeiculo) {
            botaoVeiculo.textContent = 'Atualizar Veículo';
        }

        const cancelarBtn = document.getElementById('cancelarEdicaoVeiculo');
        if (cancelarBtn) {
            cancelarBtn.style.display = 'block';
        }

        editandoVeiculo = true;

        const formulario = document.querySelector('#formularioVeiculo');
        if (formulario) {
            formulario.scrollIntoView({ behavior: 'smooth' });
        }

    } catch (error) {
        console.error('Erro detalhado ao carregar veículo:', error);
        alert(`Erro ao carregar veículo para edição: ${error.message}`);
    }
}

function cancelarEdicaoMorador() {
    document.getElementById('formularioMorador').reset();
    document.getElementById('moradorId').value = '';
    document.getElementById('botaoMorador').textContent = 'Cadastrar Morador';
    document.getElementById('cancelarEdicaoMorador').style.display = 'none';
    editandoMorador = false;
}

function cancelarEdicaoVeiculo() {
    document.getElementById('formularioVeiculo').reset();
    document.getElementById('veiculoId').value = '';
    document.getElementById('botaoVeiculo').textContent = 'Cadastrar Veículo';
    document.getElementById('cancelarEdicaoVeiculo').style.display = 'none';
    editandoVeiculo = false;
}

async function excluirMorador(id) {
    if (confirm('Tem certeza que deseja excluir este morador?')) {
        try {
            const response = await fetch(`${API_URL}/moradores/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Morador excluído com sucesso!');
                carregarMoradores();
                carregarMoradoresGrade();
                carregarVeiculos();
            } else {
                const error = await response.json();
                alert(`Erro ao excluir morador: ${error.error}`);
            }
        } catch (error) {
            console.error('Erro ao excluir morador:', error);
            alert('Erro ao excluir morador. Verifique o console para mais detalhes.');
        }
    }
}

async function excluirVeiculo(id) {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
        try {
            const response = await fetch(`${API_URL}/veiculos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Veículo excluído com sucesso!');
                carregarVeiculos();
            } else {
                const error = await response.json();
                alert(`Erro ao excluir veículo: ${error.error}`);
            }
        } catch (error) {
            console.error('Erro ao excluir veículo:', error);
            alert('Erro ao excluir veículo. Verifique o console para mais detalhes.');
        }
    }
}

async function cadastrarMorador(event) {
    event.preventDefault();

    const morador = {
        nome: document.getElementById('nomeCompleto').value,
        bloco: document.getElementById('bloco').value,
        apartamento: document.getElementById('apartamento').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        status: document.getElementById('status').value,
    };

    const moradorId = document.getElementById('moradorId').value;

    try {
        let response;
        if (editandoMorador && moradorId) {
            response = await fetch(`${API_URL}/moradores/${moradorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(morador),
            });
        } else {
            response = await fetch(`${API_URL}/moradores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(morador),
            });
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro desconhecido');
        }

        alert(editandoMorador ? 'Morador atualizado com sucesso!' : 'Morador cadastrado com sucesso!');
        document.getElementById('formularioMorador').reset();
        cancelarEdicaoMorador();
        carregarMoradores();
        carregarMoradoresGrade();

    } catch (error) {
        console.error('Erro completo:', error);
        alert(`Falha no cadastro: ${error.message}`);
    }
}

async function cadastrarVeiculo(event) {
    event.preventDefault();

    const veiculo = {
        placa: document.getElementById('placa').value,
        modelo: document.getElementById('modelo').value,
        cor: document.getElementById('cor').value,
        morador_id: document.getElementById('morador').value,
        box: document.getElementById('numeroVaga').value,
    };

    const veiculoId = document.getElementById('veiculoId').value;

    try {
        let response;
        if (editandoVeiculo && veiculoId) {
            response = await fetch(`${API_URL}/veiculos/${veiculoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(veiculo),
            });
        } else {
            response = await fetch(`${API_URL}/veiculos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(veiculo),
            });
        }

        if (response.ok) {
            alert(editandoVeiculo ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!');
            document.getElementById('formularioVeiculo').reset();
            cancelarEdicaoVeiculo();
            carregarVeiculos();
        } else {
            const error = await response.json();
            alert(`Erro ao cadastrar veículo: ${error.error}`);
        }
    } catch (error) {
        console.error('Erro ao cadastrar veículo:', error);
        alert('Erro ao cadastrar veículo. Verifique o console para mais detalhes.');
    }
}

document.getElementById('formularioMorador').addEventListener('submit', cadastrarMorador);
document.getElementById('formularioVeiculo').addEventListener('submit', cadastrarVeiculo);
document.getElementById('cancelarEdicaoMorador').addEventListener('click', cancelarEdicaoMorador);
document.getElementById('cancelarEdicaoVeiculo').addEventListener('click', cancelarEdicaoVeiculo);

document.addEventListener('DOMContentLoaded', () => {
    carregarMoradores();
    carregarMoradoresGrade();
    carregarVeiculos();
});
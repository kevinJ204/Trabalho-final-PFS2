const API_BASE_URL = "https://localhost:4000";

class VagaServico {
    async obterVagas() {
        try {
            const response = await fetch(`${API_BASE_URL}/vagas`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar vagas: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter vagas:", error);
            return [];
        }
    }

    async obterVagaPorIdOuCargo(termo) {
        try {
            const response = await fetch(`${API_BASE_URL}/vagas/${termo}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar vaga: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter vaga por ID ou Cidade:", error);
            return null;
        }
    }

    async adicionarVaga(vaga) {
        try {
            const response = await fetch(`${API_BASE_URL}/vagas`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(vaga)
            });
            if (!response.ok) {
                throw new Error(`Erro ao adicionar vaga: ${response.statusText}`);
            }
            const novaVaga = await response.json();
            return novaVaga;
        } catch (error) {
            console.error("Erro ao adicionar vaga:", error);
            return null;
        }
    }

    async atualizarVaga(id, vaga) {
        try {
            const response = await fetch(`${API_BASE_URL}/vagas/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(vaga)
            });
            if (!response.ok) {
                throw new Error(`Erro ao atualizar vaga: ${response.statusText}`);
            }
            const vagaAtualizada = await response.json();
            return vagaAtualizada;
        } catch (error) {
            console.error("Erro ao atualizar vaga:", error);
            return null;
        }
    }

    async deletarVaga(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/vagas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao deletar vaga: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Erro ao deletar vaga:", error);
        }
    }
}

export default VagaServico;

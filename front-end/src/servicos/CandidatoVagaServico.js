const API_BASE_URL = "https://localhost:4000";

class CandidatoVagaServico {
    async obterInscricoes() {
        try {
            const response = await fetch(`${API_BASE_URL}/inscricoes`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar inscrições: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter inscrições:", error);
            return [];
        }
    }

    async obterInscricaoPorCandidatoOuVaga(termo) {
        try {
            const response = await fetch(`${API_BASE_URL}/inscricoes/${termo}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar inscrição: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter inscrição por candidato ou vaga:", error);
            return null;
        }
    }

    async adicionarInscricao(inscricao) {
        try {
            const response = await fetch(`${API_BASE_URL}/inscricoes`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(inscricao)
            });
            if (!response.ok) {
                throw new Error(`Erro ao adicionar inscrição: ${response.statusText}`);
            }
            const novaInscricao = await response.json();
            return novaInscricao;
        } catch (error) {
            console.error("Erro ao adicionar inscrição:", error);
            return null;
        }
    }

    async atualizarInscricao(id, inscricao) {
        try {
            const response = await fetch(`${API_BASE_URL}/inscricoes/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(inscricao)
            });
            if (!response.ok) {
                throw new Error(`Erro ao atualizar inscrição: ${response.statusText}`);
            }
            const inscricaoAtualizada = await response.json();
            return inscricaoAtualizada;
        } catch (error) {
            console.error("Erro ao atualizar inscrição:", error);
            return null;
        }
    }

    async deletarInscricao(cpf, codigo) {
        try {
            const response = await fetch(`${API_BASE_URL}/inscricoes/${cpf}/${codigo}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao deletar inscrição: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Erro ao deletar inscrição:", error);
        }
    }
}

export default CandidatoVagaServico;

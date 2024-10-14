const API_BASE_URL = "https://localhost:4000";

class CandidatoServico {
    async obterCandidatos() {
        try {
            const response = await fetch(`${API_BASE_URL}/candidatos`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar candidatos: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter candidatos:", error);
            return [];
        }
    }

    async obterCandidatoPorIdOuNome(termo) {
        try {
            const response = await fetch(`${API_BASE_URL}/candidatos/${termo}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar candidato: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter candidato por ID ou Nome:", error);
            return null;
        }
    }

    async adicionarCandidato(candidato) {
        try {
            const response = await fetch(`${API_BASE_URL}/candidatos`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(candidato)
            });
            if (!response.ok) {
                throw new Error(`Erro ao adicionar candidato: ${response.statusText}`);
            }
            const novoCandidato = await response.json();
            return novoCandidato;
        } catch (error) {
            console.error("Erro ao adicionar candidato:", error);
            return null;
        }
    }

    async atualizarCandidato(id, candidato) {
        try {
            const response = await fetch(`${API_BASE_URL}/candidatos/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(candidato)
            });
            if (!response.ok) {
                throw new Error(`Erro ao atualizar candidato: ${response.statusText}`);
            }
            const candidatoAtualizado = await response.json();
            return candidatoAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar candidato:", error);
            return null;
        }
    }

    async deletarCandidato(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/candidatos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao deletar candidato: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Erro ao deletar candidato:", error);
        }
    }
}

export default CandidatoServico;

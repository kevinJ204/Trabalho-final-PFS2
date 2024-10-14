import CandidatoVaga from "../Modelo/CandidatoVaga.js";

export default class CandidatoVagaCtrl {

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
    
        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const { cpfCandidato, codigoVaga, dataInscricao, horarioInscricao, status } = requisicao.body;
    
            if (cpfCandidato && codigoVaga && dataInscricao && horarioInscricao && status) {
                const candidatoVaga = new CandidatoVaga(dataInscricao, horarioInscricao, cpfCandidato, codigoVaga, status);
    
                try {
                    const inscricoesExistentes = await candidatoVaga.consultar({ cpfCandidato, codigoVaga });
                    
                    if (inscricoesExistentes.length > 0) {
                        return resposta.status(400).json({
                            "status": false,
                            "mensagem": "O candidato já está inscrito nesta vaga."
                        });
                    }
    
                    await candidatoVaga.gravar();
                    resposta.status(201).json({
                        "status": true,
                        "mensagem": "Inscrição de candidato na vaga gravada com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível armazenar a inscrição do candidato na vaga! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados da inscrição do candidato na vaga, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método POST e dados no formato JSON para gravar uma inscrição de candidato na vaga!"
            });
        }
    }
    
    async atualizar(requisicao, resposta) {
        resposta.type('application/json');

        if ((requisicao.method === "PATCH" || requisicao.method === "PUT") && requisicao.is('application/json')) {
            const { cpfCandidato, codigoVaga, status, dataInscricao, horarioInscricao } = requisicao.body;
            const { id } = requisicao.params;

            if (id && id > 0 && cpfCandidato && codigoVaga && status && dataInscricao && horarioInscricao) {
                const candidatoVaga = new CandidatoVaga(dataInscricao, horarioInscricao, cpfCandidato, codigoVaga, status);
                candidatoVaga.setId(id);
                try {
                    await candidatoVaga.atualizar();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Inscrição de candidato na vaga atualizada com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível atualizar a inscrição do candidato na vaga! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados da inscrição do candidato na vaga, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método PATCH ou PUT e dados no formato JSON para atualizar uma inscrição de candidato na vaga!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
    
        if (requisicao.method === "DELETE") {
            const { cpf, codigo } = requisicao.params;
    
            if (cpf && codigo) {
                const candidatoVaga = new CandidatoVaga(new Date(), new Date(), cpf, codigo, "inscrito");
                
                try {
                    await candidatoVaga.excluir();
                    
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Inscrição de candidato na vaga excluída com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível excluir a inscrição do candidato na vaga! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o CPF do candidato e o código da vaga que deseja excluir, conforme documentação da API."
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método DELETE para excluir uma inscrição de candidato na vaga!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "GET") {
            const { termo } = requisicao.params;
            const candidatoVaga = new CandidatoVaga();

            try {
                const inscricoes = await candidatoVaga.consultar(termo);
                resposta.status(200).json(inscricoes);
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Não foi possível consultar as inscrições de candidatos nas vagas! " + erro.message
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método GET para consultar as inscrições de candidatos nas vagas!"
            });
        }
    }
}

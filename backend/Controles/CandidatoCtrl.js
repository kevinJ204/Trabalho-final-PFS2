import Candidato from "../Modelo/Candidato.js";

export default class CandidatoCtrl {

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
    
        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            let { nome, cpf, dataDeNascimento, cep, telefone, email, grauDeInstrucao, curso } = requisicao.body;
    
            if (nome && cpf && dataDeNascimento && cep && telefone && email && grauDeInstrucao && curso) {
                dataDeNascimento = dataDeNascimento.split('/').reverse().join('-');
    
                const candidato = new Candidato(0, nome, cpf, dataDeNascimento, cep, telefone, email, grauDeInstrucao, curso);
                try {
                    await candidato.gravar();
                    resposta.status(201).json({
                        "status": true,
                        "mensagem": "Candidato gravado com sucesso!",
                        "id_candidato": candidato.getId()
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível armazenar o candidato! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do candidato, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método POST e dados no formato JSON para gravar um candidato!"
            });
        }
    }
    
    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
    
        if ((requisicao.method === "PATCH" || requisicao.method === "PUT") && requisicao.is('application/json')) {
            let { nome, cpf, dataDeNascimento, cep, telefone, email, grauDeInstrucao, curso } = requisicao.body;
            const { id } = requisicao.params;
    
            if (id && id > 0 && nome && cpf && dataDeNascimento && cep && telefone && email && grauDeInstrucao && curso) {
                dataDeNascimento = dataDeNascimento.split('/').reverse().join('-');
    
                const candidato = new Candidato(id, nome, cpf, dataDeNascimento, cep, telefone, email, grauDeInstrucao, curso);
                try {
                    await candidato.atualizar();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Candidato atualizado com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível atualizar o candidato! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do candidato, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método PATCH ou PUT e dados no formato JSON para atualizar um candidato!"
            });
        }
    }
    
    async excluir(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "DELETE") {
            const { id } = requisicao.params;

            if (id && id > 0) {
                const candidato = new Candidato(id);
                try {
                    await candidato.excluir();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Candidato excluído com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível excluir o candidato! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o ID do candidato que deseja excluir, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método DELETE para excluir um candidato!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "GET") {
            const { termo } = requisicao.params;
            const candidato = new Candidato(0);

            try {
                const candidatos = await candidato.consultar(termo);
                resposta.status(200).json(candidatos);
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Não foi possível consultar os candidatos! " + erro.message
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método GET para consultar os candidatos!"
            });
        }
    }
}

import Vaga from "../Modelo/Vaga.js";

export default class VagaCtrl {

    async gravar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const { cargo, salario, cidade, horasSemanais } = requisicao.body;

            if (cargo && salario && cidade && horasSemanais) {
                const vaga = new Vaga(0, cargo, salario, cidade, horasSemanais);
                try {
                    await vaga.gravar();
                    resposta.status(201).json({
                        "status": true,
                        "mensagem": "Vaga gravada com sucesso!",
                        "id_vaga": vaga.getCodigo()
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível armazenar a vaga! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados da vaga, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método POST e dados no formato JSON para gravar uma vaga!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');

        if ((requisicao.method === "PATCH" || requisicao.method === "PUT") && requisicao.is('application/json')) {
            const { cargo, salario, cidade, horasSemanais } = requisicao.body;
            const { codigo } = requisicao.params;

            if (codigo && codigo > 0 && cargo && salario && cidade && horasSemanais) {
                const vaga = new Vaga(codigo, cargo, salario, cidade, horasSemanais);
                try {
                    await vaga.atualizar();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Vaga atualizada com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível atualizar a vaga! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados da vaga, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método PATCH ou PUT e dados no formato JSON para atualizar uma vaga!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "DELETE") {
            const { codigo } = requisicao.params;

            if (codigo && codigo > 0) {
                const vaga = new Vaga(codigo);
                try {
                    await vaga.excluir();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Vaga excluída com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível excluir a vaga! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código da vaga que deseja excluir, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método DELETE para excluir uma vaga!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "GET") {
            const { termo } = requisicao.params;
            const vaga = new Vaga(0);

            try {
                const vagas = await vaga.consultar(termo);
                resposta.status(200).json(vagas);
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Não foi possível consultar as vagas! " + erro.message
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método GET para consultar as vagas!"
            });
        }
    }
}

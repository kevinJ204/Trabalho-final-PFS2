import conectar from './Conexao.js';
import Candidato from '../Modelo/Candidato.js';

export default class CandidatoDAO {
    async gravar(candidato) {
        if (candidato instanceof Candidato) {
            const conexao = await conectar();
            const sql = `INSERT INTO candidatos (nome, cpf, data_de_nascimento, cep, telefone, email, grau_de_instrucao, curso) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const parametros = [
                candidato.getNome(),
                candidato.getCpf(),
                candidato.getDataDeNascimento(),
                candidato.getCep(),
                candidato.getTelefone(),
                candidato.getEmail(),
                candidato.getGrauDeInstrucao(),
                candidato.getCurso()
            ];
            const [resultados] = await conexao.execute(sql, parametros);
            candidato.setId(resultados.insertId);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(candidato) {
        if (candidato instanceof Candidato) {
            const conexao = await conectar();
            const sql = `UPDATE candidatos SET nome = ?, cpf = ?, data_de_nascimento = ?, cep = ?, telefone = ?, email = ?, grau_de_instrucao = ?, curso = ? 
                         WHERE id = ?`;
            const parametros = [
                candidato.getNome(),
                candidato.getCpf(),
                candidato.getDataDeNascimento(),
                candidato.getCep(),
                candidato.getTelefone(),
                candidato.getEmail(),
                candidato.getGrauDeInstrucao(),
                candidato.getCurso(),
                candidato.getId()
            ];
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(candidato) {
        if (candidato instanceof Candidato) {
            const conexao = await conectar();
            const sql = `DELETE FROM candidatos WHERE id = ?`;
            const parametros = [candidato.getId()];
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termoDePesquisa) {
        if (termoDePesquisa === undefined) {
            termoDePesquisa = "";
        }

        let sql = "";
        if (isNaN(parseInt(termoDePesquisa))) {
            sql = `SELECT * FROM candidatos WHERE nome LIKE ? OR email LIKE ?`;
            termoDePesquisa = '%' + termoDePesquisa + '%';
        } else {
            sql = `SELECT * FROM candidatos WHERE id LIKE ? OR cpf LIKE ?`;
            termoDePesquisa = '%' + termoDePesquisa + '%';
        }

        const conexao = await conectar();
        const [registros] = await conexao.execute(sql, [termoDePesquisa, termoDePesquisa]);
        let listaCandidatos = [];

        for (const registro of registros) {
            const candidato = new Candidato(
                registro.id,
                registro.nome,
                registro.cpf,
                registro.data_de_nascimento,
                registro.cep,
                registro.telefone,
                registro.email,
                registro.grau_de_instrucao,
                registro.curso
            );
            listaCandidatos.push(candidato);
        }

        global.poolConexoes.releaseConnection(conexao);
        return listaCandidatos;
    }
}

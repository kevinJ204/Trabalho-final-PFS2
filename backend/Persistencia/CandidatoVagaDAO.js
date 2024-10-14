import conectar from './Conexao.js';
import CandidatoVaga from '../Modelo/CandidatoVaga.js';

export default class CandidatoVagaDAO {
    async gravar(candidatoVaga) {
        if (candidatoVaga instanceof CandidatoVaga) {
            const conexao = await conectar();
            const sql = `INSERT INTO candidato_vaga (pk_cand_cpf, pk_vaga_codigo, data_inscricao, horario_inscricao, status) 
                         VALUES (?, ?, ?, ?, ?)`;
            const parametros = [
                candidatoVaga.getCpfCandidato(),
                candidatoVaga.getCodigoVaga(),
                candidatoVaga.getDataInscricao(),
                candidatoVaga.getHorarioInscricao(),
                candidatoVaga.getStatus()
            ];
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(candidatoVaga) {
        if (candidatoVaga instanceof CandidatoVaga) {
            const conexao = await conectar();
            const sql = `UPDATE candidato_vaga SET data_inscricao = ?, horario_inscricao = ?, status = ? 
                         WHERE pk_cand_cpf = ? AND pk_vaga_codigo = ?`;
            const parametros = [
                candidatoVaga.getDataInscricao(),
                candidatoVaga.getHorarioInscricao(),
                candidatoVaga.getStatus(),
                candidatoVaga.getCpfCandidato(),
                candidatoVaga.getCodigoVaga()
            ];
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(candidatoVaga) {
        if (candidatoVaga instanceof CandidatoVaga) {
            const conexao = await conectar();
            const sql = `DELETE FROM candidato_vaga WHERE pk_cand_cpf = ? AND pk_vaga_codigo = ?`;
            const parametros = [
                candidatoVaga.getCpfCandidato(),
                candidatoVaga.getCodigoVaga()
            ];
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termoDePesquisa) {
        if (termoDePesquisa === undefined) {
            termoDePesquisa = "";
        }

        const conexao = await conectar();
        const sql = `SELECT * FROM candidato_vaga WHERE pk_cand_cpf LIKE ? OR pk_vaga_codigo LIKE ? OR status LIKE ?`;
        termoDePesquisa = '%' + termoDePesquisa + '%';
        const [registros] = await conexao.execute(sql, [termoDePesquisa, termoDePesquisa, termoDePesquisa]);
        let listaInscricoes = [];

        for (const registro of registros) {
            const candidatoVaga = new CandidatoVaga(
                registro.data_inscricao,
                registro.horario_inscricao,
                registro.pk_cand_cpf,
                registro.pk_vaga_codigo,
                registro.status
            );
            listaInscricoes.push(candidatoVaga);
        }

        global.poolConexoes.releaseConnection(conexao);
        return listaInscricoes;
    }
}

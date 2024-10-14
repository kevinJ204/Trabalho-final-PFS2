import conectar from './Conexao.js';
import Vaga from '../Modelo/Vaga.js';

export default class VagaDAO {
    async gravar(vaga) {
        if (vaga instanceof Vaga) {
            const conexao = await conectar();
            const sql = `INSERT INTO vagas (cargo, salario, cidade, horas_semanais) VALUES (?, ?, ?, ?)`;
            const parametros = [
                vaga.getCargo(),
                vaga.getSalario(),
                vaga.getCidade(),
                vaga.getHorasSemanais()
            ];
            const [resultados] = await conexao.execute(sql, parametros);
            vaga.setCodigo(resultados.insertId);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(vaga) {
        if (vaga instanceof Vaga) {
            const conexao = await conectar();
            const sql = `UPDATE vagas SET cargo = ?, salario = ?, cidade = ?, horas_semanais = ? WHERE codigo = ?`;
            const parametros = [
                vaga.getCargo(),
                vaga.getSalario(),
                vaga.getCidade(),
                vaga.getHorasSemanais(),
                vaga.getCodigo()
            ];
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(vaga) {
        if (vaga instanceof Vaga) {
            const conexao = await conectar();
            const sql = `DELETE FROM vagas WHERE codigo = ?`;
            const parametros = [vaga.getCodigo()];
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
            sql = `SELECT * FROM vagas WHERE cidade LIKE ? OR cargo LIKE ?`;
            termoDePesquisa = '%' + termoDePesquisa + '%';
        } else {
            sql = `SELECT * FROM vagas WHERE codigo LIKE ? OR salario LIKE ?`;
            termoDePesquisa = '%' + termoDePesquisa + '%';
        }

        const conexao = await conectar();
        const [registros] = await conexao.execute(sql, [termoDePesquisa, termoDePesquisa]);
        let listaVagas = [];

        for (const registro of registros) {
            const vaga = new Vaga(
                registro.codigo,
                registro.cargo,
                registro.salario,
                registro.cidade,
                registro.horas_semanais
            );
            listaVagas.push(vaga);
        }

        global.poolConexoes.releaseConnection(conexao);
        return listaVagas;
    }
}

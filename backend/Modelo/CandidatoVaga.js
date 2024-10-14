import CandidatoVagaDAO from "../Persistencia/CandidatoVagaDAO.js";

export default class CandidatoVaga {
    #dataInscricao;
    #horarioInscricao;
    #cpfCandidato;
    #codigoVaga;
    #status;

    constructor(dataInscricao="", horarioInscricao="", cpfCandidato="", codigoVaga=0, status="Inscrito") {
        this.#dataInscricao = dataInscricao;
        this.#horarioInscricao = horarioInscricao;
        this.#cpfCandidato = cpfCandidato;
        this.#codigoVaga = codigoVaga;
        this.#status = status;
    }

    getDataInscricao() {
        return this.#dataInscricao;
    }
    setDataInscricao(dataInscricao) {
        this.#dataInscricao = dataInscricao;
    }

    getHorarioInscricao() {
        return this.#horarioInscricao;
    }
    setHorarioInscricao(horarioInscricao) {
        this.#horarioInscricao = horarioInscricao;
    }

    getCpfCandidato() {
        return this.#cpfCandidato;
    }
    setCpfCandidato(cpfCandidato) {
        this.#cpfCandidato = cpfCandidato;
    }

    getCodigoVaga() {
        return this.#codigoVaga;
    }
    setCodigoVaga(codigoVaga) {
        this.#codigoVaga = codigoVaga;
    }

    getStatus() {
        return this.#status;
    }
    setStatus(status) {
        this.#status = status;
    }

    async gravar() {
        const dao = new CandidatoVagaDAO();
        await dao.gravar(this);
    }

    async atualizar() {
        const dao = new CandidatoVagaDAO();
        await dao.atualizar(this);
    }

    async excluir() {
        const dao = new CandidatoVagaDAO();
        await dao.excluir(this);
    }

    async consultar(termoDePesquisa) {
        const dao = new CandidatoVagaDAO();
        return await dao.consultar(termoDePesquisa);
    }

    toString() {
        return `CandidatoVaga Data Inscrição: ${this.#dataInscricao}, Horário Inscrição: ${this.#horarioInscricao}, CPF Candidato: ${this.#cpfCandidato}, Código Vaga: ${this.#codigoVaga}, Status: ${this.#status}`;
    }

    toJSON() {
        return {
            "dataInscricao": this.#dataInscricao,
            "horarioInscricao": this.#horarioInscricao,
            "cpfCandidato": this.#cpfCandidato,
            "codigoVaga": this.#codigoVaga,
            "status": this.#status,
        };
    }
}

import CandidatoDAO from "../Persistencia/CandidatoDAO.js";

export default class Candidato {
    #id;
    #nome;
    #cpf;
    #dataDeNascimento;
    #cep;
    #telefone;
    #email;
    #grauDeInstrucao;
    #curso;

    constructor(id=0, nome="", cpf="", dataDeNascimento="", cep="", telefone="", email="", grauDeInstrucao="", curso="") {
        this.#id = id;
        this.#nome = nome;
        this.#cpf = cpf;
        this.#dataDeNascimento = dataDeNascimento;
        this.#cep = cep;
        this.#telefone = telefone;
        this.#email = email;
        this.#grauDeInstrucao = grauDeInstrucao;
        this.#curso = curso;
    }

    getId() {
        return this.#id;
    }
    setId(id) {
        this.#id = id;
    }

    getNome() {
        return this.#nome;
    }
    setNome(nome) {
        this.#nome = nome;
    }

    getCpf() {
        return this.#cpf;
    }
    setCpf(cpf) {
        this.#cpf = cpf;
    }

    getDataDeNascimento() {
        return this.#dataDeNascimento;
    }
    setDataDeNascimento(dataDeNascimento) {
        this.#dataDeNascimento = dataDeNascimento;
    }

    getCep() {
        return this.#cep;
    }
    setCep(cep) {
        this.#cep = cep;
    }

    getTelefone() {
        return this.#telefone;
    }
    setTelefone(telefone) {
        this.#telefone = telefone;
    }

    getEmail() {
        return this.#email;
    }
    setEmail(email) {
        this.#email = email;
    }

    getGrauDeInstrucao() {
        return this.#grauDeInstrucao;
    }
    setGrauDeInstrucao(grauDeInstrucao) {
        this.#grauDeInstrucao = grauDeInstrucao;
    }

    getCurso() {
        return this.#curso;
    }
    setCurso(curso) {
        this.#curso = curso;
    }

    async gravar() {
        const dao = new CandidatoDAO();
        await dao.gravar(this);
    }

    async atualizar() {
        const dao = new CandidatoDAO();
        await dao.atualizar(this);
    }

    async excluir() {
        const dao = new CandidatoDAO();
        await dao.excluir(this);
    }

    async consultar(termoDePesquisa) {
        const dao = new CandidatoDAO();
        return await dao.consultar(termoDePesquisa);
    }

    formatDate (dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    toString() {
        return `Candidato id: ${this.#id}, nome: ${this.#nome}, CPF: ${this.#cpf}, Data de Nascimento: ${this.#dataDeNascimento}, 
        CEP: ${this.#cep}, Telefone: ${this.#telefone}, Email: ${this.#email}, Grau de Instrução: ${this.#grauDeInstrucao}, Curso: ${this.#curso}`;
    }
    
    toJSON() {
        return {
            "id": this.#id,
            "nome": this.#nome,
            "cpf": this.#cpf,
            "dataDeNascimento": this.formatDate(this.#dataDeNascimento),
            "cep": this.#cep,
            "telefone": this.#telefone,
            "email": this.#email,
            "grauDeInstrucao": this.#grauDeInstrucao,
            "curso": this.#curso,
        };
    }
}

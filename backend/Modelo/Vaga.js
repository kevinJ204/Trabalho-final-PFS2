import VagaDAO from "../Persistencia/VagaDAO.js";

export default class Vaga {
    #codigo;
    #cargo;
    #salario;
    #cidade;
    #horasSemanais;

    constructor(codigo=0, cargo="", salario=0.0, cidade="", horasSemanais=0) {
        this.#codigo = codigo;
        this.#cargo = cargo;
        this.#salario = salario;
        this.#cidade = cidade;
        this.#horasSemanais = horasSemanais;
    }

    getCodigo() {
        return this.#codigo;
    }
    setCodigo(codigo) {
        this.#codigo = codigo;
    }

    getCargo() {
        return this.#cargo;
    }

    setCargo(cargo) {
        this.#cargo = cargo;
    }

    getSalario() {
        return this.#salario;
    }
    setSalario(salario) {
        this.#salario = salario;
    }

    getCidade() {
        return this.#cidade;
    }
    setCidade(cidade) {
        this.#cidade = cidade;
    }

    getHorasSemanais() {
        return this.#horasSemanais;
    }
    setHorasSemanais(horasSemanais) {
        this.#horasSemanais = horasSemanais;
    }

    async gravar() {
        const dao = new VagaDAO();
        await dao.gravar(this);
    }

    async atualizar() {
        const dao = new VagaDAO();
        await dao.atualizar(this);
    }

    async excluir() {
        const dao = new VagaDAO();
        await dao.excluir(this);
    }

    async consultar(termoDePesquisa) {
        const dao = new VagaDAO();
        return await dao.consultar(termoDePesquisa);
    }

    toString() {
        return `Vaga código: ${this.#codigo}, Cargo: ${this.#cargo}, Salário: ${this.#salario}, Cidade: ${this.#cidade}, Horas Semanais: ${this.#horasSemanais}`;
    }

    toJSON() {
        return {
            "codigo": this.#codigo,
            "cargo": this.#cargo,
            "salario": this.#salario,
            "cidade": this.#cidade,
            "horasSemanais": this.#horasSemanais,
        };
    }
}

import React, { useEffect, useState, useRef } from 'react';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
import './Usuarios.css';
import CandidatoServico from '../servicos/CandidatoServico.js'

const GerenciarCandidatos = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState("Pesquisar um candidato...");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [candidatos, setCandidatos] = useState([]);
    const [novoCandidato, setNovoCandidato] = useState({ nome: '',cpf: '',dataDeNascimento: '',cep: '',telefone: '',email: '',grauDeInstrucao: '',curso: '',});
    const [selectedCandidatoIndex, setSelectedCandidatoIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [deleteConfirmationModalIsOpen, setDeleteConfirmationModalIsOpen] = useState(false);
    const [candidatoADeletar, setCandidatoADeletar] = useState(null);
    const candidatoServico = new CandidatoServico();

    const hasFetchedCandidatos = useRef(false);

    useEffect(() => {
        if(!hasFetchedCandidatos.current) {
            fetchCandidatos();
            hasFetchedCandidatos.current = true;
        }
    }, []);

    const fetchCandidatos = async () => {
        try {
            const dados = await candidatoServico.obterCandidatos();
            setCandidatos(dados);
        } catch (error) {
            alert('Erro aobuscar candidatos: ' + error);
        }
    };

    const hasSearchedCandidato = useRef(false);

    useEffect(() => {
        if (searchValue && ! hasSearchedCandidato.current) {
            candidatoServico.obterCandidatoPorIdOuNome(searchValue)
                .then(setCandidatos)
                .catch(error => alert('Erro ao buscar candidatos: ' + error));
            hasSearchedCandidato.current = true;
        } else if (!searchValue && hasFetchedCandidatos.current) {
            fetchCandidatos();
            hasSearchedCandidato.current = false;
        }
    }, [searchValue]);

    const validateForm = () => {
        const newErrors = {};
        
        const cpfNumerico = novoCandidato.cpf.replace(/\D/g, '');
        const cepNumerico = novoCandidato.cep.replace(/\D/g, '');
        const telefoneNumerico = novoCandidato.telefone.replace(/\D/g, '');
    
        if (novoCandidato.nome.length < 3) newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
        if (!/\S+@\S+\.\S+/.test(novoCandidato.email)) newErrors.email = 'Formato de email inválido';
        if (cpfNumerico.length !== 11) newErrors.cpf = 'CPF deve ter 11 dígitos';
        if (cepNumerico.length !== 8) newErrors.cep = 'CEP deve ter 8 dígitos';
        if (telefoneNumerico.length !== 10 && telefoneNumerico.length !== 11) {
            newErrors.telefone = 'Telefone deve ter 10 ou 11 dígitos';
        }
        if (!novoCandidato.grauDeInstrucao) {
            newErrors.grauDeInstrucao = 'Grau de instrução é obrigatório';
        }
    
        if (novoCandidato.grauDeInstrucao === 'superior' && novoCandidato.curso.length < 2) {
            newErrors.curso = 'Curso deve ter no mínimo 2 caracteres';
        }
    
        return newErrors;
    };
        
    const validateField = (field, value) => {
        const newErrors = { ...errors };
    
        const valueWithoutMask = value.replace(/[^\d]/g, '');
    
        if (field === 'nome') {
            if (value.length < 3) {
                newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
            } else {
                delete newErrors.nome;
            }
        } else if (field === 'cpf') {
            if (valueWithoutMask.length !== 11) {
                newErrors.cpf = 'CPF deve ter 11 dígitos';
            } else {
                delete newErrors.cpf;
            }
        } else if (field === 'cep') {
            if (valueWithoutMask.length !== 8) {
                newErrors.cep = 'CEP deve ter 8 dígitos';
            } else {
                delete newErrors.cep;
            }
        } else if (field === 'telefone') {
            if (valueWithoutMask.length < 10 || valueWithoutMask.length > 11) {
                newErrors.telefone = 'Telefone deve ter 10 ou 11 dígitos';
            } else {
                delete newErrors.telefone;
            }
        } else if (field === 'email') {
            if (!/\S+@\S+\.\S+/.test(value)) {
                newErrors.email = 'Formato de email inválido';
            } else {
                delete newErrors.email;
            }
        } else if (field === 'grauDeInstrucao') {
            if (!value) {
                newErrors.grauDeInstrucao = 'Grau de instrução é obrigatório';
            } else {
                delete newErrors.grauDeInstrucao;
            }
        } else if (field === 'curso') {
            if (value.length < 2) {
                newErrors.curso = 'Curso deve ter no mínimo 2 caracteres';
            } else {
                delete newErrors.curso;
            }
        }
    
        setErrors(newErrors);
    };
    
    const handleChange = (field, value) => {
        const updatedCandidato = { ...novoCandidato, [field]: value };
        if (field === 'grauDeInstrucao' && value !== 'superior') {
            updatedCandidato.curso = 'nenhum';
        }
        setNovoCandidato(updatedCandidato);
        validateField(field, value);
    };
    
    const handleAddCandidato = async () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            try {
                let resposta;
                if (selectedCandidatoIndex !== null) {
                    resposta = await candidatoServico.atualizarCandidato(candidatos[selectedCandidatoIndex].id, novoCandidato);
                    setSelectedCandidatoIndex(null);
                } else {
                    resposta = await candidatoServico.adicionarCandidato(novoCandidato);
                }
                if (resposta && resposta.status === true) {
                    setConfirmationMessage(selectedCandidatoIndex !== null ? 'Candidato atualizado com sucesso!' : 'Candidato cadastrado com sucesso');
                } else {
                    setConfirmationMessage('Erro ao salvar candidato!');
                }
                fetchCandidatos();
                setNovoCandidato({ nome: '',cpf: '',dataDeNascimento: '',cep: '',telefone: '',email: '',grauDeInstrucao: '',curso: ''});
                setModalIsOpen(false);
                setConfirmationModalIsOpen(true);
            } catch (error) {
                alert(error);
            }
        } else {
            setErrors(newErrors);
        }
    };
    

    const handleDeleteCandidato = (index) => {
        setCandidatoADeletar(index);
        setDeleteConfirmationModalIsOpen(true);
    };

    const confirmDeleteCandidato = async () => {
        try {
            await candidatoServico.deletarCandidato(candidatos[candidatoADeletar].id);
            fetchCandidatos();
            setDeleteConfirmationModalIsOpen(false);
            setCandidatoADeletar(null);
        } catch (error) {
            alert(error);
        }
    };

    const handleEditCandidato = (index) => {
        setNovoCandidato(candidatos[index]);
        setSelectedCandidatoIndex(index);
        setErrors({});
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setErrors({});
        setNovoCandidato({ nome: '',cpf: '',dataDeNascimento: '',cep: '',telefone: '',email: '',grauDeInstrucao: '',curso: ''});
        setSelectedCandidatoIndex(null);
    };

    return (
        <div className="home-page">
            <div className="menu-background">
                <div className="menu-header">
                    <div>
                        <Link to="/GerenciarCandidatos" className="menu-option">Candidatos</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarVagas" className="menu-option">Vagas</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarInscricoes" className="menu-option">Inscrições</Link>
                    </div>
                </div>
            </div>
            <div className="content-background">
                <h1 className="page-title">Gerenciamento de Candidatos</h1>
                <div className="search-add">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="search-box"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={() => setSearchPlaceholder('')}
                            onBlur={() => setSearchPlaceholder('Pesquisar um candidato...')}
                        />
                    </div>
                    <button className="add-button" onClick={() => setModalIsOpen(true)}>NOVO CANDIDATO</button>
                </div>
                <div className="table-background">
                    <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CPF</th> 
                            <th>Data de Nascimento</th> 
                            <th>CEP</th> 
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Grau de Instrução</th> 
                            <th>Curso</th> 
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                    {candidatos.map((candidato, index) => (
                        <tr key={index} className="table-row">
                            <td className="table-row-text">{candidato.id}</td>
                            <td className="table-row-text">{candidato.nome}</td>
                            <td className="table-row-text">{candidato.cpf}</td>
                            <td className="table-row-text">{candidato.dataDeNascimento}</td>
                            <td className="table-row-text">{candidato.cep}</td>
                            <td className="table-row-text">{candidato.email}</td>
                            <td className="table-row-text">
                                {candidato.telefone ? 
                                    `(${candidato.telefone.substring(1, 3)}) ${candidato.telefone.substring(6, 11)}${candidato.telefone.substring(11)}` : 
                                    'Telefone não disponível'
                                }
                            </td>
                            <td className="table-row-text">{candidato.grauDeInstrucao}</td>
                            <td className="table-row-text">{candidato.curso}</td>
                            <td className="table-row-text">
                                <button className="edit-button" onClick={() => handleEditCandidato(index)}>Editar</button>
                                <button className="delete-button" onClick={() => handleDeleteCandidato(index)}>Deletar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                    </table>
                </div>
            </div>

            {modalIsOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{selectedCandidatoIndex !== null ? 'Editar Candidato' : 'Novo Candidato'}</h2>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={novoCandidato.nome}
                            onChange={(e) => handleChange('nome', e.target.value)}
                        />
                        {errors.nome && <p className="error">{errors.nome}</p>}

                        <InputMask
                            mask="999.999.999-99"
                            placeholder="CPF"
                            value={novoCandidato.cpf}
                            onChange={(e) => handleChange('cpf', e.target.value)}
                        >
                            {(inputProps) => <input {...inputProps} type="text" />}
                        </InputMask>
                        {errors.cpf && <p className="error">{errors.cpf}</p>}

                        <input
                            type="date"
                            placeholder="Data de Nascimento"
                            value={novoCandidato.dataDeNascimento ? 
                                novoCandidato.dataDeNascimento.split('/').reverse().join('-') : ''
                            }
                            onChange={(e) => {
                                const [year, month, day] = e.target.value.split('-');
                                const formattedDate = `${day}/${month}/${year}`;
                                handleChange('dataDeNascimento', formattedDate);
                            }}
                        />
                        {errors.dataDeNascimento && <p className="error">{errors.dataDeNascimento}</p>}


                        <InputMask
                            mask="99999-999"
                            placeholder="CEP"
                            value={novoCandidato.cep}
                            onChange={(e) => handleChange('cep', e.target.value)}
                        >
                            {(inputProps) => <input {...inputProps} type="text" />}
                        </InputMask>
                        {errors.cep && <p className="error">{errors.cep}</p>}

                        <InputMask
                            mask="(99) 99999-9999"
                            placeholder="Telefone"
                            value={novoCandidato.telefone}
                            onChange={(e) => handleChange('telefone', e.target.value)}
                        >
                            {(inputProps) => <input {...inputProps} type="text" />}
                        </InputMask>
                        {errors.telefone && <p className="error">{errors.telefone}</p>}

                        <input
                            type="email"
                            placeholder="Email"
                            value={novoCandidato.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                        {errors.email && <p className="error">{errors.email}</p>}

                        <select
                            value={novoCandidato.grauDeInstrucao}
                            onChange={(e) => handleChange('grauDeInstrucao', e.target.value)}
                        >
                            <option value="">Grau de Instrução</option>
                            <option value="fundamental">Ensino Fundamental</option>
                            <option value="medio">Ensino Médio</option>
                            <option value="superior">Ensino Superior</option>
                        </select>
                        {errors.grauDeInstrucao && <p className="error">{errors.grauDeInstrucao}</p>}

                        <input
                            type="text"
                            placeholder="Curso"
                            value={novoCandidato.curso}
                            onChange={(e) => handleChange('curso', e.target.value)}
                            disabled={novoCandidato.grauDeInstrucao !== 'superior'}
                        />
                        {errors.curso && <p className="error">{errors.curso}</p>}

                        <div className="modal-actions">
                            <button className="save-button" onClick={handleAddCandidato} disabled={Object.keys(errors).length > 0}>
                                {selectedCandidatoIndex !== null ? 'Salvar' : 'Adicionar'}
                            </button>
                            <button className="cancel-button" onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        
            {confirmationModalIsOpen && (
                    <div className="confirmation-modal">
                        <div className="confirmation-modal-content">
                            <span className="close" onClick={() => setConfirmationModalIsOpen(false)}>&times;</span>
                            <h2>{confirmationMessage}</h2>
                            <button onClick={() => setConfirmationModalIsOpen(false)}>Fechar</button>
                        </div>
                    </div>
                )}

            {deleteConfirmationModalIsOpen && (
                <div className="confirmation-modal">
                    <div className="confirmation-modal-content">
                        <span className="close" onClick={() => setDeleteConfirmationModalIsOpen(false)}>&times;</span>
                        <h2>Tem certeza que deseja deletar este candidato?</h2>
                        <button onClick={confirmDeleteCandidato}>Confirmar</button>
                        <button onClick={() => setDeleteConfirmationModalIsOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciarCandidatos;

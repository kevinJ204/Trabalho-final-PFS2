import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Usuarios.css';
import VagaServico from '../servicos/VagaServico.js'
import CandidatoServico from '../servicos/CandidatoServico.js'
import CandidatoVagaServico from '../servicos/CandidatoVagaServico.js';

const GerenciarVagas = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState("Pesquisar uma vaga...");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [applyModalIsOpen, setApplyModalIsOpen] = useState(false); 
    const [vagas, setVagas] = useState([]);
    const [candidatos, setCandidatos] = useState([]);
    const [novaVaga, setNovaVaga] = useState({ cargo: '', salario: '', cidade: '', horasSemanais: '' });
    const [selectedVagaIndex, setSelectedVagaIndex] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(''); 
    const [errors, setErrors] = useState({});
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [deleteConfirmationModalIsOpen, setDeleteConfirmationModalIsOpen] = useState(false);
    const [vagaADeletar, setVagaADeletar] = useState(null);
    const vagaServico = new VagaServico();
    const candidatoServico = new CandidatoServico();
    const candidatoVagaServico = new CandidatoVagaServico();

    const hasFetchedVagas = useRef(false);
    const hasFetchedCandidatos = useRef(false);

    useEffect(() => {
        if(!hasFetchedVagas.current) {
            fetchVagas();
            hasFetchedVagas.current = true;
        } else if(!hasFetchedCandidatos.current) {
            fetchCandidatos();
            hasFetchedCandidatos.current = true;
        }
    }, []);

    const fetchVagas = async () => {
        try {
            const dados = await vagaServico.obterVagas();
            setVagas(dados);
        } catch (error) {
            alert('Erro aobuscar vagas: ' + error);
        }
    };

    const fetchCandidatos = async () => {
        try {
            const dados = await candidatoServico.obterCandidatos();
            setCandidatos(dados);
        } catch (error) {
            alert('Erro aobuscar candidatos: ' + error);
        }
    };

    const hasSearchedVaga = useRef(false);

    useEffect(() => {
        if (searchValue && ! hasSearchedVaga.current) {
            vagaServico.obterVagaPorIdOuCargo(searchValue)
                .then(setVagas)
                .catch(error => alert('Erro ao buscar vagas: ' + error));
            hasSearchedVaga.current = true;
        } else if (!searchValue && hasFetchedVagas.current) {
            fetchVagas();
            hasSearchedVaga.current = false;
        }
    }, [searchValue]);

    const validateForm = () => {
        const newErrors = {};
    
        if (novaVaga.cargo.length < 3) {
            newErrors.cargo = 'Cargo deve ter no mínimo 3 caracteres';
        }
    
        if (!novaVaga.salario) {
            newErrors.salario = 'Salário é obrigatório';
        } else if (isNaN(novaVaga.salario) || Number(novaVaga.salario) <= 0) {
            newErrors.salario = 'Salário deve ser um número válido e maior que zero';
        }
    
        if (novaVaga.cidade.length === 0) {
            newErrors.cidade = 'Cidade é obrigatória';
        }
    
        if (!novaVaga.horasSemanais || isNaN(novaVaga.horasSemanais) || novaVaga.horasSemanais <= 0) {
            newErrors.horasSemanais = 'Horas semanais devem ser um número maior que zero';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
            
    const validateField = (field, value) => {
        const newErrors = { ...errors };
    
        if (field === 'cargo') {
            if (value.length < 3) {
                newErrors.cargo = 'Cargo deve ter no mínimo 3 caracteres';
            } else {
                delete newErrors.cargo;
            }
        } else if (field === 'salario') {
            if (!value || isNaN(value) || Number(value) <= 0) {
                newErrors.salario = 'Salário deve ser um número válido e maior que zero';
            } else {
                delete newErrors.salario;
            }
        } else if (field === 'cidade') {
            if (value.length === 0) {
                newErrors.cidade = 'Cidade é obrigatória';
            } else {
                delete newErrors.cidade;
            }
        } else if (field === 'horasSemanais') {
            if (!value || isNaN(value) || value <= 0) {
                newErrors.horasSemanais = 'Horas semanais devem ser um número maior que zero';
            } else {
                delete newErrors.horasSemanais;
            }
        }
    
        setErrors(newErrors);
    };
        
    const handleChange = (field, value) => {
        const updatedVaga = { ...novaVaga, [field]: value };
        setNovaVaga(updatedVaga);
        validateField(field, value);
    };
    
    const handleAddVaga = async () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            try {
                let resposta;
                if (selectedVagaIndex !== null) {
                    resposta = await vagaServico.atualizarVaga(vagas[selectedVagaIndex].codigo, novaVaga);
                    setSelectedVagaIndex(null);
                } else {
                    resposta = await vagaServico.adicionarVaga(novaVaga);
                }
                if (resposta && resposta.status === true) {
                    setConfirmationMessage(selectedVagaIndex !== null ? 'Vaga atualizada com sucesso!' : 'Vaga cadastrada com sucesso');
                } else {
                    setConfirmationMessage('Erro ao salvar vaga!');
                }
                fetchVagas();
                setNovaVaga({ cargo: '', salario: '', cidade: '', horasSemanais: '' });
                setModalIsOpen(false);
                setConfirmationModalIsOpen(true);
            } catch (error) {
                alert(error);
            }
        } else {
            setErrors(newErrors);
        }
    };
    

    const handleDeleteVaga = (index) => {
        setVagaADeletar(index);
        setDeleteConfirmationModalIsOpen(true);
    };

    const handleApply = (index) => {
        setSelectedVagaIndex(index);
        setApplyModalIsOpen(true); 
    };

    const confirmDeleteVaga = async () => {
        try {
            await vagaServico.deletarVaga(vagas[vagaADeletar].codigo);
            fetchVagas();
            setDeleteConfirmationModalIsOpen(false);
            setVagaADeletar(null);
        } catch (error) {
            alert(error);
        }
    };

    const handleEditVaga = (index) => {
        setNovaVaga(vagas[index]);
        setSelectedVagaIndex(index);
        setErrors({});
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setErrors({});
        setNovaVaga({ cargo: '', salario: '', cidade: '', horasSemanais: '' });
        setSelectedVagaIndex(null);
    };

    const closeApplyModal = () => {
        setApplyModalIsOpen(false);
        setSelectedCandidate('');
    };

    const handleCandidateChange = (event) => {
        setSelectedCandidate(event.target.value);
    };

    const submitApplyModal = async () => {
        if (selectedCandidate === '' || selectedVagaIndex === null) {
            alert('Selecione um candidato e uma vaga para continuar.');
            return;
        }
    
        const candidatoSelecionado = candidatos.find(candidato => candidato.nome === selectedCandidate);
    
        if (!candidatoSelecionado || !candidatoSelecionado.cpf) {
            alert('Candidato inválido ou CPF não encontrado.');
            return;
        }
    
        const vagaSelecionada = vagas[selectedVagaIndex];
        if (!vagaSelecionada || !vagaSelecionada.codigo) {
            alert('Vaga selecionada inválida.');
            return;
        }
    
        const dataAtual = new Date();
        const dataInscricao = dataAtual.toISOString().split('T')[0];
        const horarioInscricao = dataAtual.toTimeString().split(' ')[0];
    
        const inscricao = {
            cpfCandidato: candidatoSelecionado.cpf,
            codigoVaga: vagaSelecionada.codigo,
            status: 'inscrito',
            dataInscricao,
            horarioInscricao
        };
    
        try {
            const resposta = await candidatoVagaServico.adicionarInscricao(inscricao);
            if (resposta) {
                setConfirmationMessage('Inscrição realizada com sucesso!');
                setConfirmationModalIsOpen(true);
            } else {
                setConfirmationMessage('Erro ao realizar inscrição.');
                setConfirmationModalIsOpen(true);
            }
        } catch (error) {
            alert('Erro ao enviar inscrição: ' + error);
        }
    
        setApplyModalIsOpen(false);
        setSelectedCandidate('');
        setSelectedVagaIndex(null);
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
                <h1 className="page-title">Gerenciamento de Vagas</h1>
                <div className="search-add">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="search-box"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={() => setSearchPlaceholder('')}
                            onBlur={() => setSearchPlaceholder('Pesquisar uma vaga...')}
                        />
                    </div>
                    <button className="add-button" onClick={() => setModalIsOpen(true)}>Criar Vaga</button>
                </div>
                <div className="table-background">
                    <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cargo</th>
                            <th>Salário</th> 
                            <th>Cidade</th> 
                            <th>Horas Semanais</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vagas.map((vaga, index) => (
                            <tr key={index} className="table-row">
                                <td className="table-row-text">{vaga.codigo}</td>
                                <td className="table-row-text">{vaga.cargo}</td>
                                <td className="table-row-text">{vaga.salario}</td> 
                                <td className="table-row-text">{vaga.cidade}</td> 
                                <td className="table-row-text">{vaga.horasSemanais}</td>
                                <td className="table-row-text">
                                    <button className="apply-button" onClick={() => handleApply(index)}>Aplicar</button>
                                    <button className="edit-button" onClick={() => handleEditVaga(index)}>Editar</button>
                                    <button className="delete-button" onClick={() => handleDeleteVaga(index)}>Deletar</button>
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
                        <h2>{selectedVagaIndex !== null ? 'Editar Vaga' : 'Nova Vaga'}</h2>
                        
                        <input
                            type="text"
                            placeholder="Cargo"
                            value={novaVaga.cargo}
                            onChange={(e) => handleChange('cargo', e.target.value)}
                        />
                        {errors.cargo && <p className="error">{errors.cargo}</p>}

                        <input
                            type="text"
                            placeholder="Salário"
                            value={novaVaga.salario}
                            onChange={(e) => handleChange('salario', e.target.value)}
                        />
                        {errors.salario && <p className="error">{errors.salario}</p>}

                        <input
                            type="text"
                            placeholder="Cidade"
                            value={novaVaga.cidade}
                            onChange={(e) => handleChange('cidade', e.target.value)}
                        />
                        {errors.cidade && <p className="error">{errors.cidade}</p>}

                        <input
                            type="number"
                            placeholder="Horas Semanais"
                            value={novaVaga.horasSemanais}
                            onChange={(e) => handleChange('horasSemanais', e.target.value)}
                        />
                        {errors.horasSemanais && <p className="error">{errors.horasSemanais}</p>}

                        <div className="modal-actions">
                            <button className="save-button" onClick={handleAddVaga}>Salvar</button>
                            <button className="cancel-button" onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            {applyModalIsOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Aplicar para a Vaga</h2>
                        <select value={selectedCandidate} onChange={handleCandidateChange}>
                            <option value="">Selecione um candidato</option>
                            {candidatos.map((candidato) => (
                                <option key={candidato.id} value={candidato.nome}>{candidato.nome}</option>
                            ))}
                        </select>
                        <div className="modal-actions">
                            <button className="save-button" onClick={submitApplyModal}>Enviar Aplicação</button>
                            <button className="cancel-button" onClick={closeApplyModal}>Cancelar</button>
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
                        <h2>Tem certeza que deseja deletar esta vaga?</h2>
                        <button onClick={confirmDeleteVaga}>Confirmar</button>
                        <button onClick={() => setDeleteConfirmationModalIsOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciarVagas;

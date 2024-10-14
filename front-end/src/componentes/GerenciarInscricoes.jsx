import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Usuarios.css';
import CandidatoVagaServico from '../servicos/CandidatoVagaServico.js';

const GerenciarInscricoes = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState("Pesquisar uma inscrição...");
    const [inscricoes, setInscricoes] = useState([]);
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [deleteConfirmationModalIsOpen, setDeleteConfirmationModalIsOpen] = useState(false);
    const [inscricaoADeletar, setInscricaoADeletar] = useState(null);
    const candidatoVagaServico = new CandidatoVagaServico();

    const hasFetchedInscricoes = useRef(false);

    useEffect(() => {
        if (!hasFetchedInscricoes.current) {
            fetchInscricoes();
            hasFetchedInscricoes.current = true;
        }
    }, []);

    const fetchInscricoes = async () => {
        try {
            const dados = await candidatoVagaServico.obterInscricoes();
            setInscricoes(dados);
        } catch (error) {
            alert('Erro ao buscar inscrições: ' + error);
        }
    };

    const hasSearchedInscricao = useRef(false);

    useEffect(() => {
        if (searchValue && !hasSearchedInscricao.current) {
            candidatoVagaServico.obterInscricaoPorCandidatoOuVaga(searchValue)
                .then(setInscricoes)
                .catch(error => alert('Erro ao buscar inscrições: ' + error));
            hasSearchedInscricao.current = true;
        } else if (!searchValue && hasSearchedInscricao.current) {
            fetchInscricoes();
            hasSearchedInscricao.current = false;
        }
    }, [searchValue]);

    const handleDeleteInscricao = (index) => {
        setInscricaoADeletar(index);
        setDeleteConfirmationModalIsOpen(true);
    };

    const confirmDeleteInscricao = async () => {
        try {
            await candidatoVagaServico.deletarInscricao(inscricoes[inscricaoADeletar].cpfCandidato,inscricoes[inscricaoADeletar].codigoVaga);
            fetchInscricoes();
            setDeleteConfirmationModalIsOpen(false);
            setInscricaoADeletar(null);
        } catch (error) {
            alert(error);
        }
    };

    const handleEntrevistarInscricao = async (index) => {
        try {
            const inscricaoSelecionada = inscricoes[index];
            
            const inscricaoAtualizada = {
                ...inscricaoSelecionada,
                status: 'Entrevista'
            };
            
            await candidatoVagaServico.atualizarInscricao(inscricaoSelecionada.id, inscricaoAtualizada);
            
            const novasInscricoes = [...inscricoes];
            novasInscricoes[index] = inscricaoAtualizada;
            setInscricoes(novasInscricoes);
    
            setConfirmationMessage('A inscrição foi atualizada para o status "Entrevista" com sucesso.');
            setConfirmationModalIsOpen(true);
        } catch (error) {
            alert('Erro ao atualizar a inscrição para o status de entrevista: ' + error.message);
        }
    };

    const formatarData = (data) => {
        const dataObj = new Date(data);
        return dataObj.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
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
                <h1 className="page-title">Gerenciamento de Inscrições</h1>
                <div className="search-add">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="search-box"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={() => setSearchPlaceholder('')}
                            onBlur={() => setSearchPlaceholder('Pesquisar uma inscrição...')}
                        />
                    </div>
                </div>
                <div className="table-background">
                    <table>
                        <thead>
                            <tr>
                                <th>CPF</th>
                                <th>Código Vaga</th>
                                <th>Data de Aplicação</th>
                                <th>Horário de Aplicação</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inscricoes.map((inscricao, index) => (
                                <tr key={index} className="table-row">
                                    <td className="table-row-text">{inscricao.cpfCandidato}</td>
                                    <td className="table-row-text">{inscricao.codigoVaga}</td>
                                    <td className="table-row-text">{formatarData(inscricao.dataInscricao)}</td>
                                    <td className="table-row-text">{inscricao.horarioInscricao}</td>
                                    <td className="table-row-text">{inscricao.status}</td>
                                    <td className="table-row-text">
                                        <button className="interview-button" onClick={() => handleEntrevistarInscricao(index)}>Entrevistar</button>
                                        <button className="delete-button" onClick={() => handleDeleteInscricao(index)}>Deletar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
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
                        <h2>Tem certeza que deseja deletar esta inscrição?</h2>
                        <button onClick={confirmDeleteInscricao}>Confirmar</button>
                        <button onClick={() => setDeleteConfirmationModalIsOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciarInscricoes;

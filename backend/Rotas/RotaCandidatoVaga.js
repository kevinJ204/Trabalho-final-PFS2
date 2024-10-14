import { Router } from 'express';
import CandidatoVagaCtrl from '../Controles/candidatoVagaCtrl.js';

const rotaCandidatoVaga = new Router();
const candidatoVagaCtrl = new CandidatoVagaCtrl();

rotaCandidatoVaga
    .get('/', candidatoVagaCtrl.consultar)
    .get('/:termo', candidatoVagaCtrl.consultar)
    .post('/', candidatoVagaCtrl.gravar)
    .put('/:cpf/:codigo', candidatoVagaCtrl.atualizar)
    .patch('/:cpf/:codigo', candidatoVagaCtrl.atualizar)
    .delete('/:cpf/:codigo', candidatoVagaCtrl.excluir);

export default rotaCandidatoVaga;

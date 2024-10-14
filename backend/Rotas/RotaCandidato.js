import { Router } from 'express';
import CandidatoCtrl from '../Controles/candidatoCtrl.js';

const rotaCandidato = new Router();
const candidatoCtrl = new CandidatoCtrl();

rotaCandidato
    .get('/', candidatoCtrl.consultar)
    .get('/:termo', candidatoCtrl.consultar)
    .post('/', candidatoCtrl.gravar)
    .put('/:id', candidatoCtrl.atualizar)
    .patch('/:id', candidatoCtrl.atualizar)
    .delete('/:id', candidatoCtrl.excluir);

export default rotaCandidato;

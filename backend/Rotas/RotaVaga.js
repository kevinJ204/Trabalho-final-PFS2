import { Router } from 'express';
import VagaCtrl from '../Controles/vagaCtrl.js';

const rotaVaga = new Router();
const vagaCtrl = new VagaCtrl();

rotaVaga
    .get('/', vagaCtrl.consultar)
    .get('/:termo', vagaCtrl.consultar)
    .post('/', vagaCtrl.gravar)
    .put('/:codigo', vagaCtrl.atualizar)
    .patch('/:codigo', vagaCtrl.atualizar)
    .delete('/:codigo', vagaCtrl.excluir);

export default rotaVaga;

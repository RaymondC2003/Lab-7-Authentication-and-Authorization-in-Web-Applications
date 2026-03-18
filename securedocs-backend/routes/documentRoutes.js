import express from 'express';
import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument
} from '../controllers/documentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  requireDocumentOwnership
} from '../middleware/authorizationMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', createDocument);
router.get('/', getDocuments);
router.get('/:id', requireDocumentOwnership, getDocumentById);
router.put('/:id', requireDocumentOwnership, updateDocument);
router.delete('/:id', requireDocumentOwnership, deleteDocument);

export default router;
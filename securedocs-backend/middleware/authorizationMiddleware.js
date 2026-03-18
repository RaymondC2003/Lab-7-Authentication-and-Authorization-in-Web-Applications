import mongoose from 'mongoose';
import Document from '../models/Document.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.role) {
      return res.status(403).json({
        message: 'Authorization information is missing'
      });
    }

    if (!allowedRoles.includes(req.session.role)) {
      return res.status(403).json({
        message: 'Access denied: insufficient permissions'
      });
    }

    next();
  };
};

export const requireDocumentOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid document identifier'
      });
    }

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }

    const isOwner = document.ownerId.toString() === req.session.userId;
    const isAdmin = req.session.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'Access denied: you are not allowed to access this document'
      });
    }

    req.document = document;
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Authorization check failed',
      error: error.message
    });
  }
};
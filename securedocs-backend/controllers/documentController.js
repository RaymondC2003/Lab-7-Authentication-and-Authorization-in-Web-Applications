import Document from '../models/Document.js';

export const createDocument = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: 'Title and description are required'
      });
    }

    const document = await Document.create({
      title: title.trim(),
      description: description.trim(),
      ownerId: req.session.userId
    });

    return res.status(201).json({
      message: 'Document created successfully',
      document: {
        documentId: document._id,
        title: document.title,
        description: document.description,
        ownerId: document.ownerId,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating document',
      error: error.message
    });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      ownerId: req.session.userId
    }).sort({ createdAt: -1 });

    return res.status(200).json(
      documents.map((doc) => ({
        documentId: doc._id,
        title: doc.title,
        description: doc.description,
        ownerId: doc.ownerId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }))
    );
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving documents',
      error: error.message
    });
  }
};

export const getDocumentById = async (req, res) => {
  const document = req.document;

  return res.status(200).json({
    documentId: document._id,
    title: document.title,
    description: document.description,
    ownerId: document.ownerId,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt
  });
};

export const updateDocument = async (req, res) => {
  try {
    const document = req.document;
    const { title, description } = req.body;

    if (title !== undefined) {
      document.title = title.trim();
    }

    if (description !== undefined) {
      document.description = description.trim();
    }

    await document.save();

    return res.status(200).json({
      message: 'Document updated successfully',
      document: {
        documentId: document._id,
        title: document.title,
        description: document.description,
        ownerId: document.ownerId,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating document',
      error: error.message
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    await req.document.deleteOne();

    return res.status(200).json({
      message: 'Document deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting document',
      error: error.message
    });
  }
};
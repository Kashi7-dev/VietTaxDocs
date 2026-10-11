const HttpError = require("../utils/httpError");
const documentsService = require("../services/documents.service");
const {
  parseDocumentId,
  parseListQuery,
} = require("../validators/documents.validator");

// GET /api/documents
async function list(req, res, next) {
  try {
    const params = parseListQuery(req.query);
    const result = await documentsService.listDocuments(params);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /api/documents/:id
async function getById(req, res, next) {
  try {
    const id = parseDocumentId(req.params.id);
    const document = await documentsService.getDocumentById(id);
    if (!document) {
      throw new HttpError(404, "Document not found");
    }
    res.status(200).json(document);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById };

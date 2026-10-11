const HttpError = require("../utils/httpError");
const { parseIntParam, parseOptionalString } = require("../utils/validators");

const STATUSES = ["con_hieu_luc", "het_hieu_luc", "sap_hieu_luc"];

function parseDocumentId(value) {
  return parseIntParam(value, "id");
}

// Đọc và kiểm tra query string của GET /documents.
function parseListQuery(query) {
  const search = parseOptionalString(query.search, "search", 200);

  let taxType = parseOptionalString(query.tax_type, "tax_type", 20);
  if (taxType !== undefined) {
    taxType = taxType.toUpperCase();
    if (!/^[A-Z0-9_]+$/.test(taxType)) {
      throw new HttpError(400, "tax_type is invalid");
    }
  }

  const status = parseOptionalString(query.status, "status", 20);
  if (status !== undefined && !STATUSES.includes(status)) {
    throw new HttpError(400, `status must be one of: ${STATUSES.join(", ")}`);
  }

  const page = parseIntParam(query.page, "page", {
    min: 1,
    max: 100000,
    defaultValue: 1,
  });
  const pageSize = parseIntParam(query.page_size, "page_size", {
    min: 1,
    max: 50,
    defaultValue: 10,
  });

  return { search, taxType, status, page, pageSize };
}

module.exports = { parseDocumentId, parseListQuery };

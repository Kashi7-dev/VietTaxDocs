const db = require("../config/db");

// Các cột trả về cho danh sách (khớp schema LegalDocument trong contract).
const LIST_COLUMNS = [
  "d.id",
  "d.document_number",
  "d.title",
  "d.document_type",
  "d.issue_date",
  "d.effective_date",
  "d.status",
  "d.pdf_url",
  "d.source_url",
];

// Gắn các điều kiện lọc. Dùng cho cả truy vấn đếm lẫn truy vấn lấy dữ liệu để hai bên luôn khớp nhau.
function applyFilters(query, { search, taxType, status }) {
  if (search) {
    // websearch_to_tsquery: nhiều từ khóa được hiểu là AND, ví dụ "cá nhân quý 4 2025".
    // Giá trị truyền qua dấu ? nên an toàn trước SQL injection.
    query.whereRaw("d.search_vector @@ websearch_to_tsquery('simple', ?)", [
      search,
    ]);
  }
  if (status) {
    query.where("d.status", status);
  }
  if (taxType) {
    query.whereExists(function () {
      this.select(db.raw("1"))
        .from("document_tax_types as dtt")
        .join("tax_types as t", "t.id", "dtt.tax_type_id")
        .whereRaw("dtt.document_id = d.id")
        .where("t.code", taxType);
    });
  }
  return query;
}

async function listDocuments(params) {
  const { page, pageSize } = params;

  const countRow = await applyFilters(db("legal_documents as d"), params)
    .count({ count: "*" })
    .first();
  const total = Number(countRow.count);

  const data = await applyFilters(db("legal_documents as d"), params)
    .select(LIST_COLUMNS)
    .orderBy([
      { column: "d.issue_date", order: "desc" },
      { column: "d.id", order: "desc" },
    ])
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, total, page, page_size: pageSize };
}

// Trả về null nếu không tìm thấy.
async function getDocumentById(id) {
  const row = await db("legal_documents as d")
    .leftJoin("issuing_agencies as a", "a.id", "d.issuing_agency_id")
    .where("d.id", id)
    .first(
      "d.id",
      "d.document_number",
      "d.title",
      "d.document_type",
      "d.issue_date",
      "d.effective_date",
      "d.expiry_date",
      "d.status",
      "d.content",
      "d.pdf_url",
      "d.source_url",
      "d.source_type",
      "d.created_at",
      "d.updated_at",
      "a.id as agency_id",
      "a.name as agency_name",
      "a.website_url as agency_website_url",
    );

  if (!row) return null;

  const taxTypes = await db("document_tax_types as dtt")
    .join("tax_types as t", "t.id", "dtt.tax_type_id")
    .where("dtt.document_id", id)
    .select("t.id", "t.code", "t.name")
    .orderBy("t.code");

  const { agency_id, agency_name, agency_website_url, ...document } = row;

  return {
    ...document,
    issuing_agency: agency_id
      ? { id: agency_id, name: agency_name, website_url: agency_website_url }
      : null,
    tax_types: taxTypes,
  };
}

module.exports = { listDocuments, getDocumentById };

const db = require("../config/db");

const MAX_NOTIFICATIONS = 100;

// Thông báo của một người dùng, mới nhất trước, kèm thông tin văn bản.
async function listForUser(userId) {
  const rows = await db("notifications as n")
    .join("legal_documents as d", "d.id", "n.document_id")
    .where("n.user_id", userId)
    .orderBy([
      { column: "n.created_at", order: "desc" },
      { column: "n.id", order: "desc" },
    ])
    .limit(MAX_NOTIFICATIONS)
    .select(
      "n.id as notification_id",
      "n.is_read",
      "n.created_at",
      "d.id as document_id",
      "d.document_number",
      "d.title",
      "d.document_type",
      "d.issue_date",
      "d.effective_date",
      "d.status",
      "d.pdf_url",
      "d.source_url",
    );

  return rows.map((row) => ({
    id: row.notification_id,
    document: {
      id: row.document_id,
      document_number: row.document_number,
      title: row.title,
      document_type: row.document_type,
      issue_date: row.issue_date,
      effective_date: row.effective_date,
      status: row.status,
      pdf_url: row.pdf_url,
      source_url: row.source_url,
    },
    is_read: row.is_read,
    created_at: row.created_at,
  }));
}

module.exports = { listForUser };

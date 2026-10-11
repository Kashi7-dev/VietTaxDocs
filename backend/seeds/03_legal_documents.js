// Văn bản MẪU để kiểm thử API và giao diện. Đây KHÔNG phải văn bản pháp luật thật:
// số hiệu bắt đầu bằng "MAU-" và tiêu đề có "[MẪU]" để dễ nhận ra và xóa sau này.
// Không chèn cột search_vector vì đây là cột tự sinh.
exports.seed = async function (knex) {
  const agencies = await knex("issuing_agencies").select("id", "name");
  const agencyId = Object.fromEntries(agencies.map((a) => [a.name, a.id]));

  const taxTypes = await knex("tax_types").select("id", "code");
  const taxTypeId = Object.fromEntries(taxTypes.map((t) => [t.code, t.id]));

  const documents = [
    {
      document_number: "MAU-01/2025/TT-BTC",
      title: "[MẪU] Thông tư hướng dẫn quyết toán thuế thu nhập cá nhân",
      document_type: "thong_tu",
      issuing_agency_id: agencyId["Bộ Tài chính"],
      issue_date: "2025-03-01",
      effective_date: "2025-04-15",
      expiry_date: null,
      status: "con_hieu_luc",
      content:
        "Nội dung mẫu để kiểm thử tìm kiếm. Từ khóa: cá nhân, quyết toán thuế, quý 4, năm 2025.",
      source_url: "https://example.com/mau-01",
      source_type: "admin_manual",
      taxes: ["TNCN"],
    },
    {
      document_number: "MAU-02/2025/NĐ-CP",
      title: "[MẪU] Nghị định quy định chi tiết về thuế giá trị gia tăng",
      document_type: "nghi_dinh",
      issuing_agency_id: agencyId["Chính phủ"],
      issue_date: "2025-05-10",
      effective_date: "2025-07-01",
      expiry_date: null,
      status: "con_hieu_luc",
      content:
        "Nội dung mẫu về thuế giá trị gia tăng, kê khai theo tháng hoặc theo quý.",
      source_url: "https://example.com/mau-02",
      source_type: "admin_manual",
      taxes: ["GTGT"],
    },
    {
      document_number: "MAU-03/2020/QH14",
      title: "[MẪU] Luật thuế thu nhập doanh nghiệp (đã hết hiệu lực)",
      document_type: "luat",
      issuing_agency_id: agencyId["Quốc hội"],
      issue_date: "2019-11-20",
      effective_date: "2020-01-01",
      expiry_date: "2024-12-31",
      status: "het_hieu_luc",
      content:
        "Nội dung mẫu của một văn bản đã hết hiệu lực, dùng để kiểm thử bộ lọc.",
      source_url: "https://example.com/mau-03",
      source_type: "admin_manual",
      taxes: ["TNDN"],
    },
    {
      document_number: "MAU-04/2026/TT-BTC",
      title:
        "[MẪU] Thông tư sắp có hiệu lực về thuế cá nhân và thuế giá trị gia tăng",
      document_type: "thong_tu",
      issuing_agency_id: agencyId["Bộ Tài chính"],
      issue_date: "2026-09-01",
      effective_date: "2027-01-01",
      expiry_date: null,
      status: "sap_hieu_luc",
      content:
        "Nội dung mẫu của văn bản sắp có hiệu lực, liên quan đến hai loại thuế cùng lúc.",
      source_url: "https://example.com/mau-04",
      source_type: "admin_manual",
      taxes: ["TNCN", "GTGT"],
    },
    {
      document_number: "MAU-05/2025/CV-BTC",
      title: "[MẪU] Công văn hướng dẫn về thuế tiêu thụ đặc biệt",
      document_type: "cong_van",
      issuing_agency_id: agencyId["Bộ Tài chính"],
      issue_date: "2025-08-20",
      effective_date: "2025-08-20",
      expiry_date: null,
      status: "con_hieu_luc",
      content: "Nội dung mẫu của một công văn hướng dẫn.",
      source_url: "https://example.com/mau-05",
      source_type: "admin_manual",
      taxes: ["TTDB"],
    },
  ];

  // Chỉ chèn văn bản chưa có (tránh phụ thuộc vào ràng buộc UNIQUE).
  const existingNumbers =
    await knex("legal_documents").pluck("document_number");
  const missing = documents.filter(
    (d) => !existingNumbers.includes(d.document_number),
  );

  if (missing.length > 0) {
    await knex("legal_documents").insert(
      missing.map(({ taxes, ...document }) => document),
    );
  }

  // Gắn văn bản với loại thuế (bảng nhiều-nhiều). Khóa chính kép giúp bỏ qua bản ghi trùng.
  const rows = await knex("legal_documents").select("id", "document_number");
  const documentId = Object.fromEntries(
    rows.map((r) => [r.document_number, r.id]),
  );

  const links = documents.flatMap((d) =>
    d.taxes.map((code) => ({
      document_id: documentId[d.document_number],
      tax_type_id: taxTypeId[code],
    })),
  );

  await knex("document_tax_types")
    .insert(links)
    .onConflict(["document_id", "tax_type_id"])
    .ignore();
};

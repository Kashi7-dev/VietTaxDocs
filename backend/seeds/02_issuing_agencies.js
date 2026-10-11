// Dữ liệu mẫu cho bảng issuing_agencies.
// Bảng này chưa có ràng buộc UNIQUE trên "name" nên không dùng onConflict được.
// Thay vào đó: lấy tên đã có, chỉ chèn những cơ quan còn thiếu (chạy lại vẫn an toàn).
// Lưu ý: tên cơ quan và địa chỉ website có thể thay đổi, hãy kiểm tra lại khi nhập dữ liệu thật.
exports.seed = async function (knex) {
  const agencies = [
    { name: "Quốc hội", website_url: "https://quochoi.vn" },
    { name: "Chính phủ", website_url: "https://chinhphu.vn" },
    { name: "Bộ Tài chính", website_url: "https://mof.gov.vn" },
  ];

  const existingNames = await knex("issuing_agencies").pluck("name");
  const missing = agencies.filter((a) => !existingNames.includes(a.name));

  if (missing.length > 0) {
    await knex("issuing_agencies").insert(missing);
  }
};

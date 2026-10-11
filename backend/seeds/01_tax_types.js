// Dữ liệu mẫu cho bảng tax_types.
// Chạy lại nhiều lần vẫn an toàn: trùng "code" thì cập nhật thay vì chèn thêm.
exports.seed = async function (knex) {
  await knex("tax_types")
    .insert([
      {
        code: "TNCN",
        name: "Thuế thu nhập cá nhân",
        description: "Thuế đánh trên thu nhập chịu thuế của cá nhân.",
      },
      {
        code: "TNDN",
        name: "Thuế thu nhập doanh nghiệp",
        description: "Thuế đánh trên thu nhập chịu thuế của doanh nghiệp.",
      },
      {
        code: "GTGT",
        name: "Thuế giá trị gia tăng",
        description: "Thuế đánh trên giá trị tăng thêm của hàng hóa, dịch vụ.",
      },
      {
        code: "TTDB",
        name: "Thuế tiêu thụ đặc biệt",
        description: "Thuế đánh trên một số hàng hóa, dịch vụ đặc biệt.",
      },
      {
        code: "XNK",
        name: "Thuế xuất khẩu, thuế nhập khẩu",
        description: "Thuế đối với hàng hóa xuất khẩu, nhập khẩu.",
      },
      {
        code: "BVMT",
        name: "Thuế bảo vệ môi trường",
        description:
          "Thuế đánh trên một số hàng hóa gây tác động xấu đến môi trường.",
      },
    ])
    .onConflict("code")
    .merge(["name", "description"]);
};

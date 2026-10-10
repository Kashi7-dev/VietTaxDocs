exports.up = async function (knex) {
  await knex.raw(`
    CREATE TYPE document_type_enum AS ENUM ('luat', 'nghi_dinh', 'thong_tu', 'cong_van', 'quyet_dinh');
    CREATE TYPE document_status_enum AS ENUM ('con_hieu_luc', 'het_hieu_luc', 'sap_hieu_luc');
    CREATE TYPE relation_type_enum AS ENUM ('sua_doi', 'thay_the', 'huong_dan', 'bai_bo');
    CREATE TYPE source_type_enum AS ENUM ('admin_manual', 'crawler');
    CREATE TYPE crawl_status_enum AS ENUM ('pending_review', 'normalized', 'rejected', 'duplicate');
  `);
};

exports.down = async function (knex) {
  await knex.raw(`
-- xóa kiểu ENUM an toàn
    DROP TYPE IF EXISTS document_type_enum;
    DROP TYPE IF EXISTS document_status_enum;
    DROP TYPE IF EXISTS relation_type_enum;
    DROP TYPE IF EXISTS source_type_enum;
    DROP TYPE IF EXISTS crawl_status_enum;
  `);
};

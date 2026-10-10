exports.up = async function (knex) {
  await knex.raw(`
    CREATE TABLE legal_documents (
        id                SERIAL PRIMARY KEY,
        document_number   VARCHAR(100) NOT NULL UNIQUE,   -- số hiệu văn bản, không được trùng
        title             VARCHAR(500) NOT NULL,
        document_type     document_type_enum NOT NULL,
        issuing_agency_id INT REFERENCES issuing_agencies(id),
        issue_date        DATE NOT NULL,
        effective_date    DATE,
        expiry_date       DATE,
        status            document_status_enum NOT NULL DEFAULT 'con_hieu_luc',
        content           TEXT NOT NULL,                  -- toàn văn (hoặc tóm tắt, tuỳ scope)
        pdf_url           VARCHAR(500),                   -- link file PDF để tải về
        source_url        VARCHAR(500),                   -- nguồn gốc, public cho user xem
        source_type       source_type_enum NOT NULL,
        created_by        INT,                            -- khóa ngoại sang users sẽ thêm ở migration tạo users
        created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),  -- app phải tự cập nhật khi sửa
        search_vector     tsvector GENERATED ALWAYS AS (
            to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(content, ''))
        ) STORED,
        CONSTRAINT chk_doc_dates
            CHECK (expiry_date IS NULL OR effective_date IS NULL OR expiry_date >= effective_date)
    );

    CREATE INDEX idx_documents_search     ON legal_documents USING GIN (search_vector);
    CREATE INDEX idx_documents_status     ON legal_documents (status);
    CREATE INDEX idx_documents_issue_date ON legal_documents (issue_date DESC);
    CREATE INDEX idx_documents_agency     ON legal_documents (issuing_agency_id);

    -- Nhiều-nhiều: 1 văn bản có thể liên quan nhiều loại thuế
    CREATE TABLE document_tax_types (
        document_id INT NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
        tax_type_id INT NOT NULL REFERENCES tax_types(id),
        PRIMARY KEY (document_id, tax_type_id)
    );

    -- Phục vụ lọc văn bản theo loại thuế
    CREATE INDEX idx_doc_tax_types_tax ON document_tax_types (tax_type_id);
  `);
};

exports.down = async function (knex) {
  // Xóa ngược thứ tự tạo: bảng con trước, bảng cha sau.
  // Index và ràng buộc đi theo bảng nên không cần DROP INDEX riêng.
  await knex.raw(`
    DROP TABLE IF EXISTS document_tax_types;
    DROP TABLE IF EXISTS legal_documents;
  `);
};

exports.up = async function (knex) {
  await knex.raw(`
    CREATE TABLE tax_brackets (
        id                      SERIAL PRIMARY KEY,
        tax_type_id             INT NOT NULL REFERENCES tax_types(id),
        bracket_order           INT NOT NULL CHECK (bracket_order > 0),
        income_from             NUMERIC(15,2) NOT NULL CHECK (income_from >= 0),
        income_to               NUMERIC(15,2),               -- NULL = bậc cao nhất, không giới hạn trên
        tax_rate                NUMERIC(5,2) NOT NULL CHECK (tax_rate >= 0 AND tax_rate <= 100),
        legal_basis             VARCHAR(500),                -- căn cứ pháp lý dạng văn bản (hiển thị cho người dùng)
        legal_basis_document_id INT REFERENCES legal_documents(id) ON DELETE SET NULL,
        effective_from          DATE NOT NULL,
        effective_to            DATE,
        CONSTRAINT chk_bracket_range CHECK (income_to IS NULL OR income_to > income_from),
        CONSTRAINT chk_bracket_dates CHECK (effective_to IS NULL OR effective_to >= effective_from),
        CONSTRAINT uq_bracket UNIQUE (tax_type_id, bracket_order, effective_from)
    );
  `);
};

exports.down = async function (knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS tax_brackets;
  `);
};

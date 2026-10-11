exports.up = async function (knex) {
  await knex.raw(`
    CREATE TYPE user_role_enum AS ENUM ('user', 'admin', 'editor');

    CREATE TABLE users (
        id            SERIAL PRIMARY KEY,
        email         VARCHAR(255)   NOT NULL,
        password_hash VARCHAR(255)   NOT NULL,
        full_name     VARCHAR(255)   NOT NULL,
        role          user_role_enum NOT NULL DEFAULT 'user',
        created_at    TIMESTAMPTZ    NOT NULL DEFAULT now()
    );

    -- Email không phân biệt hoa thường: "A@x.com" và "a@x.com" là cùng một tài khoản
    CREATE UNIQUE INDEX uq_users_email_lower ON users (lower(email));

    -- Bảng users đã tồn tại nên giờ mới thêm được khóa ngoại cho legal_documents.created_by
    ALTER TABLE legal_documents
        ADD CONSTRAINT fk_documents_created_by
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
  `);
};

exports.down = async function (knex) {
  // Hoàn tác đúng thứ tự ngược: gỡ khóa ngoại, xóa bảng, rồi xóa kiểu ENUM.
  await knex.raw(`
    ALTER TABLE legal_documents DROP CONSTRAINT IF EXISTS fk_documents_created_by;
    DROP TABLE IF EXISTS users;
    DROP TYPE IF EXISTS user_role_enum;
  `);
};

exports.up = async function (knex) {
  await knex.raw(`
    CREATE TABLE notifications (
        id          SERIAL PRIMARY KEY,
        user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        document_id INT NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
        is_read     BOOLEAN NOT NULL DEFAULT FALSE,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        -- mỗi người dùng chỉ nhận một thông báo cho mỗi văn bản
        CONSTRAINT uq_notification UNIQUE (user_id, document_id)
    );

    CREATE INDEX idx_notifications_user ON notifications (user_id, is_read, created_at DESC);
  `);
};

exports.down = async function (knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS notifications;
  `);
};

CREATE TABLE tax_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,      -- VD: 'TNCN', 'TNDN', 'GTGT'
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE issuing_agencies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,             -- VD: 'Bộ Tài chính', 'Tổng cục Thuế'
    website_url VARCHAR(500)
);

CREATE TYPE document_type_enum AS ENUM ('luat', 'nghi_dinh', 'thong_tu', 'cong_van', 'quyet_dinh');
CREATE TYPE document_status_enum AS ENUM ('con_hieu_luc', 'het_hieu_luc', 'sap_hieu_luc');
CREATE TYPE relation_type_enum AS ENUM ('sua_doi', 'thay_the', 'huong_dan', 'bai_bo');
CREATE TYPE source_type_enum AS ENUM ('admin_manual', 'crawler');
CREATE TYPE crawl_status_enum AS ENUM ('pending_review', 'normalized', 'rejected', 'duplicate');
CREATE TABLE crawl_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    base_url VARCHAR(500) NOT NULL,
    crawl_frequency_hours INT DEFAULT 24,
    last_crawled_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE raw_crawled_data (
    id SERIAL PRIMARY KEY,
    crawl_source_id INT REFERENCES crawl_sources(id),
    source_url VARCHAR(500) NOT NULL,
    raw_content JSONB NOT NULL,             -- lưu nguyên HTML đã parse thô / JSON scrape được
    status crawl_status_enum DEFAULT 'pending_review',
    normalized_document_id INT NULL,        -- trỏ sang bảng chuẩn hóa sau khi admin duyệt (FK thêm sau)
    crawled_at TIMESTAMPTZ DEFAULT now(),
    reviewed_by INT NULL,                   -- admin nào duyệt (FK sang users sau)
    reviewed_at TIMESTAMPTZ
);

CREATE TABLE crawl_logs (
    id SERIAL PRIMARY KEY,
    crawl_source_id INT REFERENCES crawl_sources(id),
    started_at TIMESTAMPTZ DEFAULT now(),
    finished_at TIMESTAMPTZ,
    status VARCHAR(20),                     -- 'success' / 'failed'
    items_found INT DEFAULT 0,
    error_message TEXT
);
CREATE TABLE legal_documents (
    id SERIAL PRIMARY KEY,
    document_number VARCHAR(100) NOT NULL,   -- số hiệu văn bản
    title VARCHAR(500) NOT NULL,
    document_type document_type_enum NOT NULL,
    issuing_agency_id INT REFERENCES issuing_agencies(id),
    issue_date DATE NOT NULL,
    effective_date DATE,
    expiry_date DATE NULL,
    status document_status_enum NOT NULL DEFAULT 'con_hieu_luc',
    content TEXT NOT NULL,                   -- toàn văn (hoặc tóm tắt, tuỳ scope)
    pdf_url VARCHAR(500),                    -- link file PDF để tải về
    source_url VARCHAR(500),                 -- nguồn gốc, public cho user xem
    source_type source_type_enum NOT NULL,
    created_by INT NULL,                     -- FK sang users
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    search_vector tsvector
        GENERATED ALWAYS AS (
            to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content,''))
        ) STORED
);

CREATE INDEX idx_documents_search ON legal_documents USING GIN (search_vector);
CREATE INDEX idx_documents_status ON legal_documents (status);
CREATE INDEX idx_documents_dates ON legal_documents (issue_date, effective_date);

-- Nhiều-nhiều: 1 văn bản có thể liên quan nhiều loại thuế
CREATE TABLE document_tax_types (
    document_id INT REFERENCES legal_documents(id) ON DELETE CASCADE,
    tax_type_id INT REFERENCES tax_types(id),
    PRIMARY KEY (document_id, tax_type_id)
);

-- Cây quan hệ văn bản (gốc -> nghị định -> thông tư hướng dẫn)
CREATE TABLE document_relations (
    id SERIAL PRIMARY KEY,
    source_document_id INT REFERENCES legal_documents(id) ON DELETE CASCADE,
    related_document_id INT REFERENCES legal_documents(id) ON DELETE CASCADE,
    relation_type relation_type_enum NOT NULL,
    CHECK (source_document_id <> related_document_id)
);

-- Lịch sử chỉnh sửa nội dung (version control)
CREATE TABLE document_versions (
    id SERIAL PRIMARY KEY,
    document_id INT REFERENCES legal_documents(id) ON DELETE CASCADE,
    content_snapshot TEXT NOT NULL,
    edited_by INT NULL,
    edited_at TIMESTAMPTZ DEFAULT now()
);
CREATE TYPE user_role_enum AS ENUM ('admin', 'editor', 'user');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role user_role_enum NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    tax_type_id INT REFERENCES tax_types(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, tax_type_id)
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    document_id INT REFERENCES legal_documents(id),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE tax_brackets (
    id SERIAL PRIMARY KEY,
    tax_type_id INT REFERENCES tax_types(id),
    bracket_order INT NOT NULL,              -- bậc 1, 2, 3...
    income_from NUMERIC(15,2) NOT NULL,
    income_to NUMERIC(15,2),                 -- NULL nếu là bậc cao nhất (không giới hạn)
    tax_rate NUMERIC(5,2) NOT NULL,          -- %
    legal_basis_document_id INT REFERENCES legal_documents(id), -- căn cứ pháp lý
    effective_from DATE NOT NULL,
    effective_to DATE NULL
);

CREATE TABLE tax_calculations (
    id SERIAL PRIMARY KEY,
    user_id INT NULL REFERENCES users(id),   -- cho phép tính không cần đăng nhập
    tax_type_id INT REFERENCES tax_types(id),
    input_data JSONB NOT NULL,               -- thu nhập, giảm trừ...
    result_data JSONB NOT NULL,              -- kết quả breakdown theo bậc
    calculated_at TIMESTAMPTZ DEFAULT now()
);





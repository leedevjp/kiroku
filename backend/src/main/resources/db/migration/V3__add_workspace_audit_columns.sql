ALTER TABLE workspace
    ADD COLUMN created_by BIGINT NOT NULL,
    ADD COLUMN updated_by BIGINT NOT NULL;

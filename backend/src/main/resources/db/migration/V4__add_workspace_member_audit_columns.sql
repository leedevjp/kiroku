ALTER TABLE workspace_member
    ADD COLUMN created_by BIGINT NOT NULL,
    ADD COLUMN updated_by BIGINT NOT NULL;

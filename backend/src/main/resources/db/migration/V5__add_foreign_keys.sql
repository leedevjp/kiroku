ALTER TABLE workspace
    ADD CONSTRAINT fk_workspace_created_by FOREIGN KEY (created_by) REFERENCES "user"(id),
    ADD CONSTRAINT fk_workspace_updated_by FOREIGN KEY (updated_by) REFERENCES "user"(id);

ALTER TABLE workspace_member
    ADD CONSTRAINT fk_workspace_member_workspace_id FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_workspace_member_user_id FOREIGN KEY (user_id) REFERENCES "user"(id),
    ADD CONSTRAINT fk_workspace_member_created_by FOREIGN KEY (created_by) REFERENCES "user"(id),
    ADD CONSTRAINT fk_workspace_member_updated_by FOREIGN KEY (updated_by) REFERENCES "user"(id);

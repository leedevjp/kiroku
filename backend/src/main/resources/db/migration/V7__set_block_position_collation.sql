-- Position keys must sort in plain byte order for fractional indexing to work.
-- The database default collation sorts case differently from byte order, so pin
-- this column to the "C" collation.
ALTER TABLE block
    ALTER COLUMN position TYPE VARCHAR(64) COLLATE "C";

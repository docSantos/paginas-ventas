ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS amenidades_compartidas text[] DEFAULT '{}';

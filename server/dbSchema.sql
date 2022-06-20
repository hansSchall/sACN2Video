CREATE TABLE IF NOT EXISTS assets (id text primary key, data BLOB, mime text, size number, label text, changeId text);
CREATE TABLE IF NOT EXISTS config_universes (universe number);
CREATE TABLE IF NOT EXISTS els (id text,type text,enabled NUMBER DEFAULT 1,PRIMARY KEY(id));
CREATE TABLE IF NOT EXISTS elProps (el text, prop text, valueType text, value text);
-- CREATE TABLE IF NOT EXISTS;
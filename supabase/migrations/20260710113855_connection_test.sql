CREATE TABLE IF NOT EXISTS connection_test (
  id serial primary key,
  message text,
  created_at timestamp default now()
);

-- Insert a test row to verify
INSERT INTO connection_test (message) VALUES ('Connection successful, table created!');

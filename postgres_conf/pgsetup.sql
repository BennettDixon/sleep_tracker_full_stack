CREATE USER postgres_user WITH PASSWORD 'postgres_password';
CREATE DATABASE brandless_dev WITH OWNER postgres_user;
ALTER ROLE postgres_user SET client_encoding TO 'utf8';
ALTER ROLE postgres_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE postgres_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE brandless_dev TO postgres_user;

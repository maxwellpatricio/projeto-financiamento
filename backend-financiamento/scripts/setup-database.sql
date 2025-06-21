-- Script para configuração inicial do banco de dados
-- Execute este script após rodar o docker-compose up

-- Verificar se o banco foi criado corretamente
SELECT current_database();

-- Verificar se as tabelas foram criadas pelo Prisma
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Inserir dados de teste (opcional)
-- INSERT INTO estudantes (id, nome, sobrenome, email, senha, "createdAt", "updatedAt")
-- VALUES (
--   'test_id_123',
--   'João',
--   'Silva',
--   'joao@teste.com',
--   '$2a$12$exemplo_hash_senha',
--   NOW(),
--   NOW()
-- );

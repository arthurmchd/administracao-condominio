create database trabalho2;
use  trabalho2;
 
create table moradores(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    bloco VARCHAR(10) NOT NULL,
    apartamento VARCHAR(10) NOT NULL,
    telefone VARCHAR(15),
    email VARCHAR(100),
    status ENUM('residente', 'proprietário', 'visitante') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) NOT NULL UNIQUE,
    modelo VARCHAR(50) NOT NULL,
    cor VARCHAR(20),
    morador_id INT NOT NULL,
    box VARCHAR(10) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (morador_id) REFERENCES moradores(id)
);
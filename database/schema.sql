-- Palavras
CREATE TABLE palavras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    termo VARCHAR(100) NOT NULL,
    classe_gramatical VARCHAR(50),
    significado_denotativo TEXT,
    conotacoes TEXT,
    registro_uso VARCHAR(50),
    traducao VARCHAR(100)
);

-- Exemplos de uso
CREATE TABLE exemplos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    palavra_id INT,
    exemplo TEXT,
    contexto VARCHAR(100),
    FOREIGN KEY (palavra_id) REFERENCES palavras(id) ON DELETE CASCADE
);

-- Sinonimos
CREATE TABLE sinonimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    palavra_id INT,
    sinonimo VARCHAR(100),
    FOREIGN KEY (palavra_id) REFERENCES palavras(id) ON DELETE CASCADE
);

-- Antonimos
CREATE TABLE antonimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    palavra_id INT,
    antonimo VARCHAR(100),
    FOREIGN KEY (palavra_id) REFERENCES palavras(id) ON DELETE CASCADE
);

-- Familia de palavras
CREATE TABLE familia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    palavra_id INT,
    termo_relacionado VARCHAR(100),
    FOREIGN KEY (palavra_id) REFERENCES palavras(id) ON DELETE CASCADE
);

-- Etimologias
CREATE TABLE etimologias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    palavra_id INT,
    origem TEXT,
    FOREIGN KEY (palavra_id) REFERENCES palavras(id) ON DELETE CASCADE
);

-- Curiosidades
CREATE TABLE curiosidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    palavra_id INT,
    detalhe TEXT,
    FOREIGN KEY (palavra_id) REFERENCES palavras(id) ON DELETE CASCADE
);

-- Base de datos para Club Deportivo
-- Sistema de gestión de socios, temporadas de pileta e ingresos

CREATE DATABASE IF NOT EXISTS club_deportivo 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE club_deportivo;


-- =============================================
-- TABLA: USUARIO
-- =============================================
CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    
    INDEX idx_usuario (usuario)
);

-- =============================================
-- TABLA: SOCIO
-- =============================================
CREATE TABLE SOCIO (
    id_socio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20),
    telefono VARCHAR(20),
    email VARCHAR(150),
    fecha_alta DATE NOT NULL DEFAULT (CURRENT_DATE),
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(255),
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
    genero ENUM('MASCULINO', 'FEMENINO'),
    foto_url VARCHAR(500) COMMENT 'URL de la foto del socio en servicio externo',

    INDEX idx_dni (dni),
    INDEX idx_nombre_apellido (apellido, nombre),
    INDEX idx_estado (estado)
);

-- =============================================
-- TABLA: TEMPORADA_PILETA
-- =============================================
CREATE TABLE TEMPORADA_PILETA (
    id_temporada INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_fechas_temporada CHECK (fecha_fin > fecha_inicio),
    INDEX idx_fechas (fecha_inicio, fecha_fin)
);

-- =============================================
-- TABLA: SOCIO_TEMPORADA (Relación N:M)
-- =============================================
CREATE TABLE SOCIO_TEMPORADA (
	id_socio_temporada INT AUTO_INCREMENT PRIMARY KEY,
    id_socio INT NOT NULL,
    id_temporada INT NOT NULL,
    fecha_hora_inscripcion DATETIME NOT NULL DEFAULT (current_timestamp()),
    
    CONSTRAINT fk_socio_temporada_socio 
        FOREIGN KEY (id_socio) REFERENCES SOCIO(id_socio) 
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    CONSTRAINT fk_socio_temporada_temporada 
        FOREIGN KEY (id_temporada) REFERENCES TEMPORADA_PILETA(id_temporada) 
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    INDEX idx_temporada (id_temporada)
);

-- =============================================
-- TABLA: REGISTRO_INGRESO
-- =============================================
CREATE TABLE REGISTRO_INGRESO (
    id_ingreso INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL DEFAULT (CURRENT_DATE),
    hora_ingreso TIME NOT NULL DEFAULT (CURRENT_TIME),
    tipo_ingreso ENUM('SOCIO_CLUB', 'SOCIO_PILETA', 'NO_SOCIO') NOT NULL,
    id_socio INT NULL,
    
    CONSTRAINT fk_socio
        FOREIGN KEY (id_socio) REFERENCES SOCIO(id_socio) 
        ON DELETE SET NULL ON UPDATE CASCADE,
        
    INDEX idx_fecha (fecha),
    INDEX idx_tipo_ingreso (tipo_ingreso),
    INDEX idx_socio_fecha (id_socio, fecha)
);

-- =============================================
-- RESTRICCIONES ADICIONALES
-- =============================================

-- Evitar temporadas de pileta con fechas solapadas
DELIMITER //
CREATE TRIGGER trg_no_overlap_temporadas
BEFORE INSERT ON TEMPORADA_PILETA
FOR EACH ROW
BEGIN
    DECLARE overlap_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO overlap_count
    FROM TEMPORADA_PILETA 
    WHERE (NEW.fecha_inicio BETWEEN fecha_inicio AND fecha_fin)
       OR (NEW.fecha_fin BETWEEN fecha_inicio AND fecha_fin)
       OR (fecha_inicio BETWEEN NEW.fecha_inicio AND NEW.fecha_fin);
    
    IF overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No puede haber temporadas con fechas solapadas';
    END IF;
END //

CREATE TRIGGER trg_no_overlap_temporadas_update
BEFORE UPDATE ON TEMPORADA_PILETA
FOR EACH ROW
BEGIN
    DECLARE overlap_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO overlap_count
    FROM TEMPORADA_PILETA 
    WHERE id_temporada != NEW.id_temporada
      AND ((NEW.fecha_inicio BETWEEN fecha_inicio AND fecha_fin)
           OR (NEW.fecha_fin BETWEEN fecha_inicio AND fecha_fin)
           OR (fecha_inicio BETWEEN NEW.fecha_inicio AND NEW.fecha_fin));
    
    IF overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No puede haber temporadas con fechas solapadas';
    END IF;
END //
DELIMITER ;

-- Índices únicos para evitar múltiples ingresos el mismo día
CREATE UNIQUE INDEX idx_un_ingreso_socio_dia 
ON REGISTRO_INGRESO (fecha, id_socio);

-- =============================================
-- DATOS DE EJEMPLO
-- =============================================

-- =============================================
-- USUARIOS
-- =============================================
INSERT INTO USUARIO (usuario, password) VALUES
('admin', 'admin123'),
('recepcion', 'pass123'),
('control', 'control2025');

-- =============================================
-- SOCIOS
-- =============================================
INSERT INTO SOCIO (nombre, apellido, dni, telefono, email, fecha_nacimiento, direccion, estado, genero, foto_url) VALUES
('Juan', 'Pérez', '30111222', '1123456789', 'juan.perez@mail.com', '1990-05-14', 'Av. Siempre Viva 123', 'ACTIVO', 'MASCULINO', 'https://picsum.photos/id/1011/200'),
('María', 'Gómez', '30111333', '1134567890', 'maria.gomez@mail.com', '1988-03-22', 'Calle Falsa 456', 'ACTIVO', 'FEMENINO', 'https://picsum.photos/id/1012/200'),
('Carlos', 'López', '30111444', '1145678901', 'carlos.lopez@mail.com', '1995-07-10', 'San Martín 789', 'INACTIVO', 'MASCULINO', 'https://picsum.photos/id/1013/200'),
('Lucía', 'Fernández', '30111555', '1156789012', 'lucia.fernandez@mail.com', '2000-01-30', 'Rivadavia 321', 'ACTIVO', 'FEMENINO', 'https://picsum.photos/id/1014/200'),
('Diego', 'Martínez', '30111666', '1167890123', 'diego.martinez@mail.com', '1985-09-15', 'Mitre 654', 'ACTIVO', 'MASCULINO', 'https://picsum.photos/id/1015/200');

-- =============================================
-- TEMPORADAS DE PILETA
-- =============================================
INSERT INTO TEMPORADA_PILETA (nombre, fecha_inicio, fecha_fin, descripcion) VALUES
('Temporada Verano 2025', '2025-12-01', '2026-03-15', 'Temporada de pileta para verano 2025/2026'),
('Temporada Invierno 2025', '2025-06-01', '2025-08-31', 'Temporada de pileta climatizada invierno 2025');

-- =============================================
-- SOCIO_TEMPORADA
-- =============================================
INSERT INTO SOCIO_TEMPORADA (id_socio, id_temporada, fecha_hora_inscripcion) VALUES
(1, 1, '2025-11-15 10:00:00'),
(2, 1, '2025-11-20 11:30:00'),
(4, 2, '2025-05-20 09:15:00'),
(5, 2, '2025-05-25 17:45:00');

-- =============================================
-- REGISTRO DE INGRESOS
-- =============================================
INSERT INTO REGISTRO_INGRESO (fecha, hora_ingreso, tipo_ingreso, id_socio) VALUES
('2025-09-01', '09:10:00', 'SOCIO_CLUB', 1),
('2025-09-01', '10:05:00', 'SOCIO_CLUB', 2),
('2025-09-02', '11:30:00', 'SOCIO_PILETA', 4),
('2025-09-02', '12:00:00', 'SOCIO_CLUB', 5),
('2025-09-03', '14:00:00', 'NO_SOCIO', NULL),
('2025-09-03', '15:20:00', 'SOCIO_CLUB', 1),
('2025-09-04', '08:45:00', 'SOCIO_CLUB', 2),
('2025-09-04', '09:15:00', 'NO_SOCIO', NULL);

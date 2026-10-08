-- Limpiar tablas y reiniciar secuencias de ID
TRUNCATE TABLE favorites, posts, users RESTART IDENTITY CASCADE;

-- 1. Insertar Usuarios de Prueba (Contraseña en texto plano: password123)
INSERT INTO users (name, email, password, picture, city) VALUES
('Velas Artesanales Chile', 'contacto@velaschile.cl', '$2b$10$4y9p0eC9s5U3fM4.A7eN1.1W3z5X8Y9Z0a1b2c3d4e5f6g7h8i9j', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300', 'Peñaflor'),
('Camila Luz', 'camila.luz@example.com', '$2b$10$4y9p0eC9s5U3fM4.A7eN1.1W3z5X8Y9Z0a1b2c3d4e5f6g7h8i9j', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300', 'Santiago'),
('Aromas del Sur', 'ventas@aromasdelsur.cl', '$2b$10$4y9p0eC9s5U3fM4.A7eN1.1W3z5X8Y9Z0a1b2c3d4e5f6g7h8i9j', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300', 'Concepción');

-- 2. Insertar Publicaciones de Ejemplo
INSERT INTO posts (user_id, title, description, price, aroma_type, img_url) VALUES
(1, 'Vela Aromática de Vainilla y Canela', 'Vela hecha a mano con cera de soja 100% natural y mecha de algodón ecológico.', 7500, 'Dulcera', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600'),
(1, 'Vela Botánica de Lavanda y Salvia', 'Aroma suave a lavanda silvestre con toque de salvia.', 8900, 'Floral', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600'),
(2, 'Vela Artesanal Cítrica de Mandarina', 'Aroma fresco y energizante a mandarina y bergamota.', 6200, 'Cítrica', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600'),
(3, 'Set de Velas Aromáticas Bosque Nativo', 'Trío de velas pequeñas con aromas de pino, eucalipto y madera de cedro.', 15000, 'Amaderada', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600');

-- 3. Insertar Favoritos de Ejemplo
INSERT INTO favorites (user_id, post_id) VALUES
(1, 3),
(2, 1);

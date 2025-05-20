-- Inserir etnias
INSERT INTO etnias (nome) VALUES ('Huni Kuin') ON CONFLICT (nome) DO NOTHING;
INSERT INTO etnias (nome) VALUES ('Rapés MS') ON CONFLICT (nome) DO NOTHING;
INSERT INTO etnias (nome) VALUES ('Shanenawa') ON CONFLICT (nome) DO NOTHING;
INSERT INTO etnias (nome) VALUES ('Puyanawa') ON CONFLICT (nome) DO NOTHING;
INSERT INTO etnias (nome) VALUES ('Apurinã') ON CONFLICT (nome) DO NOTHING;
INSERT INTO etnias (nome) VALUES ('Shawadawa') ON CONFLICT (nome) DO NOTHING;
INSERT INTO etnias (nome) VALUES ('Xamânico') ON CONFLICT (nome) DO NOTHING;
INSERT INTO etnias (nome) VALUES ('Xamânico S/ Tabaco') ON CONFLICT (nome) DO NOTHING;
INSERT INTO etnias (nome) VALUES ('Kuntanawa') ON CONFLICT (nome) DO NOTHING;
INSERT INTO etnias (nome) VALUES ('Katukina') ON CONFLICT (nome) DO NOTHING;
INSERT INTO etnias (nome) VALUES ('Nukini') ON CONFLICT (nome) DO NOTHING;
INSERT INTO etnias (nome) VALUES ('Yawanawa') ON CONFLICT (nome) DO NOTHING;

-- Inserir tipos para Huni Kuin
DO $$
DECLARE
    etnia_id INTEGER;
BEGIN
    SELECT id INTO etnia_id FROM etnias WHERE nome = 'Huni Kuin';
    
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('BAIMUKA', etnia_id, 'RAHK01') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CACAU', etnia_id, 'RAHK02') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CANELA DE VELHO', etnia_id, 'RAHK03') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CAMPEMBA', etnia_id, 'RAHK04') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CUMARU', etnia_id, 'RAHK05') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CUMARU DE CHEIRO', etnia_id, 'RAHK06') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('EMBURANA', etnia_id, 'RAHK07') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('IBAN', etnia_id, 'RAHK08') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MURICI', etnia_id, 'RAHK09') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('7 ERVAS', etnia_id, 'RAHK10') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('XACAPANDARÉ', etnia_id, 'RAHK11') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('XIPÃO', etnia_id, 'RAHK12') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MULATEIRO', etnia_id, 'RAHK13') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('TSUNU', etnia_id, 'RAHK14') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('RAINHA DA FLORESTA', etnia_id, 'RAHK15') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('TRADIÇÃO', etnia_id, 'RAHK16') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('UXI', etnia_id, 'RAHK17') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('NINAWAS', etnia_id, 'RAHK18') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('LOURINHO', etnia_id, 'RAHK19') ON CONFLICT (nome, etnia_id) DO NOTHING;
END $$;

-- Inserir tipos para Rapés MS
DO $$
DECLARE
    etnia_id INTEGER;
BEGIN
    SELECT id INTO etnia_id FROM etnias WHERE nome = 'Rapés MS';
    
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('BOBINSANA', etnia_id, 'RAMS01') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CANELA', etnia_id, 'RAMS02') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CLASSIC YOPO', etnia_id, 'RAMS03') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('GUARANA', etnia_id, 'RAMS04') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('HERBAL', etnia_id, 'RAMS05') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('JUREMA', etnia_id, 'RAMS06') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('LOURINHO', etnia_id, 'RAMS07') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MULUNGU', etnia_id, 'RAMS08') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PASSIFLORA', etnia_id, 'RAMS09') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PAU PEREIRA', etnia_id, 'RAMS10') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('SPIRITUAL CLEANSE', etnia_id, 'RAMS11') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('SANANGA', etnia_id, 'RAMS12') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('WARRIOR', etnia_id, 'RAMS13') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('EUCALIPTO', etnia_id, 'RAMS14') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('BAUNILHA', etnia_id, 'RAMS15') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MANGA', etnia_id, 'RAMS16') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CHACRONA', etnia_id, 'RAMS17') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('GUAYUSA', etnia_id, 'RAMS18') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MULATEIRO', etnia_id, 'RAMS19') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('VEIA DE PAJE', etnia_id, 'RAMS20') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CUMARU', etnia_id, 'RAMS21') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('COPAIBA', etnia_id, 'RAMS22') ON CONFLICT (nome, etnia_id) DO NOTHING;
END $$;

-- Inserir tipos para Shanenawa
DO $$
DECLARE
    etnia_id INTEGER;
BEGIN
    SELECT id INTO etnia_id FROM etnias WHERE nome = 'Shanenawa';
    
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CANELEIRO', etnia_id, 'RASN01') ON CONFLICT (nome, etnia_id) DO NOTHING;
END $$;

-- Inserir tipos para Puyanawa
DO $$
DECLARE
    etnia_id INTEGER;
BEGIN
    SELECT id INTO etnia_id FROM etnias WHERE nome = 'Puyanawa';
    
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('JAGUBE', etnia_id, 'RAPU01') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PIXURI', etnia_id, 'RAPU02') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MURICI', etnia_id, 'RAPU03') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('LOURINHO', etnia_id, 'RAPU04') ON CONFLICT (nome, etnia_id) DO NOTHING;
END $$;

-- Inserir tipos para Apurinã
DO $$
DECLARE
    etnia_id INTEGER;
BEGIN
    SELECT id INTO etnia_id FROM etnias WHERE nome = 'Apurinã';
    
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('AWIRY CLAUDIO', etnia_id, 'RAAP01') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('AWIRY JOÃO BOSCO', etnia_id, 'RAAP02') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('SHAWADAWA', etnia_id, 'RAAP03') ON CONFLICT (nome, etnia_id) DO NOTHING;
END $$;

-- Inserir tipos para Shawadawa
DO $$
DECLARE
    etnia_id INTEGER;
BEGIN
    SELECT id INTO etnia_id FROM etnias WHERE nome = 'Shawadawa';
    
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('KAPAYUBA', etnia_id, 'RASD01') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MARIRI', etnia_id, 'RASD02') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PUTUVI', etnia_id, 'RASD03') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('RAUTI', etnia_id, 'RASD04') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('RAWAPUTU', etnia_id, 'RASD05') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('RUPUSUTI', etnia_id, 'RASD06') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CATINGA (Relax)', etnia_id, 'RASD07') ON CONFLICT (nome, etnia_id) DO NOTHING;
END $$;

-- Inserir tipos para Xamânico
DO $$
DECLARE
    etnia_id INTEGER;
BEGIN
    SELECT id INTO etnia_id FROM etnias WHERE nome = 'Xamânico';
    
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('AMAZONAS', etnia_id, 'RASC01') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('DOURADO', etnia_id, 'RASC02') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('HAUX HAUX', etnia_id, 'RASC03') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MENTA', etnia_id, 'RASC04') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PARICÁ', etnia_id, 'RASC05') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('ESPIRITUAL', etnia_id, 'RASC06') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('TONKÁ', etnia_id, 'RASC07') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('TSUNU EXTRA', etnia_id, 'RASC08') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('TSUNU NATIVO', etnia_id, 'RASC09') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('TSUNU FORÇA', etnia_id, 'RASC10') ON CONFLICT (nome, etnia_id) DO NOTHING;
END $$;

-- Inserir tipos para Xamânico S/ Tabaco
DO $$
DECLARE
    etnia_id INTEGER;
BEGIN
    SELECT id INTO etnia_id FROM etnias WHERE nome = 'Xamânico S/ Tabaco';
    
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('LIMPEZA ASTRAL', etnia_id, 'RASC11') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('HAUX HAUX', etnia_id, 'RASC12') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('ESPIRITUAL', etnia_id, 'RASC13') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PARICÁ EXTRA FORTE', etnia_id, 'RASC14') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MENTA', etnia_id, 'RASC15') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('TONKÁ', etnia_id, 'RASC16') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PARICÁ EXTRA FORTE', etnia_id, 'RASC17') ON CONFLICT (nome, etnia_id) DO NOTHING;
END $$;

-- Inserir tipos para Kuntanawa
DO $$
DECLARE
    etnia_id INTEGER;
BEGIN
    SELECT id INTO etnia_id FROM etnias WHERE nome = 'Kuntanawa';
    
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('ALFAVACA DA MATA', etnia_id, 'RAKU01') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('APUXURI', etnia_id, 'RAKU02') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('AYARAPÉ', etnia_id, 'RAKU03') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CANELA DE VELHO', etnia_id, 'RAKU04') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CAPIM SANTO', etnia_id, 'RAKU05') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('COPAÍBA', etnia_id, 'RAKU06') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('JARINA', etnia_id, 'RAKU07') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('JATOBÁ', etnia_id, 'RAKU08') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('KAPAXAMBA', etnia_id, 'RAKU09') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MENTA', etnia_id, 'RAKU10') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('NIXPU', etnia_id, 'RAKU11') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('SAMAUMA', etnia_id, 'RAKU12') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('SANANGA', etnia_id, 'RAKU13') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('SANIXI', etnia_id, 'RAKU14') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('VEIA DE PAJÉ', etnia_id, 'RAKU15') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('YUNU', etnia_id, 'RAKU16') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('TETE PAWÃ', etnia_id, 'RAKU17') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CUMARU', etnia_id, 'RAKU18') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CUMARU TREVO', etnia_id, 'RAKU19') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('FLOR DE SAMAUMA', etnia_id, 'RAKU20') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PRÓPOLIS', etnia_id, 'RAKU21') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('YRU KAWA', etnia_id, 'RAKU22') ON CONFLICT (nome, etnia_id) DO NOTHING;
END $$;

-- Inserir tipos para Katukina
DO $$
DECLARE
    etnia_id INTEGER;
BEGIN
    SELECT id INTO etnia_id FROM etnias WHERE nome = 'Katukina';
    
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CACTUS', etnia_id, 'RAKA01') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CUMARU (Sonhos SG)', etnia_id, 'RAKA02') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('EUCALIPTO', etnia_id, 'RAKA03') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('NISSURAL', etnia_id, 'RAKA04') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('TSUNU', etnia_id, 'RAKA05') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MENTA', etnia_id, 'RAKA06') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PARICA', etnia_id, 'RAKA07') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MULUNGU', etnia_id, 'RAKA08') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CANELEIRO', etnia_id, 'RAKA09') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MULATEIRO', etnia_id, 'RAKA10') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PAU PEREIRA', etnia_id, 'RAKA11') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('SAMAUMA', etnia_id, 'RAKA12') ON CONFLICT (nome, etnia_id) DO NOTHING;
END $$;

-- Inserir tipos para Nukini
DO $$
DECLARE
    etnia_id INTEGER;
BEGIN
    SELECT id INTO etnia_id FROM etnias WHERE nome = 'Nukini';
    
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MULATA', etnia_id, 'RANU01') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CRAVINHO', etnia_id, 'RANU02') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CUMARU TREVO', etnia_id, 'RANU03') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('EUCALIPTO', etnia_id, 'RANU04') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('LOURIM (LA)', etnia_id, 'RANU05') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('ONÇA', etnia_id, 'RANU06') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PITAICA', etnia_id, 'RANU07') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('ROSA BRANCA', etnia_id, 'RANU08') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('SANSARA', etnia_id, 'RANU09') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('7 ESTRELAS', etnia_id, 'RANU10') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('ELIXIR', etnia_id, 'RANU11') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PAU PEREIRA', etnia_id, 'RANU12') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PARIKA', etnia_id, 'RANU13') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('FATIMA EUCALYPTUS', etnia_id, 'RANU14') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('FATIMA CUMARU', etnia_id, 'RANU15') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('FATIMA ALFAVACA', etnia_id, 'RANU16') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('GELSINHO', etnia_id, 'RANU17') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('RAUNI', etnia_id, 'RANU18') ON CONFLICT (nome, etnia_id) DO NOTHING;
END $$;

-- Inserir tipos para Yawanawa
DO $$
DECLARE
    etnia_id INTEGER;
BEGIN
    SELECT id INTO etnia_id FROM etnias WHERE nome = 'Yawanawa';
    
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('ESPERANZA', etnia_id, 'RAYA01') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('FORÇA FEMININA', etnia_id, 'RAYA02') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('FF WAXY', etnia_id, 'RAYA03') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('KANARÔ', etnia_id, 'RAYA04') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MULATEIRO', etnia_id, 'RAYA05') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('TSUNU', etnia_id, 'RAYA06') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CACIQUE', etnia_id, 'RAYA07') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('CUMARU', etnia_id, 'RAYA08') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('TSUNU RASU', etnia_id, 'RAYA09') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('PAI NANI', etnia_id, 'RAYA10') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('BIRACI JR.', etnia_id, 'RAYA11') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('RAUNI', etnia_id, 'RAYA12') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('KAPAKURU', etnia_id, 'RAYA13') ON CONFLICT (nome, etnia_id) DO NOTHING;
    INSERT INTO tipos (nome, etnia_id, codigo) VALUES ('MEW', etnia_id, 'RAYA14') ON CONFLICT (nome, etnia_id) DO NOTHING;
END $$;

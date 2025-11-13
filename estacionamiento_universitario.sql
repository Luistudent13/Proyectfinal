-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: estacionamiento_universitario
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asignacion_cajones`
--

DROP TABLE IF EXISTS `asignacion_cajones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignacion_cajones` (
  `ID_Asignacion` int NOT NULL AUTO_INCREMENT,
  `ID_Cajon` int NOT NULL,
  `ID_Vehiculo` int DEFAULT NULL,
  PRIMARY KEY (`ID_Asignacion`),
  KEY `ID_Cajon` (`ID_Cajon`),
  KEY `ID_Vehiculo` (`ID_Vehiculo`),
  CONSTRAINT `asignacion_cajones_ibfk_1` FOREIGN KEY (`ID_Cajon`) REFERENCES `cajones_estacionamiento` (`ID_Cajon`),
  CONSTRAINT `asignacion_cajones_ibfk_2` FOREIGN KEY (`ID_Vehiculo`) REFERENCES `vehiculos` (`ID_Vehiculo`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignacion_cajones`
--

LOCK TABLES `asignacion_cajones` WRITE;
/*!40000 ALTER TABLE `asignacion_cajones` DISABLE KEYS */;
/*!40000 ALTER TABLE `asignacion_cajones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cajones_estacionamiento`
--

DROP TABLE IF EXISTS `cajones_estacionamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cajones_estacionamiento` (
  `ID_Cajon` int NOT NULL AUTO_INCREMENT,
  `ID_Estado` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID_Cajon`),
  KEY `ID_Estado` (`ID_Estado`),
  CONSTRAINT `cajones_estacionamiento_ibfk_1` FOREIGN KEY (`ID_Estado`) REFERENCES `estados_cajones` (`ID_Estado`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cajones_estacionamiento`
--

LOCK TABLES `cajones_estacionamiento` WRITE;
/*!40000 ALTER TABLE `cajones_estacionamiento` DISABLE KEYS */;
INSERT INTO `cajones_estacionamiento` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `cajones_estacionamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discapacidad_vehiculos`
--

DROP TABLE IF EXISTS `discapacidad_vehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discapacidad_vehiculos` (
  `ID_Discapacidad` int NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(100) NOT NULL,
  PRIMARY KEY (`ID_Discapacidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discapacidad_vehiculos`
--

LOCK TABLES `discapacidad_vehiculos` WRITE;
/*!40000 ALTER TABLE `discapacidad_vehiculos` DISABLE KEYS */;
/*!40000 ALTER TABLE `discapacidad_vehiculos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados_cajones`
--

DROP TABLE IF EXISTS `estados_cajones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados_cajones` (
  `ID_Estado` int NOT NULL AUTO_INCREMENT,
  `Estado` varchar(50) NOT NULL,
  PRIMARY KEY (`ID_Estado`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados_cajones`
--

LOCK TABLES `estados_cajones` WRITE;
/*!40000 ALTER TABLE `estados_cajones` DISABLE KEYS */;
INSERT INTO `estados_cajones` VALUES (1,'Disponible'),(2,'Ocupado'),(3,'Reservado'),(4,'Mantenimiento'),(5,'Bloqueado');
/*!40000 ALTER TABLE `estados_cajones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marca_vehiculos`
--

DROP TABLE IF EXISTS `marca_vehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marca_vehiculos` (
  `ID_Marca` int NOT NULL AUTO_INCREMENT,
  `Marca` varchar(50) NOT NULL,
  PRIMARY KEY (`ID_Marca`),
  UNIQUE KEY `ux_marca_vehiculos_marca` (`Marca`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marca_vehiculos`
--

LOCK TABLES `marca_vehiculos` WRITE;
/*!40000 ALTER TABLE `marca_vehiculos` DISABLE KEYS */;
INSERT INTO `marca_vehiculos` VALUES (34,'Acura'),(43,'Alfa Romeo'),(16,'Audi'),(53,'Baic'),(14,'BMW'),(72,'Bugatti'),(31,'Buick'),(49,'BYD'),(32,'Cadillac'),(51,'Changan'),(58,'Chery'),(3,'Chevrolet'),(21,'Chrysler'),(74,'Cupra'),(42,'Daewoo'),(63,'Datsun'),(18,'Dodge'),(59,'Dongfeng'),(60,'FAW'),(24,'Fiat'),(8,'Ford'),(56,'Foton'),(55,'Geely'),(65,'Gene i '),(20,'GMC'),(57,'Great Wall'),(2,'Honda'),(47,'Hummer'),(12,'Hyundai'),(35,'Infiniti'),(37,'Isuzu'),(52,'JAC'),(44,'Jaguar'),(17,'Jeep'),(13,'Kia'),(70,'Koenigsegg'),(45,'Land Rover'),(36,'Lexu '),(61,'Lifan'),(33,'Lincoln'),(11,'Mazda'),(73,'McLaren'),(4,'Mercedes-Benz'),(50,'MG'),(25,'Mini'),(27,'Mitsubishi'),(9,'Nissan'),(39,'Opel'),(71,'Pagani'),(22,'Peugeot'),(38,'Pontiac'),(66,'Proton'),(19,'Ram'),(23,'Renault'),(67,'Rover'),(41,'Saab'),(64,'Scion'),(29,'SEAT'),(62,'SEMCORP'),(69,'Skoda'),(40,'Smart'),(30,'Subaru'),(28,'Suzuki'),(68,'Tata'),(46,'Tesla'),(1,'Toyota'),(10,'Volkswagen'),(26,'Volvo'),(54,'Zotye');
/*!40000 ALTER TABLE `marca_vehiculos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registros_acceso`
--

DROP TABLE IF EXISTS `registros_acceso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registros_acceso` (
  `ID_Acceso` int NOT NULL AUTO_INCREMENT,
  `ID_Vehiculo` int NOT NULL,
  `ID_Usuario` int NOT NULL,
  `Fecha_Registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Hora_Entrada` time NOT NULL,
  `Hora_Salida` time DEFAULT NULL,
  `Fecha_Acceso` date NOT NULL,
  PRIMARY KEY (`ID_Acceso`),
  KEY `ID_Vehiculo` (`ID_Vehiculo`),
  KEY `ID_Usuario` (`ID_Usuario`),
  CONSTRAINT `registros_acceso_ibfk_1` FOREIGN KEY (`ID_Vehiculo`) REFERENCES `vehiculos` (`ID_Vehiculo`) ON DELETE CASCADE,
  CONSTRAINT `registros_acceso_ibfk_2` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuarios` (`ID_Usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registros_acceso`
--

LOCK TABLES `registros_acceso` WRITE;
/*!40000 ALTER TABLE `registros_acceso` DISABLE KEYS */;
INSERT INTO `registros_acceso` VALUES (29,104,139,'2025-09-07 18:20:19','18:20:19','18:20:30','2025-09-07'),(30,105,140,'2025-11-12 19:03:59','19:03:59','19:04:05','2025-11-13'),(31,105,140,'2025-11-12 19:34:48','19:34:48',NULL,'2025-11-13'),(32,121,157,'2025-11-12 22:59:14','22:59:14','23:21:27','2025-11-13'),(33,121,157,'2025-11-12 23:41:51','23:41:51','23:42:01','2025-11-13');
/*!40000 ALTER TABLE `registros_acceso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reportes`
--

DROP TABLE IF EXISTS `reportes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportes` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Tipo_Usuario` varchar(100) NOT NULL,
  `Problema` text NOT NULL,
  `Fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reportes`
--

LOCK TABLES `reportes` WRITE;
/*!40000 ALTER TABLE `reportes` DISABLE KEYS */;
INSERT INTO `reportes` VALUES (1,'Luis','Alumno','vpnrijner','2025-06-01 21:10:49'),(2,'ergaer','erg','etjy','2025-06-01 21:11:17'),(3,'Diana Paola Perez Espindoola','Alumna','Me dieron un rosón mendigo','2025-06-02 16:50:22'),(4,'Juan Luis','Alumno','Me dieron un llegue','2025-06-03 02:18:23');
/*!40000 ALTER TABLE `reportes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_usuario`
--

DROP TABLE IF EXISTS `tipo_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_usuario` (
  `ID_Tipo_Usuario` int NOT NULL AUTO_INCREMENT,
  `Rol` varchar(50) NOT NULL,
  PRIMARY KEY (`ID_Tipo_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_usuario`
--

LOCK TABLES `tipo_usuario` WRITE;
/*!40000 ALTER TABLE `tipo_usuario` DISABLE KEYS */;
INSERT INTO `tipo_usuario` VALUES (1,'Administrador'),(2,'Alumno'),(3,'Empleado'),(4,'Visitante'),(5,'Temporal');
/*!40000 ALTER TABLE `tipo_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `ID_Usuario` int NOT NULL AUTO_INCREMENT,
  `Nombre_Completo` varchar(100) NOT NULL,
  `ID_Tipo_Usuario` int NOT NULL,
  `Matricula` varchar(20) DEFAULT NULL,
  `Correo` varchar(100) DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `Fecha_Registro` date NOT NULL DEFAULT (curdate()),
  `Horario` time DEFAULT NULL,
  `Hora_Salida` time DEFAULT NULL,
  `Licenciatura` varchar(100) DEFAULT NULL,
  `Persona_Recoge` varchar(100) DEFAULT NULL,
  `Relacion_Estudiante` varchar(100) DEFAULT NULL,
  `Area_Empleado` varchar(100) DEFAULT NULL,
  `Evento_Asiste` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_Usuario`),
  UNIQUE KEY `Correo` (`Correo`),
  UNIQUE KEY `Matricula` (`Matricula`),
  KEY `ID_Tipo_Usuario` (`ID_Tipo_Usuario`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`ID_Tipo_Usuario`) REFERENCES `tipo_usuario` (`ID_Tipo_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (127,'VISITANTE APELLIDO',5,NULL,NULL,NULL,'2025-06-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(128,'Luis visitante Temporal',5,'TEMP-1748979803486',NULL,NULL,'2025-06-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(129,'VISITANTE APELLIDO',5,NULL,NULL,NULL,'2025-06-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(130,'Luis Fernando Aldama TEMPORAL',5,'TEMP-1748980723203',NULL,NULL,'2025-06-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(135,'Katia Lopez',4,NULL,NULL,NULL,'2025-08-27',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(136,'Katia Lopez',4,NULL,NULL,NULL,'2025-08-28',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(137,'aehsr sjstrjsr',4,NULL,NULL,NULL,'2025-08-28','16:47:00','20:47:00',NULL,NULL,NULL,NULL,'Partido'),(138,'Luis Aldama',5,'TEMP-1756848306758',NULL,NULL,'2025-09-02',NULL,NULL,NULL,'Ricardo Morales','Primo',NULL,NULL),(139,'Luis ALdama cASTRO',5,NULL,NULL,NULL,'2025-09-03',NULL,NULL,NULL,'Ricardo Morales','Primo',NULL,NULL),(140,'Luis Pruebatres Apellido tres',2,'201940023',NULL,NULL,'2025-09-04',NULL,NULL,'Ingeniería en Sistemas Computacionales',NULL,NULL,NULL,NULL),(142,'Luis Fernandodos Aldama Pruebadosttta',2,'426640000',NULL,NULL,'2025-10-15',NULL,NULL,'Actuaría',NULL,NULL,NULL,NULL),(144,'wby bbwv',2,'135123513',NULL,NULL,'2025-10-15',NULL,NULL,'Arquitectura',NULL,NULL,NULL,NULL),(146,'ALDAMITA GONZALES CABRERA',2,'201923000',NULL,NULL,'2025-10-15',NULL,NULL,'Economía',NULL,NULL,NULL,NULL),(148,'Anasl ggerr',2,'784534634',NULL,NULL,'2025-10-15',NULL,NULL,'Impuestos (Maestría)',NULL,NULL,NULL,NULL),(149,'bjhbohbo rtgjnsfthatf',2,'435735673',NULL,NULL,'2025-10-15',NULL,NULL,'Psicología',NULL,NULL,NULL,NULL),(151,'Profeprueba Apellidopreuba',3,'515',NULL,NULL,'2025-10-15',NULL,NULL,NULL,NULL,NULL,'Docente',NULL),(152,'cew fsgs',4,NULL,NULL,NULL,'2025-10-15','10:52:00','19:14:00',NULL,NULL,NULL,NULL,'Partido'),(153,'Luis Fernandodos Aldama Pruebadossh',2,'123413251',NULL,NULL,'2025-10-15',NULL,NULL,'Administración',NULL,NULL,NULL,NULL),(154,'Jose Martin Aldama Castro',2,'201940000',NULL,NULL,'2025-10-16',NULL,NULL,'Médico Cirujano',NULL,NULL,NULL,NULL),(155,'Luis Fernandodos Aldama Pruebadosttta',2,'554563675',NULL,NULL,'2025-10-17',NULL,NULL,'Médico Cirujano',NULL,NULL,NULL,NULL),(156,'Luisuno Apellidoalum',2,'122123413',NULL,NULL,'2025-11-12',NULL,NULL,'Enfermería',NULL,NULL,NULL,NULL),(157,'Luis emp',3,'434',NULL,NULL,'2025-11-12',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(158,'Luis KAcinco',5,NULL,NULL,NULL,'2025-11-12',NULL,NULL,NULL,'ag','Hijo',NULL,NULL),(159,'Luis ALdama AldamaTEMP',5,NULL,NULL,NULL,'2025-11-13',NULL,NULL,NULL,'Ricardo Morales','Comp',NULL,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_sistema`
--

DROP TABLE IF EXISTS `usuarios_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_sistema` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('ADMIN','GUARDIA') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_sistema`
--

LOCK TABLES `usuarios_sistema` WRITE;
/*!40000 ALTER TABLE `usuarios_sistema` DISABLE KEYS */;
INSERT INTO `usuarios_sistema` VALUES (1,'admin_ucc','$2b$12$OU85ECW9k0MKfWj4Exc8M.RMIjn5eJRchNW15K7tuWFwDpEkuIU5u','ADMIN',1,'2025-11-08 02:03:53'),(2,'guardia_ucc','$2b$12$OU85ECW9k0MKfWj4Exc8M.RMIjn5eJRchNW15K7tuWFwDpEkuIU5u','GUARDIA',1,'2025-11-08 02:03:53');
/*!40000 ALTER TABLE `usuarios_sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehiculos`
--

DROP TABLE IF EXISTS `vehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehiculos` (
  `ID_Vehiculo` int NOT NULL AUTO_INCREMENT,
  `ID_Usuario` int DEFAULT NULL,
  `Placa` varchar(10) NOT NULL,
  `ID_Marca` int NOT NULL,
  `Modelo` varchar(50) DEFAULT NULL,
  `Color` varchar(20) DEFAULT NULL,
  `ID_Discapacidad` int DEFAULT NULL,
  `Fecha_Registro` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`ID_Vehiculo`),
  UNIQUE KEY `Placa` (`Placa`),
  KEY `ID_Usuario` (`ID_Usuario`),
  KEY `ID_Marca` (`ID_Marca`),
  KEY `ID_Discapacidad` (`ID_Discapacidad`),
  CONSTRAINT `vehiculos_ibfk_1` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuarios` (`ID_Usuario`) ON DELETE CASCADE,
  CONSTRAINT `vehiculos_ibfk_2` FOREIGN KEY (`ID_Marca`) REFERENCES `marca_vehiculos` (`ID_Marca`),
  CONSTRAINT `vehiculos_ibfk_3` FOREIGN KEY (`ID_Discapacidad`) REFERENCES `discapacidad_vehiculos` (`ID_Discapacidad`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculos`
--

LOCK TABLES `vehiculos` WRITE;
/*!40000 ALTER TABLE `vehiculos` DISABLE KEYS */;
INSERT INTO `vehiculos` VALUES (93,127,'V52-45Y-2',1,NULL,'XQT',NULL,'2025-06-03'),(94,128,'AGARBEBG',1,NULL,'Azul',NULL,'2025-06-03'),(95,129,'WEF-WFE-C',1,NULL,'ASDVat',NULL,'2025-06-03'),(96,130,'SEGBW5',1,NULL,'WW',NULL,'2025-06-03'),(100,135,'NOY-BCQ-8',11,NULL,'Rojo',NULL,'2025-08-27'),(101,136,'33T-Q34-T',20,NULL,'Rojo',NULL,'2025-08-28'),(102,137,'SBC-Q87-T',13,NULL,'Rojo',NULL,'2025-08-28'),(103,138,'HIH-C7H-7',28,NULL,'rojo',NULL,'2025-09-02'),(104,139,'JNI-C7A-N',72,NULL,'OR',NULL,'2025-09-03'),(105,140,'ACW-SRT-E',4,NULL,'Dorado',NULL,'2025-09-04'),(107,142,'FSG-123-Y',50,NULL,'A',NULL,'2025-10-15'),(109,144,'WV4-342-4',53,NULL,'as',NULL,'2025-10-15'),(110,146,'VW4-W34-T',14,NULL,'asd',NULL,'2025-10-15'),(112,148,'AFQ-FWE-G',19,NULL,'Doradov',NULL,'2025-10-15'),(113,149,'ASD-BWV-W',60,NULL,'A',NULL,'2025-10-15'),(115,151,'VWT-4TE-R',16,NULL,'Ser',NULL,'2025-10-15'),(116,152,'DFS-EG5-Y',60,NULL,'Aaef',NULL,'2025-10-15'),(117,153,'WFT-4TF-F',19,NULL,'Doradov33',NULL,'2025-10-15'),(118,154,'256-2HQ-R',11,NULL,'azul',NULL,'2025-10-16'),(119,155,'WRW-EV6-N',53,NULL,'ve',NULL,'2025-10-17'),(120,156,'WTV-WT4-5',14,NULL,'Azulwrw',NULL,'2025-11-12'),(121,157,'SVS-ERS-4',11,NULL,'af',NULL,'2025-11-12'),(122,158,'GWV-T43-T',39,NULL,'Sdwq',NULL,'2025-11-12'),(123,159,'CF2-345-2',39,NULL,'rojo',NULL,'2025-11-13');
/*!40000 ALTER TABLE `vehiculos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-13  0:18:04

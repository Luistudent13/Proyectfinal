-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: estacionamiento_universitario
-- ------------------------------------------------------
-- Server version	8.0.41

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
  PRIMARY KEY (`ID_Marca`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marca_vehiculos`
--

LOCK TABLES `marca_vehiculos` WRITE;
/*!40000 ALTER TABLE `marca_vehiculos` DISABLE KEYS */;
INSERT INTO `marca_vehiculos` VALUES (1,'Toyota'),(2,'Honda'),(3,'Chevrolet'),(4,'Mercedes-Benz'),(5,'Toyota'),(6,'Honda'),(7,'Chevrolet'),(8,'Ford'),(9,'Nissan'),(10,'Volkswagen'),(11,'Mazda'),(12,'Hyundai'),(13,'Kia'),(14,'BMW'),(15,'Mercedes-Benz'),(16,'Audi'),(17,'Jeep'),(18,'Dodge'),(19,'Ram'),(20,'GMC'),(21,'Chrysler'),(22,'Peugeot'),(23,'Renault'),(24,'Fiat'),(25,'Mini'),(26,'Volvo'),(27,'Mitsubishi'),(28,'Suzuki'),(29,'SEAT'),(30,'Subaru'),(31,'Buick'),(32,'Cadillac'),(33,'Lincoln'),(34,'Acura'),(35,'Infiniti'),(36,'Lexus'),(37,'Isuzu'),(38,'Pontiac'),(39,'Opel'),(40,'Smart'),(41,'Saab'),(42,'Daewoo'),(43,'Alfa Romeo'),(44,'Jaguar'),(45,'Land Rover'),(46,'Tesla'),(47,'Hummer'),(48,'Peugeot'),(49,'BYD'),(50,'MG'),(51,'Changan'),(52,'JAC'),(53,'Baic'),(54,'Zotye'),(55,'Geely'),(56,'Foton'),(57,'Great Wall'),(58,'Chery'),(59,'Dongfeng'),(60,'FAW'),(61,'Lifan'),(62,'SEMCORP'),(63,'Datsun'),(64,'Scion'),(65,'Genesis'),(66,'Proton'),(67,'Rover'),(68,'Tata'),(69,'Skoda'),(70,'Koenigsegg'),(71,'Pagani'),(72,'Bugatti'),(73,'McLaren'),(74,'Cupra'),(75,'Mazda'),(76,'Mazda'),(77,'Chevrolet'),(78,'Mazda');
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
  `Hora_Entrada` datetime NOT NULL,
  `Hora_Salida` datetime DEFAULT NULL,
  `Fecha_Acceso` date NOT NULL,
  PRIMARY KEY (`ID_Acceso`),
  KEY `ID_Vehiculo` (`ID_Vehiculo`),
  KEY `ID_Usuario` (`ID_Usuario`),
  CONSTRAINT `registros_acceso_ibfk_1` FOREIGN KEY (`ID_Vehiculo`) REFERENCES `vehiculos` (`ID_Vehiculo`) ON DELETE CASCADE,
  CONSTRAINT `registros_acceso_ibfk_2` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuarios` (`ID_Usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registros_acceso`
--

LOCK TABLES `registros_acceso` WRITE;
/*!40000 ALTER TABLE `registros_acceso` DISABLE KEYS */;
INSERT INTO `registros_acceso` VALUES (17,88,122,'2025-06-02 16:23:21','2025-06-02 16:23:21','2025-06-02 16:23:38','2025-06-02'),(18,88,122,'2025-06-02 22:18:58','2025-06-02 22:18:58','2025-06-02 22:28:11','2025-06-02'),(19,88,122,'2025-06-02 22:19:05','2025-06-02 22:19:05','2025-06-02 22:28:08','2025-06-02'),(20,88,122,'2025-06-02 22:28:20','2025-06-02 22:28:20','2025-06-02 22:35:27','2025-06-02'),(21,88,122,'2025-06-02 22:28:24','2025-06-02 22:28:24','2025-06-02 22:35:25','2025-06-02'),(22,88,122,'2025-06-03 02:07:09','2025-06-03 02:07:09','2025-06-03 14:18:09','2025-06-03'),(23,88,122,'2025-06-03 02:07:12','2025-06-03 02:07:12','2025-06-03 14:17:27','2025-06-03');
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
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (108,'Luis Fernando Aldama',2,'201940021',NULL,NULL,'2025-05-19',NULL,'Ingeniería en Sistemas Computacionales',NULL,NULL,NULL,NULL),(110,'GUILLERMO ALDAMA',3,'002',NULL,NULL,'2025-05-28',NULL,NULL,NULL,NULL,'Maestro',NULL),(111,'Luis Fernando Aldama Castro',2,'2010000',NULL,NULL,'2025-06-02',NULL,'Ing. Sistemas',NULL,NULL,NULL,NULL),(115,'Jose Lois',2,'747591453',NULL,NULL,'2025-06-02',NULL,'Finanzas (Maestría)',NULL,NULL,NULL,NULL),(119,'Ricardo Morales ZAPO',2,'312534651',NULL,NULL,'2025-06-02',NULL,'Ingeniería en Sistemas Computacionales',NULL,NULL,NULL,NULL),(120,'Luis Stitch GONZALES CABRERA',3,'445',NULL,NULL,'2025-06-02',NULL,NULL,NULL,NULL,'Mantenimiento',NULL),(122,'GUILLERMO APELLIDO',3,'427',NULL,NULL,'2025-06-02',NULL,NULL,NULL,NULL,'Mantenimiento',NULL),(124,'Luis Morales Apellido',2,'354352462',NULL,NULL,'2025-06-03',NULL,'Impuestos (Maestría)',NULL,NULL,NULL,NULL),(125,'Luis MORALES DOMINGE',2,'201002456',NULL,NULL,'2025-06-03',NULL,'Economía',NULL,NULL,NULL,NULL),(126,'Luis Morales',2,'20100436',NULL,NULL,'2025-06-03',NULL,'Arquitectura',NULL,NULL,NULL,NULL),(127,'VISITANTE APELLIDO',5,NULL,NULL,NULL,'2025-06-03',NULL,NULL,NULL,NULL,NULL,NULL),(128,'Luis visitante Temporal',5,'TEMP-1748979803486',NULL,NULL,'2025-06-03',NULL,NULL,NULL,NULL,NULL,NULL),(129,'VISITANTE APELLIDO',5,NULL,NULL,NULL,'2025-06-03',NULL,NULL,NULL,NULL,NULL,NULL),(130,'Luis Fernando Aldama TEMPORAL',5,'TEMP-1748980723203',NULL,NULL,'2025-06-03',NULL,NULL,NULL,NULL,NULL,NULL),(132,'Luis Morales',2,'201002322',NULL,NULL,'2025-06-03',NULL,'Impuestos (Maestría)',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculos`
--

LOCK TABLES `vehiculos` WRITE;
/*!40000 ALTER TABLE `vehiculos` DISABLE KEYS */;
INSERT INTO `vehiculos` VALUES (75,108,'ZXI-UHV-K',18,NULL,'Violeta',NULL,'2025-05-19'),(77,110,'NAS-V8H-V',50,NULL,'rojo',NULL,'2025-05-28'),(78,111,'YZX-12-34',75,NULL,'azul',NULL,'2025-06-02'),(81,115,'YZX-435-V',42,NULL,'Azul',NULL,'2025-06-02'),(85,119,'YZX-1FD-0',52,NULL,'asd',NULL,'2025-06-02'),(86,120,'JM4-3C4-3',19,NULL,'Azul',NULL,'2025-06-02'),(88,122,'3B4-5WV-T',78,NULL,'Azul',NULL,'2025-06-02'),(90,124,'YZQ-45Y-B',52,NULL,'NulasaS',NULL,'2025-06-03'),(91,125,'YZX-WVT-Y',19,NULL,'asd',NULL,'2025-06-03'),(92,126,'YZX-123-W',41,NULL,'sss',NULL,'2025-06-03'),(93,127,'V52-45Y-2',52,NULL,'XQT',NULL,'2025-06-03'),(94,128,'AGARBEBG',78,NULL,'Azul',NULL,'2025-06-03'),(95,129,'WEF-WFE-C',41,NULL,'ASDVat',NULL,'2025-06-03'),(96,130,'SEGBW5',78,NULL,'WW',NULL,'2025-06-03'),(97,132,'RBU-W56-N',53,NULL,'wb',NULL,'2025-06-03');
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

-- Dump completed on 2025-06-03 14:34:02

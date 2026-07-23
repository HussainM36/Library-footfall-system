-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: librarystudent
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `admin_credentials`
--

DROP TABLE IF EXISTS `admin_credentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_credentials` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_credentials`
--

LOCK TABLES `admin_credentials` WRITE;
/*!40000 ALTER TABLE `admin_credentials` DISABLE KEYS */;
INSERT INTO `admin_credentials` VALUES (2,'librarian1','$2b$10$YiDhTbxz0H6NiqnWejjhY.c48tDOZ711m5euaEq0f6rr66nkYOiZG');
/*!40000 ALTER TABLE `admin_credentials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footfall_logs`
--

DROP TABLE IF EXISTS `footfall_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footfall_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `membership_no` varchar(20) NOT NULL,
  `purpose_id` int NOT NULL,
  `visit_date` date DEFAULT (curdate()),
  `entry_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `exit_time` datetime DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  KEY `membership_no` (`membership_no`),
  KEY `purpose_id` (`purpose_id`),
  CONSTRAINT `footfall_logs_ibfk_1` FOREIGN KEY (`membership_no`) REFERENCES `users` (`membership_no`),
  CONSTRAINT `footfall_logs_ibfk_2` FOREIGN KEY (`purpose_id`) REFERENCES `visit_purpose` (`purpose_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footfall_logs`
--

LOCK TABLES `footfall_logs` WRITE;
/*!40000 ALTER TABLE `footfall_logs` DISABLE KEYS */;
INSERT INTO `footfall_logs` VALUES (1,'2526043',8,'2026-07-22','2026-07-22 17:34:02','2026-07-22 17:35:02',NULL),(2,'B252799',3,'2026-07-22','2026-07-22 17:34:38','2026-07-22 17:35:15',NULL),(3,'2526008',6,'2026-07-23','2026-07-23 21:28:10','2026-07-23 21:28:38',NULL),(4,'2526019',13,'2026-07-23','2026-07-23 21:44:55','2026-07-23 21:47:12',NULL),(5,'ST0009',4,'2026-07-23','2026-07-23 21:46:27','2026-07-23 21:46:58',NULL),(6,'ST0012',10,'2026-07-23','2026-07-23 21:52:52','2026-07-23 21:54:21',NULL),(7,'D252718',8,'2026-07-23','2026-07-23 21:59:11','2026-07-23 22:17:22',NULL),(8,'D252715',5,'2026-07-23','2026-07-23 22:05:54','2026-07-23 22:17:15',NULL),(9,'D252719',6,'2026-07-23','2026-07-23 22:06:56','2026-07-23 22:17:03',NULL),(10,'D252716',1,'2026-07-23','2026-07-23 22:13:35','2026-07-23 22:13:48',NULL),(11,'EX0008',7,'2026-07-23','2026-07-23 22:16:43','2026-07-23 22:17:31',NULL);
/*!40000 ALTER TABLE `footfall_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `membership_no` varchar(20) NOT NULL,
  `batch` varchar(20) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `department` varchar(50) NOT NULL,
  `designation` varchar(50) NOT NULL,
  `photo_path` varchar(255) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`membership_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('','','','','','','Email id','Mobile Number','Active','2026-07-18 16:00:24','2026-07-18 16:09:37'),('2526001','2025-27','Alisha Mareeina Ruban ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_F81C3C3A00F44F8BB3C818671DC97102\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526002','2025-27','Aliza Rahmat Mohammed ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_139DE185D078484C854AC7165644ACE4\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526003','2025-27','Almeida  Kimberley ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_0493604E5EC04D969ECAE8C85827914D\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526004','2025-27','Almeida Ciyana','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_0B5C255386134E03A0AC1D2A1338EB8F\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526005','2025-27','Almeida Oshin ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_2A8E0CF87B594FABBCDC28A1C9E24131\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526006','2025-27','Arimbure Renita ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_7ABD017DEBC3456DADDEA78E5F604BA1\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526007','2025-27','Benitto Briltta ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_90523D0E44324C7E99BE6C152252BA63\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526008','2025-27','Correa Aurelia ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_466A1DE15F944E0E8D932FB52EBC84D7\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526009','2025-27','Crasto Rebecca  ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_CAE6DA9379EE4E788E8AA4762F783442\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526010','2025-27','Dabre Joicy ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_9F7215CC1C1E4C75B70BB3B5C8147A86\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526011','2025-27','Dabre Lin ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_97D4A51C20E64CADB9B3AC70C46E4C5E\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526012','2025-27','Delina  Jebaraj','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_1CC5DFBDE53B4C6C93D8391D19CE7171\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526013','2025-27','Dmello Aeroditha ','B.Ed.','Sudent','','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526014','2025-27','D\'Sa Simone   ','B.Ed.','Sudent','','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526015','2025-27','D\'silva Bliss ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_28E6BF6D34A94E979E08B00927C29170\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526016','2025-27','Dsilva Jeslyn','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_DB29E6B4BC1B4F1581109C44492ED92E\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526017','2025-27','Dsouza Supriya  ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_6836FF5D5BB948AA87582EA5C9DCD504\",1)','','','Active','2026-07-18 14:55:12','2026-07-18 14:55:12'),('2526018','2025-27','Fereira Zeenia  ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_DCF297EC7BC140E7A2D0DE13335F5D09\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526019','2025-27','Gaurea Priti ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_080CF266B36E42D4A03FF665D0D5072E\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526020','2025-27','Joseline Johnraj','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_1A97D87E43394CF1B31795B4B00ECB88\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526021','2025-27','Khan Yashfeen ','B.Ed.','Sudent','','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526022','2025-27','Khan Zainab ','B.Ed.','Sudent','','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526023','2025-27','Lopes Ceniya ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_524663C1CAA043E9995791ECC5883AA2\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526024','2025-27','Lopes Summer','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_B622799160964E54802096A8B493B3C4\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526025','2025-27','Luji Maxina','B.Ed.','Sudent','','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526026','2025-27','Mallick Maria ','B.Ed.','Sudent','','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526027','2025-27','MaryShalika ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_C3568F6643864C918F7CE72545A76D92\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526028','2025-27','Monteiro Angela ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_E209E7CB7B984744825E12E2EEF3D07B\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526029','2025-27','Nadar Riya Renita','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_DC6F9250251240B19C0E47F169F1DB65\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526030','2025-27','Nadar Swetha ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_08CB190AFFAA4BD9B4E5782190B937E7\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526031','2025-27','Noronha Jennicka ','B.Ed.','Sudent','','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526032','2025-27','Patil Priyanka  ','B.Ed.','Sudent','','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526033','2025-27','Pawar Kashish ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_0E980F3931E8422691C612FBFFBD4BDB\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526034','2025-27','Pereira Serena ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_07C2437A4EC0423C960396E0E2326D7D\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526035','2025-27','Pote Rakhi ','B.Ed.','Sudent','','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526036','2025-27','Pujari Juhee ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_9720259FA2C44D3FB746B8E595F1AB11\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526037','2025-27','Qureshi Zainab ','B.Ed.','Sudent','','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526038','2025-27','Rebello Alcina  ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_FC670F52A6804504A583D47878AFF6C1\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526039','2025-27','Rodricks Leitz ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_89A5ABE2C28B4C66AF0B8336213157BB\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526040','2025-27','Sequeira Pearl  ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_A5BC8D07D5AD488F88ACB793BCFC8A4C\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526041','2025-27','Serrao  Althea  ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_4C33AFDF5ECC4C6E8E7105EB68B92F1B\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526042','2025-27','Shaikh Amira ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_762D10FE3A63476FA436B1003CE5138D\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526043','2025-27','Shaikh Anika ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_3BA4C183DCF94A4FBFFE40FF7589D25D\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526044','2025-27','Shaikh Simran ','B.Ed.','Sudent','','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526045','2025-27','Shetty  Divya ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_1C20605C0F45419E92DEAEAB70B48155\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526046','2025-27','Shoshanaa Hubert Felix','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_B0393A6A2DF84F238FC1CD4ADD29FB6F\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526047','2025-27','Siddiqui Mehwish ','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_16F40D6148614360BE6DAB64B75A1770\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526048','2025-27','Verma Shikshadevi','B.Ed.','Sudent','=_xlfn.DISPIMG(\"ID_57CC3FB166B249D0B96F5EC6628B6D1D\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526049','2025-27','Yadav Dipika','B.Ed.','Sudent','','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('2526050','2025-27','Yadav Sonal ','B.Ed.','Sudent','','','','Active','2026-07-18 14:55:13','2026-07-18 14:55:13'),('B252799','2025-27','Pravin Chavan','B.Ed.','Sudent',NULL,NULL,NULL,'Active','2026-07-19 18:13:55','2026-07-22 13:55:24'),('D252701','2025-27','Ansari Nisha Aainul','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252702','2025-27','Dsilva Siya Duming','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252703','2025-27','Fernandes Alicia Marian','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252704','2025-27','Gaikwad Jenny John','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252705','2025-27','Gupta Aashna Dinesh','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252706','2025-27','Gupta Padma Shivpujan','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252707','2025-27','Kamble Vinaya ','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252708','2025-27','Kazi Kayenat Mohd Iqbal','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252709','2025-27','Khan Ashna Afroz','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252710','2025-27','Khan Hiba Shams Tabrez','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252711','2025-27','Kinny Jellyn Sanjav','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252712','2025-27','Kinny Scarlet Joe','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252713','2025-27','Kokya Sony Agnelo','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252714','2025-27','Londhe Namrata ','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252715','2025-27','Mansuri Aafiya Mohd','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252716','2025-27','Misquitta Christina ','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252717','2025-27','Nato Ujwala Leslie','D. Ed.','Student','','','','Active','2026-07-18 16:00:23','2026-07-18 16:00:23'),('D252718','2025-27','Panwar Neha Dhiraj','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D252719','2025-27','Parab Durva Pandhari','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D252720','2025-27','Sadamast Diksha ','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D252721','2025-27','Samani Harisha Shezad','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D252722','2025-27','Samani Mariam Israr','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D252723','2025-27','Samani Sumaiya Shezad','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D252724','2025-27',' Siddiqui Arbeena','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D252725','2025-27','Shaikh Alfiya Mubarak','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D252726','2025-27','Shaikh Zaiba Abdul Nasir','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D252727','2025-27','Tribhuwan Mayuri Sudhir','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D252728','2025-27','Vasaikar Clarisa Denis','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D252729','2025-27','Ved Keneisha Marian ','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D252730','2025-27','Cherath Shiny Mariyam ','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D252790','2025-27','Hussain Motarwala','B.Ed.','Sudent',NULL,NULL,NULL,'Active','2026-07-23 15:19:46','2026-07-23 16:45:19'),('D262801','26-28','Ansari Aamna Mohamed ','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262802','26-28','Baptista Simran Ronnie','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262803','26-28','Carlos Delina Nazreth','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262804','26-28','Chavan Radha Sandesh','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262805','26-28','Dias Crisann Judel','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262806','26-28',' Dcruz Krizan Gregory','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262807','26-28','Dsilva Clarissa Sunil','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262808','26-28','Dsilva Olencia Onil','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262809','26-28','Dsouza Elisha Elias','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262810','26-28','Dsouza Muriel Justino','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262811','26-28','Kanojiya Roshni Bhuval','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262812','26-28','Khan Kulsum Arshad','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262813','26-28','Khan Shifa Mahfuz','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262814','26-28','Main Manaswi Dilip','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262815','26-28','Mohammad Shama ','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262816','26-28','Noon Mamta Michael','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262817','26-28','Parab Asmi Satish','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262818','26-28','Parmar Mayra Simon','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262819','26-28','Patel Zaara Mohd ','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262820','26-28','Prajapati Meenakshi ','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262821','26-28','Rajbhar Ragini Rakesh','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262822','26-28','Rathod Payal Ramsing','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262823','26-28','Rodrigues Adriuon ','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262824','26-28','Shaikh Nameera ','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262825','26-28','Shaikh Sauleha Akhtar','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('D262826','26-28','Zoha abdul nasir ','D. Ed.','Student','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0002','','Sandhya Pagare','ILL ','HACSE Staff','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0005','','Sr. Saroj','D. Ed.',' Teacher','','','','Active','2026-07-18 16:00:24','2026-07-18 16:05:37'),('EX0006','','Nirmala Brass','D. Ed.','Teacher','','brassnirmala@gmail.com','8600276409','Active','2026-07-18 16:00:24','2026-07-18 16:05:37'),('EX0007','','Kanchan Naidu','D. Ed.','Teacher','','kanchannaidu5@gmail.com','8087989483','Active','2026-07-18 16:00:24','2026-07-18 16:05:37'),('EX0008','','Lalita Pereira','D. Ed.','Teacher','','pereiralalita21@gmail.com','9673952267','Active','2026-07-18 16:00:24','2026-07-18 16:05:37'),('EX0009','','Cinera D\'mello','D. Ed.',' Teacher','','cjdemello96@gmail.com','9561433386','Active','2026-07-18 16:00:24','2026-07-18 16:05:37'),('EX0010','','Pradnya Bhosekar','ILL ','GSBSCE Staff','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0011','','Manisha Garje','ILL ','HJCE Staff','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0012','','Deepali Pakhare','ILL ','KKCE Staff','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0101','','Visitor 1','','Non Member','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0102','','Visitor 2','','Non Member','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0103','','Visitor 3','','Non Member','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0104','','Visitor 4','','Non Member','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0105','','Visitor 5','','Non Member','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0106','','Visitor 6','','Non Member','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0107','','Visitor 7','','Non Member','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0108','','Visitor 8','','Non Member','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0109','','Visitor 9','','Non Member','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('EX0110','','Visitor 10','','Non Member','','','','Active','2026-07-18 16:00:24','2026-07-18 16:00:24'),('ST0001','','Dr. Sr. Tanuja Waghmare','B.Ed.','Admin','=_xlfn.DISPIMG(\"ID_CAF279EE47C04A6BA3A48093102AF854\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37'),('ST0002','','Cindrella D\'mello','B.Ed.','Professor','=_xlfn.DISPIMG(\"ID_05F59C73049240BF887A02FBB24E7FAB\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37'),('ST0003','','Giselle D\'souza','B.Ed.','Principal','=_xlfn.DISPIMG(\"ID_4CAE8BA2A23D435CBBD33FBDBB76BDB0\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37'),('ST0005','','Cerena D\'cunha','B.Ed.','Professor','=_xlfn.DISPIMG(\"ID_1379D122214B4364AF83DB67C61E9F67\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37'),('ST0007','','Reshma Rodrigues','B.Ed.','Associate Professo','=_xlfn.DISPIMG(\"ID_7A27A82BB14B461589BCF8C38DA8CA19\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37'),('ST0008','','Joan Lopes','B.Ed.','Associate Professor','=_xlfn.DISPIMG(\"ID_401D1B580D784FB0B7A29CA396919C30\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37'),('ST0009','','Shakuntala Nighot','B.Ed.','Librarian','=_xlfn.DISPIMG(\"ID_C977CA68DBA44084AD6FB33AF7C5C82B\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37'),('ST0010','','Delicia Pinto','B.Ed.','Library Attendent','=_xlfn.DISPIMG(\"ID_9B61CBB42D214053B9D878AF45EA1DD1\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37'),('ST0011','','Sharmila Vaz','B.Ed.','Cleark','=_xlfn.DISPIMG(\"ID_39621F2DAFD44F60BA41682E323B2378\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37'),('ST0012','','Colleen Fernandes','B.Ed.','Cleark','=_xlfn.DISPIMG(\"ID_E21496D1D5AA4552A1B1B1EEA99FD325\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37'),('ST0013','','Sanjay Gaurav','B.Ed.','Peon','=_xlfn.DISPIMG(\"ID_93CB795501D849628B5DA05FF08FE68D\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37'),('ST0014','','Laxman Garje','B.Ed.','Peon','=_xlfn.DISPIMG(\"ID_9DCF2B9DD8D047429416B11C8DFC0523\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37'),('ST0015','','Nilima Prabha Mandavakar','B.Ed.','Peon','','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37'),('ST0016','','Anthony D\'souza','B.Ed.','Peon','=_xlfn.DISPIMG(\"ID_2F567F9DC75A4522B9A9F434B6F31717\",1)','','','Active','2026-07-18 14:55:13','2026-07-18 16:09:37');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visit_purpose`
--

DROP TABLE IF EXISTS `visit_purpose`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visit_purpose` (
  `purpose_id` int NOT NULL AUTO_INCREMENT,
  `purpose_name` varchar(100) NOT NULL,
  PRIMARY KEY (`purpose_id`),
  UNIQUE KEY `purpose_name` (`purpose_name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit_purpose`
--

LOCK TABLES `visit_purpose` WRITE;
/*!40000 ALTER TABLE `visit_purpose` DISABLE KEYS */;
INSERT INTO `visit_purpose` VALUES (8,'Activity'),(12,'Book Exhibition'),(3,'EIL'),(1,'Guidance from Librarian'),(4,'Library Clearance'),(5,'Newspaper Reading'),(11,'Official Work'),(15,'Other'),(10,'Print/Photocopy'),(9,'Project/Research'),(13,'Question Papers'),(14,'Reading'),(2,'Reference'),(6,'Study'),(7,'Study-Buddy');
/*!40000 ALTER TABLE `visit_purpose` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-23 23:16:53

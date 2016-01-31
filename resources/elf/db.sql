CREATE DATABASE `coffeechat` /*!40100 DEFAULT CHARACTER SET utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `linkedInHeadline` varchar(255) DEFAULT NULL,
  `linkedInID` varchar(255) DEFAULT NULL,
  `linkedInAT` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

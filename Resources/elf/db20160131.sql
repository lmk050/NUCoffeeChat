CREATE DATABASE `coffeechat` /*!40100 DEFAULT CHARACTER SET utf8 */;
CREATE TABLE `company_desc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `industry` int(11) NOT NULL,
  `size` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `company_size_desc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `desc` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `company_type_desc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `desc` varchar(512) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `industry_desc` (
  `id` int(11) NOT NULL,
  `group` varchar(256) NOT NULL,
  `name` varchar(512) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `user_basic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(512) DEFAULT NULL,
  `lastName` varchar(512) NOT NULL,
  `email` varchar(255) NOT NULL,
  `headline` varchar(1024) DEFAULT NULL,
  `profilePicS` varchar(1024) DEFAULT NULL,
  `profilePicO` varchar(1024) DEFAULT NULL,
  `industry` int(11) DEFAULT NULL,
  `linkedInProfile` varchar(1024) DEFAULT NULL,
  `linkedInID` varchar(255) DEFAULT NULL,
  `linkedInToken` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `linkedInID_UNIQUE` (`linkedInID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
CREATE TABLE `user_position` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `companyID` int(11) NOT NULL,
  `isCurrent` tinyint(1) NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `title` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

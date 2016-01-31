DELIMITER $$
CREATE DEFINER=`b443fc80dd2566`@`%` PROCEDURE `sp_add_position`(
  in user_id int,
  in industry varchar(256),
  in company_name varchar(256),
  in company_size varchar(256),
  in company_type varchar(256),
  in is_current boolean,
  in start_date_year int,
  in start_date_month int,
  in end_date_year int,
  in end_date_month int,
  in title varchar(256)
)
BEGIN
  DECLARE industry_id int;
  DECLARE company_size_id int;
  DECLARE company_type_id int;
    DECLARE company_id int;
    DECLARE current tinyint;
  DECLARE start_date date;
    DECLARE end_date date;
    
  SET industry_id=( SELECT id FROM industry_desc where `name` = industry);
    
    IF EXISTS (SELECT * FROM company_desc WHERE `name` = company_name) THEN
    SET company_id=( SELECT id FROM company_desc where `name` = company_name);
    ELSE
    IF EXISTS (SELECT * FROM company_size_desc WHERE `desc` = company_size) THEN
      SET company_size_id=( SELECT id FROM company_size_desc where `desc` = company_size);
    ELSE
      INSERT INTO company_size_desc (`desc`) VALUES (company_size);
            SET company_size_id=LAST_INSERT_ID();
    END IF;
        
        IF EXISTS (SELECT * FROM company_type_desc WHERE `desc` = company_type) THEN
      SET company_type_id=( SELECT id FROM company_type_desc where `desc` = company_type);
    ELSE
      INSERT INTO company_type_desc (`desc`) VALUES (company_type);
            SET company_type_id=LAST_INSERT_ID();
    END IF;
        
       INSERT INTO company_desc (`name`, industry, size, `type`) VALUES (company_name,industry_id,company_size_id,company_type_id);
     SET company_id=LAST_INSERT_ID();
    END IF;
    
    SET start_date = (SELECT STR_TO_DATE(CONCAT( 1, '/', start_date_month, '/', start_date_year ),'%d/%m/%Y') );
    
    IF(is_current) THEN
    SET current=1;
        SET end_date=DATE_ADD(start_date,INTERVAL 100 YEAR);
  ELSE 
    SET current=0;
    SET end_date =  (SELECT STR_TO_DATE(CONCAT( 1, '/', end_date_month, '/', start_date_year ),'%d/%m/%Y') );
    END IF;
    
    
    INSERT INTO `coffeechat`.`user_position` 
    (`userID`, `companyID`, `isCurrent`, `startDate`, `endDate`, `title`)
  VALUES
  (user_id,company_id,current,start_date,end_date,title);
    
END$$
DELIMITER ;

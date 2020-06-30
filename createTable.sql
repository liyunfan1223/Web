CREATE DATABASES myDB1;
use myDB1;
CREATE TABLE `login`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(200) NOT NULL,
    `passwords` VARCHAR(200) NOT NULL,
    `loginType` INT NOT NULL,
    PRIMARY KEY(`id`),
    UNIQUE KEY `id_UNIQUE` (`id`),
    UNIQUE KEY `url_UNIQUE` (`username`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
<?php
    /*looks at certain file and stops scripts if not there*/
    require_once(__DIR__."/../model/config.php");
            /*creating a query that makes a table in the database to store info
            then create an id for each blog post the table consists of id title and post not null
             means it cannot be empty*/

            $query = $_SESSION["connection"]->query("CREATE TABLE users ("
                    . "id int(11) NOT NULL AUTO_INCREMENT,"
                    . "username varchar(30) NOT NULL,"
                    . "email varchar(50) NOT NULL,"
                    . "password char(128) NOT NULL,"
                    . "salt char(128) NOT NULL,"
                    . "exp int(4),"
                    . "exp1 int(4),"
                    . "exp2 int(4),"
                    . "exp3 int(4),"
                    . "exp4 int(4),"
                    . "PRIMARY KEY (id))");
           
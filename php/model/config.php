<html>
    
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" type="text/css" href="css/main.css">
        <title></title>
    </head>
    
<?php

//    creating a variable to store the project name to shorten code
require_once(__DIR__ . "/database.php");
$path = "/Awesome/php/";
session_start();
session_regenerate_id(true);

$host = "localhost";
$username = "root";
$password = "root";
$database = "awesome_db";
if (!isset($_SESSION["connection"])) {
    //new database object to query on the database
    $connection = new Database($host, $username, $password, $database);
    $_SESSION["connection"] = $connection;
}
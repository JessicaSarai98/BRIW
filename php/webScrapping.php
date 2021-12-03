<?php

include('./services/CrawlerService.php');
if (isset($_GET['urls'])) {
    $crawler = new CrawlerService();
    echo $crawler->crawlingProcess($_GET['urls']);
} else {
    echo 'error';
}
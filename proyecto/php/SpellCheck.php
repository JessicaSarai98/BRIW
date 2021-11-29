<?php
  if(isset($_GET['data'])){
    $data = ($_GET['data']);
    $response = file_get_contents('http://localhost:8983/solr/briw_pro/selectCheck?df=attr_text&q='.$data."&spellcheck=on&wt=json");
    echo $response;
  }else {
    echo "404";
  }


?>

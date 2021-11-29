<?php
  include('./controllers/ControllerSearch.php');
  if(isset($_GET['request'])) {
      $request = ($_GET['request']);
      $response = new ControllerSearch();
      echo $response->search($request);
    }else {
      echo "No data";
    }


?>

<?php

require_once(realpath($_SERVER["DOCUMENT_ROOT"]) .'\BRIW\vendor\autoload.php');
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\ConnectException;

class CrawlerService
{

    private $urlSorl = "http://localhost:8983/solr/briw_pro/update/extract?commit=true";

    public function crawlingProcess($urls){
        $urls = explode(",", $urls);
        $this->writeDocs(realpath($_SERVER["DOCUMENT_ROOT"]) .'\BRIW\urls.txt', $urls);

        for ($i=0; $i < count($urls); $i++) {
            $solrExist = $this->findDocByUrlAttribute($urls[$i])->response->docs;
            $dateModified = $this->getModifiedDate($urls[$i]);
            //echo $urls[$i];
            if ( empty($solrExist) || ($solrExist[0]->attr_date_modified[0] != $dateModified)  ){
                $response = $this->getClient($urls[$i]);
                $attributes = "<meta property='url' content = '$urls[$i]'><meta property='date_modified' content = '$dateModified'>";
                $html = $attributes.$response->getBody();
                try {
                    if ($response->getStatusCode() == 200) {
                        //echo "index file";
                        $html = $this->remover_javascriptCSS($html);
                        $this->addDocumentSolr($this->urlSorl, $html);

                        //get childrens
                        $children = $this->getChildrenUrl($html,$urls[$i]);
                        $size = count($children);
                        if( count($children) > 3 ){
                            $size = 3;
                        }

                        for($j= 0; $j < $size; $j++){
                            $solrExistChild = $this->findDocByUrlAttribute($children[$j])->response->docs;
                            $dateModifiedChild = $this->getModifiedDate($children[$j]);

                            if ( empty($solrExistChild) || ($solrExistChild[0]->attr_date_modified[0] != $dateModifiedChild)  ){
                                $responseChild = $this->getClient($children[$i]);
                                $attributesChild = "<meta property='url' content = '$$children[$i]'><meta property='date_modified' content = '$dateModifiedChild'>";
                                $htmlChild = $attributesChild.$responseChild->getBody();
                                if ($responseChild->getStatusCode() == 200) {
                                    $htmlChild = $this->remover_javascriptCSS($htmlChild);
                                    $this->addDocumentSolr($this->urlSorl, $htmlChild);
                                }
                            }
                        }
                        //end block children

                    }
                } catch (Exception $th) {
                    echo $th->getMessage();
                }
            }else{
                echo "Exists url in solr";
            }
        }
        return 'Resultados indizados';
    }

    public function getClient($url){
        try {
            $client = new Client();
            return $client->request('GET', $url, ['verify' => false]);
        } catch (RequestException $e) {
            return $e->getResponse();
        } catch (ConnectException $e) {
            return $e->getHandlerContext();
        }
    }

    private function addDocumentSolr($url, $html){
        $client = new Client();
        try {
            return $client->request(
                'POST',
                $url,
                ['body' => $html,
                    'headers' => ['Content-type' => 'application/json']
                ]
            );
        } catch (\GuzzleHttp\Exception\GuzzleException $e) {
            return $e->getMessage();
        }
    }

    private function remover_javascriptCSS($html) {

        $html = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', "", $html);
        $html = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', "", $html);
        return $html;
    }

    public function getChildrenUrl($html, $url) {
        $url = substr($url, -1) == '/' ? substr($url, 0, -1) : $url;
        $doc = new DOMDocument();
        $opts = array('output-xhtml' => true,
            'numeric-entities' => true);
        $doc->loadXML(tidy_repair_string($html,$opts));
        $xpath = new DOMXPath($doc);
        $xpath->registerNamespace('xhtml','http://www.w3.org/1999/xhtml');
        $enlaces = array();
        foreach ($xpath->query('//xhtml:a/@href') as $node) {
            $link =  (( substr($node->nodeValue,0,4) == 'http' ) ?  $node->nodeValue : $url . $node->nodeValue ) ;

            if(strpos($link, '#') == false && strpos($link, '/#') == false){
                array_push($enlaces, $link);
            }

        }
        return $enlaces;
    }

    public function getModifiedDate($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_FILETIME, true);
        curl_exec($ch);
        $header = curl_getinfo($ch);
        curl_close($ch);
        return date ("Y-m-d H:i:s",$header['filetime']);
    }

    public function writeDocs($fileLocation, $urls) {
        $file = fopen($fileLocation, "w");
        for ($i=0; $i < count($urls); $i++) {
            if($i != (count($urls) -1) ){
                fwrite($file, $urls[$i] . PHP_EOL);
            }else {
                fwrite($file, $urls[$i]);
            }

        }
        fclose($file);
    }

    public function readDoc($nameFile){
        $file = file($nameFile);
        for ($i=0; $i < count($file); $i++) {
            if (strlen($file[$i]) != 2) {
                $file[$i] = preg_replace('/\n/','', utf8_decode($file[$i]));
                $file[$i] = substr($file[$i], 0, -1);
            }
        }
        return $file;
    }

   public function findDocByUrlAttribute($url){
        $resultados = file_get_contents("http://localhost:8983/solr/briw_pro/select?q=attr_url:%22$url%22&fl=attr_url+attr_date_modified");
        return json_decode($resultados);
    }

}

//$craw  = new CrawlerService();
//$craw->crawlingProcess("https://www.sitepoint.com/");
//var_dump($craw->findDocByUrlAttribute("https://www.sitepoint.com/blog")->response->docs);
//$craw->getClient("https://www.merida.gob.mx/");
//$craw->getClient("https://www.itmerida.mx/");
//var_dump($craw->getModifiedDate("https://stackoverflow.com"));
<?php

require_once(realpath($_SERVER["DOCUMENT_ROOT"]) .'\search_solr_php\vendor\autoload.php');
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\ConnectException;

class CrawlerService
{

    private $urlSorl = "http://localhost:8983/solr/briw_pro/update/extract?commit=true";

    public function crawlingProcess($urls){
        $urls = explode(",", $urls);
        $urlsSaved = $this->readDoc(realpath($_SERVER["DOCUMENT_ROOT"]) .'\search_solr_php\urls.txt');
        $this->writeDocs(realpath($_SERVER["DOCUMENT_ROOT"]) .'\search_solr_php\urls.txt', $urls);

        for ($i=0; $i < count($urls); $i++) {
            if (in_array($urls[$i], $urlsSaved) != 1 && $urls[$i] != null){
                $response = $this->getClient($urls[$i]);
                $html = "<meta property='url' content = '$urls[$i]'>".$response->getBody();
                try {
                    if ($response->getStatusCode() == 200) {
                        $html = $this->remover_javascriptCSS($html);
                        $reponseSolr = $this->addDocumentSolr($this->urlSorl, $html);
                        echo $reponseSolr->getStatusCode()."<br/>".$reponseSolr->getBody();
                    }
                } catch (\Throwable $th) {
                    echo $th->getMessage();
                }
            }else{
                echo "Exists url in file";
            }
        }
        return 'Resultados indizados';
    }

    private function getClient($url){
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

    public function writeDocs($fileLocation, $urls) {
        $file = fopen($fileLocation, "w");
        for ($i=0; $i < count($urls); $i++) {
            fwrite($file, $urls[$i] . PHP_EOL);
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

}
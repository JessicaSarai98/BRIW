<?php

class GeneratorQuerySolr
{
    private $dictionary = array("and", "or","not");
    private $baseQuery = 'http://localhost:8983/solr/briw_pro/selectCheck?debug.explain.structured=true&debugQuery=on&df=attr_text&hl.fl=attr_text&hl=true&q=';
    private $accentVocals = array ("á","é","í","ó","ú","Á","É","Í","Ó","Ú","ñ","Ñ");
    private $vocals = array ("a","e","i","o","u","A","E","I","O","U","n","N");

    private function removeAccents($request) {
        return str_replace($this->accentVocals, $this->vocals, $request);
    }

    private function addWord($word, $tokenPrevious, $query){
        if ($tokenPrevious == "elemento" || $tokenPrevious == "or") {
            $query = $query . 'OR(*' . $word .'*)';
        } else if ($tokenPrevious == "not") {
            $query = $query . '%20NOT(*' . $word .'*)';
        } else {
            $query = $query . 'AND(*' . $word . '*)';
        }
        return $query;
    }

    public function generateQuery($request){
        $request = strtolower ($request);
        $tokens = explode(" ", $request);
        $size = count($tokens);
        $tokenPrevious = "elemento";
        $querySolr = $this->baseQuery.'(*'.$this->removeAccents($tokens[0]).'*)';

        for ($i=1; $i < $size; $i++) {
            $token = $this->removeAccents($tokens[$i]);
            switch ($token) {
                case $this->dictionary[0]:
                    $tokenPrevious = "and";
                    break;
                case $this->dictionary[1]:
                    $tokenPrevious = "or";
                    break;
                case $this->dictionary[2]:
                    $tokenPrevious = "not";
                    break;
                default:
                    $querySolr = $this->addWord($token, $tokenPrevious, $querySolr);
                    $tokenPrevious = "elemento";
                    break;
            }
        }

        return $querySolr;
    }

}
<?php

require_once('vendor/autoload.php');

use Symfony\Component\DomCrawler\Crawler;

if (is_file('raw.html')) {
  $content = file_get_contents('raw.html');
} else {
  $content = file_get_contents('http://www.cosmos-c64.com/The-Epic-Commodore-C64-SID-Collection.html');
  file_put_contents('raw.html', $content);
}

$items=array();

$crawler = new Crawler();
$crawler->addContent($content);

$table = $crawler->filter('table.textregular')->eq(1);
$sectorPassed = false;
foreach ($table->filter('td') as $cell) {
  $nodeValue = trim($cell->nodeValue);
  if (strstr($nodeValue, '-----SECTOR') !== false) {
    $sectorPassed = true;
    continue;
  }
  if (strstr($nodeValue, '(C) 2015') !== false || $nodeValue == '' || strlen($nodeValue) < 3 || !$sectorPassed || !$cell->hasChildNodes()) {
    continue;
  }
  
  $item=new stdClass();
  
  $raw = strip_tags($cell->ownerDocument->saveHTML($cell), '<br>');
  $authorAndTitle = end(explode('<br>', $raw));
  list($item->title, $item->author) = explode(' - ', $authorAndTitle);
  
  $links=$cell->getElementsByTagName('a');
  $youtubeLink=$links[0];
  $hvscLink=$links[1];

  $item->youtube=$links[0]->getAttribute('href');
  $item->offset=$links[0]->nodeValue;
  $item->hvsc=$links[1]->getAttribute('href');
  
  $items[]=$item;
}

$data=array(
    'favourites'=>$items
);

file_put_contents('epic.json',json_encode($data,JSON_PRETTY_PRINT));
<?php

include_once('src/Netatmo/autoload.php');

$config = array();
$config['client_id'] = '5ff42bdbabc37c2625058e5c';
$config['client_secret'] = 'Jf0HCahwD8K4Jqx8MA4xtOtIt5FsFEHqRt4Rf';
$config['scope'] = 'read_station read_thermostat write_thermostat';
$client = new Netatmo\Clients\NAApiClient($config);

$username = 'cesar.w1684@gmail.com';
$pwd = 'Miw_projet38';
$client->setVariable('username', $username);
$client->setVariable('password', $pwd);
try
{
   $tokens = $client->getAccessToken();
   $refresh_token = $tokens['refresh_token'];
   $access_token = $tokens['access_token'];
}
catch(Netatmo\Exceptions\NAClientException $ex)
{
   echo "An error occcured while trying to retrive your tokens \n";
}

echo $access_token;

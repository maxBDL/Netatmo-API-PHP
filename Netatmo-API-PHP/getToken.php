<?php

include_once('src/Netatmo/autoload.php');

$config = array();
$config['client_id'] = '60184785e8fca671b564805d';
$config['client_secret'] = 'sbJyZPEepZ3DlUhaSPxplcISvhNv0u2ARP';
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

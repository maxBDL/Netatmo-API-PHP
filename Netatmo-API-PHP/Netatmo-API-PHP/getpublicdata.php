<?php

include_once('getToken.php');

try {
   $params = [
      // latitude of the north east corner of the requested area. -85 <= lat_ne <= 85 and lat_ne>lat_sw
      'lat_ne' => $_GET['lat_ne'],
      // Longitude of the north east corner of the requested area. -180 <= lon_ne <= 180 and lon_ne>lon_sw
      'lon_ne' => $_GET['lon_ne'],
      // Latitude of the south west corner of the requested area. -85 <= lat_sw <= 85
      'lat_sw' => $_GET['lat_sw'],
      // Longitude of the south west corner of the requested area. -180 <= lon_sw <= 180
      'lon_sw' => $_GET['lon_sw'],
      // To filter stations based on relevant measurements you want (e.g. rain will only return stations with rain gauges). Default is no filter. You can find all measurements available on the Thermostat page.
      'required_data' => $_GET['required_data'],
      // True to exclude station with abnormal temperature measures. Default is false.
      'filter' => $_GET['filter']
   ];

   $response = $client->api('getpublicdata','GET', $params);

   echo json_encode($response);

} catch (Netatmo\Exceptions\NASDKException $ex) {
   echo "An error happened while trying to retrieve public data: ".$ex->getMessage()."\n";
}

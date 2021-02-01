<?php

include_once('getToken.php');

try {
   $params = [
      // Weather station mac address
      'device_id' => $_GET['device_id'],
      // module mac address
      'module_id' => $_GET['module_id'],
      // Timelapse between two measurements
      'scale' => $_GET['scale'],
      // Timelapse between two measurements. Timelapse between two measurements. temperature(°C), co2(ppm), humidity(%), pressure(mbar), noise(db), rain(mm), windStrength(km/h), windAngle(angles), guststrength(km/h), gustAngle(angles). \r 30min-1-3hours = min_temp, max_temp, min_hum, max_hum, min_pressure, max_pressure, min_noise, max_noise,sum_rain. 1day-1week-1month = date_max_gust, date_max_hum, min_pressure, date_min_pressure, date_max_pressure, min_noise, date_min_noise, max_noise, date_max_noise, date_min_co2, date_max_co2
      'type' => $_GET['type'],
      // Timestamp of the first measure to retrieve. Default is null.
      'data_begin' => $_GET['data_begin'],
      // Timestamp of the last measure to retrieve (default and max are 1024). Default is null.
      'data_end' => $_GET['data_end'],
      // Maximum number of measurements (default and max are 1024)
      'limit' => $_GET['limit'],
      // Determines the format of the answer. Default is true. For mobile apps we recommend True and False if bandwidth isn't an issue as it is easier to parse.
      'optimize' => $_GET['optimize'],
      // If scale different than max, timestamps are by default offset + scale/2. To get exact timestamps, use true. Default is false.
      'real_time' => $_GET['real_time']
   ];

   $response = $client->api('getmeasure','GET', $params);

   echo json_encode($response);

} catch (Netatmo\Exceptions\NASDKException $ex) {
   echo "An error happened while trying to retrieve measure: ".$ex->getMessage()."\n";
}

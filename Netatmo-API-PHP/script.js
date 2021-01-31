//Leaflet map :

const span = document.querySelector('.fa');

var carte = L.map('maCarte', {center: [44.56, 6.08],zoom: 14,zoomControl: false});

////////////////////////////////////
//RAJOUTER LES DEUX PROCHAINES LIGNES
////////////////////////////////////
L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(carte);
L.control.zoom({position:'bottomleft'}).addTo(carte);
//////////////////////////////////////////////
/////////////////////////////////////////////

carte.options.maxZoom = 17;
carte.options.minZoom = 12;

zone = new L.LayerGroup();
carte.addLayer(zone);
var bounds = carte.getBounds();
var northWest = bounds.getNorthWest(),
northEast = bounds.getNorthEast(),
southWest = bounds.getSouthWest(),
southEast = bounds.getSouthEast();

carte.addEventListener('click', () => {
   list_villes.innerHTML = '';
   if (infos.classList[1] === 'active') {
      infos.classList.value = 'infos';
   }
});

// console.log(northWest.lat, northWest.lng);
// console.log(southWest.lat, southWest.lng);

function actualiseMap() {
   span.className = 'fa fa-spinner fa-spin';
   zone.clearLayers();
   bounds = carte.getBounds();
   northWest = bounds.getNorthWest(),
   northEast = bounds.getNorthEast(),
   southWest = bounds.getSouthWest(),
   southEast = bounds.getSouthEast();
   // console.log(northWest.lat, northWest.lng);
   // console.log(southWest.lat, southWest.lng);
   lat_ne = northEast.lat; //requis
   lon_ne = northEast.lng; //requis
   lat_sw = southWest.lat; //requis
   lon_sw = southWest.lng; //requis
   getpublicdata(lat_ne, lon_ne, lat_sw, lon_sw, required_data, filter);
}

var token;

// async function getToken() {
//    try {
//       var url = 'getToken.php';
//       var response = await fetch(url);
//       var data = await response.text();
//       console.log(data);
//       token = data;
//    } catch (e) {
//       console.log('erreur: ' + e);
//    }
// }

// getToken();

//getpublicdata
var inputTemp = document.querySelector('#inputTemp');
var inputHumidity = document.querySelector('#inputHumidity');

function readData(data) {
   var moyTemp = 0;
   var moyHum = 0
   var humidity;
   for (var i = 0; i < data.length; i++) {
      // getmeasure(data[i]._id, data[i].modules[0], scale, type, data_begin, data_end, limit, optimize, real_time);
      var mod = data[i].measures;
      var temp = data[i].measures[Object.keys(mod)[0]].res;
      var adresse = data[i].place.location;
      var altitude = data[i].place.altitude;
      var pressure = data[i].measures[Object.keys(mod)[1]].res;
      for(var key in temp) {
         var time = new Date(key * 1000);
         var day = time.getDate();
         var month = time.getMonth();
         var year = time.getFullYear();
         var heures = time.getHours();
         var minutes = time.getMinutes();
         if (minutes >= 0 && minutes <= 9) {
            minutes = '0' + minutes;
         }
         var hum = temp;
         temp = temp[key][0];
         humidity = hum[key][1];
         moyTemp += temp;
         moyHum += humidity;
      }
      for(var key in pressure) {
         pressure = pressure[key][0];
      }
      hour = heures + 'h' + minutes;
      temp = temp.toString();
      humidity = humidity.toString();
      setMarker(data[i]._id,data[i].place.location[0], data[i].place.location[1], temp, humidity, pressure, altitude, hour);
      span.className = 'fa fa-location-arrow';
   }
   inputTemp.value = (moyTemp/data.length).toFixed(2) + '°C 🌡️';
   inputHumidity.value = (moyHum/data.length).toFixed(1) + '% 💧';
}

async function getpublicdata(lat_ne, lon_ne, lat_sw, lon_sw, required_data, filter) {
   try {
      // var url = 'getpublicdata?lat_ne=' + lat_ne + '&lon_ne=' + lon_ne + '&lat_sw=' + lat_sw + '&lon_sw=' + lon_sw + '&required_data=' + required_data + '&filter=' + filter;
      // var response = await fetch(url);
      // var data = await response.json();
      // // console.log('getpublicdata : ');
      // console.log(data);
      // var token = getToken();
      // console.log(token);
      try {
         var url = 'getToken.php';
         var response = await fetch(url);
         var data = await response.text();
         token = data;
      } catch (e) {
         console.log('erreur: ' + e);
      }

      $.ajax({
         url: 'https://api.netatmo.com/api/getpublicdata?lat_ne=' + lat_ne + '&lon_ne=' + lon_ne + '&lat_sw=' + lat_sw + '&lon_sw=' + lon_sw + '&required_data=' + required_data + '&filter=' + filter,
         beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + token)
         }, success: function(data){
            readData(data.body);
         }
      })
   } catch (e) {
      console.log('erreur: ' + e);
   }
}

var lat_ne = northEast.lat; //requis
var lon_ne = northEast.lng; //requis
var lat_sw = southWest.lat; //requis
var lon_sw = southWest.lng; //requis
var required_data = '';
var filter = true;

getpublicdata(lat_ne, lon_ne, lat_sw, lon_sw, required_data, filter);

//getmeasure

function readMeasure(data) {
   for(var key in data){
      // console.log(key);
      var time = new Date(key * 1000);
      var day = time.getDate();
      var month = time.getMonth();
      var year = time.getFullYear();
      var heures = time.getHours();
      var minutes = time.getMinutes();
      console.log('Date : ' + day + '/' + month + '/' + year + ' ' + heures + 'h' + minutes);
      console.log('Température : ' + data[key][0]);
      console.log('Humidité : ' + data[key][1] + '%');
   }
}

async function getmeasure(device_id, module_id, scale, type, data_begin, data_end, limit, optimize, real_time) {
   try {
      // var url = 'getmeasure?device_id=' + device_id + '&module_id=' + module_id + '&scale=' + scale + '&type=' + type + '&data_begin=' + data_begin + '&data_end=' + data_end + '&limit=' + limit + '&optimize=' + optimize + '&real_time=' + real_time;
      // var response = await fetch(url);
      // var data = await response.json();
      // console.log('getmeasure : ');
      // console.log(data);

      try {
         var url = 'getToken.php';
         var response = await fetch(url);
         var data = await response.text();
         token = data;
      } catch (e) {
         console.log('erreur: ' + e);
      }

      $.ajax({
         url: 'https://api.netatmo.com/api/getmeasure?device_id=' + device_id + '&module_id=' + module_id + '&scale=' + scale + '&type=' + type + '&data_begin=' + data_begin + '&data_end=' + data_end + '&limit=' + limit + '&optimize=' + optimize + '&real_time=' + real_time,
         beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + token)
         }, success: function(data){
            readMeasure(data.body);
         }
      })
   } catch (e) {
      console.log('erreur: ' + e);
   }
}

// var device_id = '70:ee:50:32:fb:b8'; //requis
// var module_id = '02:00:00:32:c2:3e';
var scale = '30min'; //requis
var type = 'temperature,humidity'; //requis
var data_begin = 1610000000;
var data_end = 1610373466;
var limit = 10;
var optimize = false;
var real_time = false;

// getmeasure(device_id, module_id, scale, type, data_begin, data_end, limit, optimize, real_time);

function setMarker(id, lat, lon, temp, hum, press, alt, hour) {
   var adr = getAdresse([lat, lon]);
   var markerB = L.icon({
      iconUrl: 'markerB.png',
      // shadowUrl: 'leaf-shadow.png',

      iconSize:     [24, 35], // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
      // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
   });
   var marker = L.marker([lon, lat], {icon: markerB}).bindTooltip(
      temp + '°C'
      ,{
         permanent: true,
         direction: 'right',
         opacity: 0.8,
         color: '#3388ff'
      }
   );
   marker.addEventListener('click', () => {
      var adr1 = document.getElementById('adr1');
      var adr2 = document.getElementById('adr2');
      var adr3 = document.getElementById('adr3');
      var tempData = document.getElementById('tempData');
      var humData = document.getElementById('humData');
      var pressData = document.getElementById('pressData');
      var heureMAJ = document.getElementById('heureMAJ');
      adr1.textContent = adr[0]+', '+adr[1];
      adr2.textContent = adr[2];
      adr3.textContent = 'Altitude : ' + alt + 'm';
      tempData.textContent = temp + '°C';
      humData.textContent = hum + '%';
      pressData.textContent = press + ' Hpa';
      heureMAJ.textContent = hour;
      ////////////////////////////////////
      //RAJOUTER La PROCHAINE LIGNE
      ////////////////////////////////////
      var infos = document.getElementsByClassName('infos')[0];
      // infos.classList.toggle('active');
      if (infos.classList[1] === undefined) {
         infos.classList.value = 'infos active';
      }
   });
   marker.addTo(zone);
}

function getAdresse(adr) {
   var dataAdr;
   $.ajax({
      async: false,
      url: "https://api-adresse.data.gouv.fr/reverse/?lon="+adr[0]+"&lat="+adr[1],
      success: function(data) {
         var city = data.features[0].properties.city;
         var cityCode = data.features[0].properties.citycode;
         var name = data.features[0].properties.name;
         dataAdr = [city, cityCode, name];
      },
      error: function(data) {
         console.log('error when search');
      }
   });
   return dataAdr;
}

var greenIcon = L.icon({
   iconUrl: 'dot.png',
   // shadowUrl: 'leaf-shadow.png',

   iconSize:     [20, 20], // size of the icon
   // shadowSize:   [50, 64], // size of the shadow
   // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
   // shadowAnchor: [4, 62],  // the same for the shadow
   // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var displayPosition = false;
var myPosition;
var button2 = document.getElementById('button2');

function userPosition() {
   if ("geolocation" in navigator) {
      if (displayPosition === false) {
         button2.style.backgroundColor = '#00ff00';
         displayPosition = true;
         navigator.geolocation.getCurrentPosition(function(position) {
            // console.log(position.coords.latitude, position.coords.longitude);
            myPosition = L.marker([position.coords.latitude, position.coords.longitude], {icon: greenIcon}).addTo(carte);
            carte.setView([position.coords.latitude, position.coords.longitude], 14, { animation: true });
            actualiseMap()
         });
      } else {
         button2.style.backgroundColor = '#eeeeee';
         displayPosition = false;
         carte.removeLayer(myPosition);
      }
   } else {
      /* la géolocalisation n'est pas disponible */
      alert('Votre géolocalisation est indisponible');
   }
}

var ville = document.getElementById('ville');
var list_villes = document.getElementById('list_villes');

function chargeVilles() {
   if (ville.value.replace(/\s+/, '').length) {
      $.ajax({
         url: "https://api-adresse.data.gouv.fr/search/?q="+ville.value+"&limit=10",
         success: function(data) {
            recupVilles(data.features);
         },
         error: function(data) {
            console.log('error when search');
         }
      });
   } else {
      list_villes.innerHTML = '';
   }
}

function recupVilles(adresse) {
   var option = '';
   for (var i = 0; i < adresse.length; i++) {
      // console.log(adresse[i].properties.label);
      option += '<p onclick="setAdresse(this);">'+adresse[i].properties.label+'</p>';
   }
   list_villes.innerHTML = option;
}

function setAdresse(elem) {
   ville.value = elem.textContent;
   list_villes.innerHTML = '';
}

var markerO = L.icon({
   iconUrl: 'markerO.png',
   // shadowUrl: 'leaf-shadow.png',

   iconSize:     [24, 35], // size of the icon
   // shadowSize:   [50, 64], // size of the shadow
   // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
   // shadowAnchor: [4, 62],  // the same for the shadow
   // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var searchMarker = L.marker([0, 0], {icon: markerO}).addTo(carte);

function recherche() {
   list_villes.innerHTML = '';
   carte.removeLayer(searchMarker);
   if (ville.value != '') {
      $.ajax({
         url: "https://api-adresse.data.gouv.fr/search/?q="+ville.value+"&limit=1",
         success: function(data) {
            var lat = data.features[0].geometry.coordinates[0];
            var lon = data.features[0].geometry.coordinates[1];
            carte.setView([lon, lat], 14, { animation: true });
            searchMarker = L.marker([lon, lat], {icon: markerO}).addTo(carte);
            actualiseMap();
         },
         error: function(data) {
            console.log('error when search');
         }
      });
   }
}


var close = document.getElementsByClassName('close')[0];
var infos = document.getElementsByClassName('infos')[0];
close.addEventListener('click', () => {
   // console.log('ok');
   infos.classList.toggle('active');
});

//Leaflet map :

const span = document.querySelector('.fa');

var carte = L.map('maCarte', {center: [44.56, 6.08],zoom: 14,zoomControl: false});

////////////////////////////////////
//RAJOUTER LES DEUX PROCHAINES LIGNES
////////////////////////////////////
L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(carte);
L.control.zoom({position:'bottomright'}).addTo(carte);
//////////////////////////////////////////////
/////////////////////////////////////////////

carte.options.maxZoom = 14;
carte.options.minZoom = 12;

zone = new L.LayerGroup();
carte.addLayer(zone);
var bounds = carte.getBounds();
var northWest = bounds.getNorthWest(),
northEast = bounds.getNorthEast(),
southWest = bounds.getSouthWest(),
southEast = bounds.getSouthEast();

// carte.addEventListener('mousedown', () => {
//    actualiseMap();
// });

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

function readData(data) {
   var moy = 0;
   for (var i = 0; i < data.length; i++) {
      // getmeasure(data[i]._id, data[i].modules[0], scale, type, data_begin, data_end, limit, optimize, real_time);
      var mod = data[i].measures;
      var temp = data[i].measures[Object.keys(mod)[0]].res;
      for(var key in temp) {
         var time = new Date(key * 1000);
         var day = time.getDate();
         var month = time.getMonth();
         var year = time.getFullYear();
         var heures = time.getHours();
         var minutes = time.getMinutes();
         temp = temp[key][0];
         moy += temp;
      }
      temp = temp.toString();
      setMarker(data[i]._id,data[i].place.location[0], data[i].place.location[1], temp);
      span.className = 'fa fa-location-arrow';
   }
   inputTemp.value = (moy/data.length).toFixed(2) + '°C';
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

function setMarker(id, lat, lon, temp) {
   // console.log(lat, lon);
   var marker = L.marker([lon, lat]).bindTooltip(
      temp + '°C'
      ,{
         permanent: true,
         direction: 'right',
         opacity: 0.8,
         color: '#3388ff'
      }
   );
   marker.addEventListener('click', () => {
      console.log(temp);
      ////////////////////////////////////
      //RAJOUTER La PROCHAINE LIGNE
      ////////////////////////////////////
      var infos = document.getElementsByClassName('infos')[0];
      infos.classList.toggle('active');
   });
   marker.addTo(zone);
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
   if (ville.value != '') {
      $.ajax({
         url: "https://api-adresse.data.gouv.fr/search/?q="+ville.value+"&limit=10",
         success: function(data) {
            recupVilles(data.features);
         },
         error: function(data) {
            console.log('error when search');
         }
      });
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

var googleIcon = L.icon({
   iconUrl: 'locate.png',
   // shadowUrl: 'leaf-shadow.png',

   iconSize:     [30, 40], // size of the icon
   // shadowSize:   [50, 64], // size of the shadow
   // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
   // shadowAnchor: [4, 62],  // the same for the shadow
   // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var searchMarker = L.marker([0, 0], {icon: googleIcon}).addTo(carte);

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
            searchMarker = L.marker([lon, lat], {icon: googleIcon}).addTo(carte);
            actualiseMap();
         },
         error: function(data) {
            console.log('error when search');
         }
      });
   }
}


$(document).ready(function() {
  'use strict';

  $("#animal").material_select();
  $("#size").material_select();
  $("#age").material_select();

  let shelters = [];

  const clearListings = () =>
    $('#listings').empty();

  const renderSheltersNearby = () => {
    clearListings();

    for (const shelter of shelters) {
      const $sCol = $('<div>').addClass('col s4');
      const $sCard = $('<div>').addClass('card small hoverable');
      const $sTitle = $('<h6>').addClass('card-title truncate');
      const $sList = $('<ul>').addClass('card-content'); $sList.append(`<li>City: ${shelter.city}</li><li>Phone #:${shelter.phone}</li><li>Email: ${shelter.email}</li>`);
      $sTitle.text(shelter.name);
      $sCard.append($sTitle, $sList);
      $sCol.append($sCard);
      $('#listings').append($sCol);
    }
  }
  $('#quickSearch').submit(function(event) {
    shelters = [];
    event.preventDefault();
    let zip = $('#search').val();
    if (zip === '') {
      alert("Enter a valid zip code");
    } else {
      $.ajax({
        method: 'GET',
        url: `http://api.petfinder.com/shelter.find?key=b61b1dc779a15824738a2ab95fe28ed7&location=${zip}&format=json`,
        dataType: 'jsonp',
        success: function(data) {
          console.log(data.petfinder.shelters.shelter[0]);
          for (let i = 0; i < data.petfinder.shelters.shelter.length; i++) {
            const shelterObj = {
              id: data.petfinder.shelters.shelter[i].id.$t,
              name: data.petfinder.shelters.shelter[i].name.$t,
              email: data.petfinder.shelters.shelter[i].email.$t,
              phone: data.petfinder.shelters.shelter[i].phone.$t,
              addr1: data.petfinder.shelters.shelter[i].address1.$t,
              addr2: data.petfinder.shelters.shelter[i].address2.$t,
              city: data.petfinder.shelters.shelter[i].city.$t,
              country: data.petfinder.shelters.shelter[i].country.$t,
              latitude: data.petfinder.shelters.shelter[i].latitude.$t,
              longitude: data.petfinder.shelters.shelter[i].longitude.$t
            };
            shelters.push(shelterObj);
          }

          renderSheltersNearby();
        },
        error: function() {
          console.log('error logging data');
        }
      });
    }

  })


})

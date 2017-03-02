$(document).ready(function() {
  'use strict';

  $("#animal").material_select();
  $("#size").material_select();
  $("#age").material_select();
  $("#sex").material_select();



  let shelters = [];
  let animals = [];

  const clearListings = () =>
    $('#listings').empty();

  const renderSheltersNearby = () => {
    clearListings();

    for (const shelter of shelters) {
      const $sCol = $('<div>').addClass('col s4');
      const $sCard = $('<div>').addClass('card small hoverable');
      const $sTitle = $('<h6>').addClass('card-title truncate');
      const $sList = $('<ul>').addClass('card-content');
      $sList.append(`<li>City: ${shelter.city}</li><li>Phone #:${shelter.phone}</li><li>Email: ${shelter.email}</li>`);
      $sTitle.text(shelter.name);
      $sCard.append($sTitle, $sList);
      $sCol.append($sCard);
      $('#listings').append($sCol);
    }
  }

  $('#quickSearch').submit(function(event) {
    animals = [];
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

  $("#advSearch").submit(function(event){
    shelters = [];
    animals = [];
    event.preventDefault();
    let queryStart = `http://api.petfinder.com/pet.find?key=b61b1dc779a15824738a2ab95fe28ed7&format=json&`
    let queryOptions = $("#advSearch").serialize();
    let query = queryStart + queryOptions + "&callback=?";
    console.log(query);
    $.ajax({
      method: 'GET',
      url: query,
      dataType: 'jsonp',
      success: function(petData){
        console.log(petData.petfinder.pets.pet);
        for (let j = 0; j < petData.petfinder.pets.pet.length; j++) {
          const petObj = {
            name: petData.petfinder.pets.pet.name.$t,
            animal: petData.petfinder.pets.pet.animal.$t,
            age: petData.petfinder.pets.pet.age.$t,
            description: petData.petfinder.pets.pet.description.$t,
            gender: petData.petfinder.pets.pet.sex.$t,
            pic: petData.petfinder.pets.pet.media.photos.photo[2].$t,
            breed: petData.petfinder.pets.pet.breed[0].$t,
            id: petData.petfinder.pets.pet.id.$t,
            city: petData.petfinder.pets.pet.contact.city.$t,
            email: petData.petfinder.pets.pet.contact.email.$t,
            zipCode: petData.petfinder.pets.pet.contact.zip.$t,
            phone: petData.petfinder.pets.pet.contact.phone.$t
          };
          animals.push(petObj);
        }
      },
      error: function() {
        console.log('error logging data')
      }
    })

  })



})

$(document).ready(function() {
  'use strict';
  $('.modal').modal();
  $("#animal").material_select();
  $("#size").material_select();
  $("#age").material_select();
  $("#sex").material_select();



  let shelters = [];
  let pets = [];

  const clearListings = () =>
    $('#listings').empty();

  const renderSheltersNearby = () => {
    clearListings();

    for (const shelter of shelters) {
      const $sCol = $('<div>').addClass('col s4');
      const $sCard = $('<div>').addClass('card small hoverable');
      const $sTitle = $('<h6>').addClass('card-title truncate');
      const $sList = $('<ul>').addClass('card-content');
      $sList.append(`<li>City: ${shelter.city}</li><li>Phone #: ${shelter.phone}</li><li>Email: ${shelter.email}</li>`);
      $sTitle.text(shelter.name);
      $sCard.append($sTitle, $sList);
      $sCol.append($sCard);
      $("#listings").append($sCol);
    }
  }

  const renderPets = (pets) => {
    // console.log("inside render pets", pets);
    // console.log("inside render shelters", shelters);
    shelters = [];
    console.log($('#listings'));
    for (let pet of pets) {
      let $pCol = $('<div class="col s4">');
      let $pCard = $('<div>').addClass('card large hoverable');
      let $pTitle = $('<h6>').addClass('card-title center truncate');
      $pTitle.text(`${pet.name}`);
      let $pContent = $("<div>").addClass("card-content")
      let $pList = $('<ul>').addClass('card-content center');
      $pList.append(`<li>Animal: ${pet.animal}</li><li>Age:  ${pet.age}</li><li>Sex: ${pet.sex}</li><li>Breed: ${pet.breed}`);
      let $pImg = $('<img>').addClass("petPic center img-responsive");
      $pImg.attr({
        src: pet.pic,
        alt: pet.name
      });
      const $action = $("<div class='card-action row'>")
      const $contactBtn = $(`<button data-target=${pet.id} id="btn-${pet.id}" class="waves-effect waves-light btn modal-trigger col s6" contactBtn>`);

      $contactBtn.text('Contact Owner');
      const $descBtn = $('<button class="waves-effect waves-light btn col s6" id="descBtn">');

      $descBtn.text('More Info');
      $action.append($contactBtn, $descBtn);
      $pContent.append($pImg, $pList);
      $pCard.append($pTitle, $pContent, $action);
      // console.log("$pTitle", $pTitle[0]);
      // console.log("$pContent", $pContent[0]);

      let $cModal = $('<div>').addClass('modal').attr('id', pet.id);
      let $cModalContent = $("<div>").addClass("modal-content");
      let $cModalHeader = $("<h4>").text(pet.name);
      let $cModalList = $('<ul class="modal-content">');
      $cModalList.append(`<li>City: ${pet.city}</li><li>Zip Code:  ${pet.zipCode}</li><li>email: ${pet.email}</li><li>Phone: ${pet.phone}`);

      $cModalContent.append($cModalHeader, $cModalList);
      $cModal.append($cModalContent);

      $pCol.append($pCard, $cModal);

      $('#listings').append($pCol);

      $('#btn-' + pet.id).click(function(event){
        event.preventDefault();
        var target = $(event.target).data('target');
        console.log("you clicked: ", $(event.target).data('target'));
        $(`#${target}`).modal.open();

      })



    }
  }



  $('#quickSearch').submit(function(event) {

    pets = [];
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

  $("#submit").click(function(event) {

    event.preventDefault();
    shelters = [];
    pets = [];

    let queryStart = `http://api.petfinder.com/pet.find?key=b61b1dc779a15824738a2ab95fe28ed7&format=json&`
    let queryOptions = $("#advSearch").serialize();
    let query = queryStart + queryOptions;
    // console.log(query);
    $.ajax({
      method: 'GET',
      url: query,
      dataType: 'jsonp',
      success: function(petData) {
        let getBreed = (breeds) => {
          if (breeds.breed.hasOwnProperty('$t')) {
            return [breeds.breed.$t];
          } else {
            let arrayRet = [];
            for (let objects of breeds.breed) {
              arrayRet.push(objects.$t);
            }
            return arrayRet;
          }
        }
        // console.log('ajax success, pet sex is: ', petData.petfinder.pets.pet[0].sex.$t)
        for (let j = 0; j < petData.petfinder.pets.pet.length; j++) {
          let pet = petData.petfinder.pets.pet[j]
          console.log(pet, pet.sex);
          const petObj = {
            name: petData.petfinder.pets.pet[j].name.$t,
            animal: petData.petfinder.pets.pet[j].animal.$t,
            age: petData.petfinder.pets.pet[j].age.$t,
            description: petData.petfinder.pets.pet[j].description.$t,
            sex: petData.petfinder.pets.pet[j].sex.$t || 'unknown',
            pic: petData.petfinder.pets.pet[j].media.photos.photo[2].$t || 'No Pic Available',
            breed: getBreed(petData.petfinder.pets.pet[j].breeds),
            id: petData.petfinder.pets.pet[j].id.$t,
            city: petData.petfinder.pets.pet[j].contact.city.$t,
            email: petData.petfinder.pets.pet[j].contact.email.$t,
            zipCode: petData.petfinder.pets.pet[j].contact.zip.$t,
            phone: petData.petfinder.pets.pet[j].contact.phone.$t
          };
          pets.push(petObj);
        }
        // console.log(pets);
        renderPets(pets);
      },
      error: function() {
        console.log('error logging data')
      }
    })

  })



});

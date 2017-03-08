$(document).ready(function() {
  'use strict';


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
      const $sCol = $('<div>').addClass('col l4 m12 s12');
      const $sCard = $('<div>').addClass('card shelterCard hoverable');
      const $sTitle = $('<h6>').addClass('card-title center truncate shelterCardTitle');
      const $sList = $('<ul>').addClass('card-content');
      $sList.append(`<li>City: ${shelter.city}</li><li>Phone #: ${shelter.phone}</li><li>Email:<a href="mailto:${shelter.email}"> ${shelter.email}</a></li><li>Location: Shelter/adoption locations are unlisted here for privacy reasons, please e-mail the shelter for more information</li>`);
      $sTitle.text(shelter.name);
      $sCard.append($sTitle, $sList);
      $sCol.append($sCard);
      $("#listings").append($sCol);
    }
  }

  const renderPets = (pets) => {
    // console.log("inside render pets", pets);
    // console.log("inside render shelters", shelters);
    clearListings();
    shelters = [];
    for (let pet of pets) {
      let $pCol = $('<div class="col l4 m12 s12">');
      let $pCard = $('<div>').addClass('card medium hoverable petCard');
      let $pTitle = $('<h6>').addClass('card-title center truncate flex-text');
      $pTitle.text(`${pet.name}`);
      let $pContent = $("<div>").addClass("card-content")
      let $pList = $('<ul>').addClass('card-content center left-align');
      $pList.append(`<li>Animal: ${pet.animal}</li><li>Age:  ${pet.age}</li><li>Sex: ${pet.sex}</li><li>Breed: ${pet.breed}<li>City: ${pet.city}</li><li>Zip: ${pet.zipCode}</li>`);
      let $pImg = $('<img>').addClass("petPic center img-responsive");
      $pImg.attr({
        src: pet.pic,
        alt: pet.name
      });

      const $action = $("<div class='card-action row'>")
      const $contactBtn = $(`<a href="mailto:${pet.email}" class="waves-effect waves-light btn modal-trigger col s12 contactBtn">`);

      $contactBtn.text('Email Owner');

      $action.append($contactBtn);
      $pContent.append($pImg, $pList);
      $pCard.append($pTitle, $pContent, $action);
      // console.log("$pTitle", $pTitle[0]);
      // console.log("$pContent", $pContent[0]);
      $pCol.append($pCard);
      $('#listings').append($pCol);
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
          let shelterData = data.petfinder.shelters;
          for (let i = 0; i < shelterData.shelter.length; i++) {
            const shelterObj = {
              id: shelterData.shelter[i].id.$t,
              name: shelterData.shelter[i].name.$t,
              email: shelterData.shelter[i].email.$t,
              phone: shelterData.shelter[i].phone.$ || 'Unavailable',
              addr1: shelterData.shelter[i].address1.$t,
              addr2: shelterData.shelter[i].address2.$t,
              city: shelterData.shelter[i].city.$t,
              country: shelterData.shelter[i].country.$t
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
    let zipSel = $("#zipSel").val();
    let animalSel = $("#animal").val();
    let sizeSel = $("#size").val();
    let ageSel = $("#age").val();
    let sexSel = $("#sex").val();
    if (zipSel === '' || animalSel === '' || sizeSel === '' || ageSel === '' || sexSel === '') {
      alert("Please fill all required fields");
    } else {
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
        let petsData = petData.petfinder.pets;
        for (let j = 0; j < petsData.pet.length; j++) {
          // console.log(pet, pet.sex);
          const petObj = {
            name: petsData.pet[j].name.$t,
            animal: petsData.pet[j].animal.$t,
            age: petsData.pet[j].age.$t,
            description: petsData.pet[j].description.$t,
            sex: petsData.pet[j].sex.$t || 'unknown',
            pic: petsData.pet[j].media.photos.photo[2].$t || 'No Pic Available',
            breed: getBreed(petsData.pet[j].breeds),
            id: petsData.pet[j].id.$t,
            city: petsData.pet[j].contact.city.$t,
            email: petsData.pet[j].contact.email.$t || 'unknown',
            zipCode: petsData.pet[j].contact.zip.$t,
            phone: petsData.pet[j].contact.phone.$t
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
    }
  })
});

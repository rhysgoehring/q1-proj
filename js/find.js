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
          let $pCard = $('<div>').addClass('card hoverable');
          let $pTitle = $('<h6>').addClass('card-title truncate');
          $pTitle.text(`${pet.name}`);
          let $pContent = $("<div>").addClass("card-content center")
          let $pList = $('<ul>').addClass('card-content center');
          $pList.append(`<li>Animal: ${pet.animal}</li><li>Age:  ${pet.age}</li><li>Sex: ${pet.sex}</li>`);
          let $pImg = $('<img>').addClass("petPic img-responsive");
          $pImg.attr({
            src: pet.pic,
            alt: pet.name
          });

          $pContent.append($pImg, $pList);

          $pCard.append($pTitle, $pContent);
          console.log("$pTitle", $pTitle[0]);
          console.log("$pContent", $pContent[0]);
          $pCol.append($pCard);


          $('#listings').append($pCol);


          // const $action = $("<div class='card-action center'>")
          // const $contactBtn = $("<a>");
          // $contactBtn.addClass("waves-effect waves-light btn modal-trigger");
          // $contactBtn.attr('href', `#${pet.id}`);
          // $contactBtn.text('Contact Owner');
          // const $descBtn = $("<a>");
          // $descBtn.addClass("waves-effect waves-light btn modal-trigger");
          // $descBtn.attr('href', `#${pet.id}`);
          // $descBtn.text('More Info');
          // $action.append($contactBtn, $descBtn);
          // $pCard.append($action);
          // $pCol.append($pCard);

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
            success:
            function(petData) {
              let getBreed = (breeds) => {
                if(breeds.breed.hasOwnProperty('$t')){
                  return [breeds.breed.$t];
                }
                else {
                  let arrayRet = [];
                  for(let objects of breeds.breed){
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
                  pic: petData.petfinder.pets.pet[j].media.photos.photo[2].$t,
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

rhysCue

My project is called rhysCue, it solves the problem of people looking for local animal shelters and
areas where pets can be adopted or rescued.

Over the years, I've had friends and family who have wanted to find a new pet through a rescue shelter
or adoption but didn't have a great way to find a collection of different options and had to stop by
local shelters looking for a specific type/breed of animal.

rhysCue solves this problem by allowing you to search simply for shelters and adoption centers nearby,
but also with a more advanced search that allows you to get more specific with your search and filter by
what kind of pet you're looking for along with its age, gender and size.

I used the PetFinder API, initially I wanted to use RescueGroups.org because it's a non-profit and they had a lot more data, but they were hosting their docs on AWS and it was down a day we were working on the project so I made a quick switch. Although PetFinder has less data and is far less organized, I was able to get some key attributes the user could include in their query.

I used Materialize for my front-end CSS framework, jQuery for AJAX calls, and HTML, vanilla JavaScript and some custom CSS to make rhysCue not look like a Google service.

The most valuable piece of feedback I got was asking if I had plans to expand the search function so you could search by breeds. This is a feature I really wanted to include, unfortunately the data from PetFinder was a little inconsistent and sometimes multiple breeds were crammed together in a single word.

The biggest challenge I had to overcome was finding data that was consistent enough to query. While there was an email data attribute, the address attribute often was an email address, and phone numbers for shelters were severely lacking.

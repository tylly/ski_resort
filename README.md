### Project Planning

###

User stories

This will be personal ski resort tracker that will allow the user to store
ski resorts of their preference/relevance to their created account, and then request and show data about them. This is made possible by the snocountry API and openweathermap API. Unsplash API will be used for site styling.

The home page will be a sign in/create account page. On the sign in page, the user will enter some info, including their location. After logging in, the user will come to their home page where data such as the forecast and snow quality about any resorts they have chosen are displayed, as well as suggested resorts based on their location (as provided in their account details).

There will be extra emphasis on the user's chosen home resort, as well as the users chosen home region/state. There will also be a nav bar that will house New Resort, New Region, My Resorts(s) and login/logout tabs.

On the new resort window page, the user can search any ski resport by name. They can then view this resorts stats and weather, and choose to add it to their list of resorts. The same applies to region.

They can also select/change which resort is their home resort, which can also be done on the profile settings page. This applies to regions as well. A stretch would be to add the ability to upload photos to each resort on a users profile.

###

Models

Users: Will store usernames and passwords

States: Will store state codes and names so weather can be requested from openweather api.

Regions: Will store regions users add to their accounts.

Resorts: This model will hold the resorts saved by users to their accounts so that subdocs may exists.

###

Technologies

Vanilla javascript, express, MongoDB, Mongoose, liquid express views for templating, snocountry api, openweather api

###

Routes

Users - Signup, Sign In, Edit Account Info, Add Photos

Resorts - Search Resorts, Show resort(s), add to my resorts, show my resorts, edit my resorts.

Regions - Search Regions, Show region, add to my regions, show my regions, delete my regions

Seed - will supply site with photos from Unsplash API for backgorund use

###

ERD notes

users database

username: {
type: String,
required: true,
unique: true
}, password {
type: String,
required: true
}


Resorts collection

name: {
type: String,
required: true
}
resort_id: {
type: string,
required: true
},
icon: String,



Regions collection

name: String

owner: {
type: Schema.Types.ObjectId,
ref: 'User',
required: true
}



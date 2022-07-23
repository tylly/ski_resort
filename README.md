# Project Planning

# User stories

This will be personal ski resort tracker that will allow the user to store
ski resorts of their preference/relevance to their created account, and then request and show data about them. This is made possible by the snocountry API and openweathermap API. Unsplash API will be used for site styling.

The home page will be a sign in/create account page. On the sign in page, the user will enter some info, including their location. After logging in, the user will come to their home page where data such as the forecast and snow quality about any resorts they have chosen are displayed, as well as suggested resorts based on their location (as provided in their account details).

There will be extra emphasis on the user's chosen home resort, as well as the users chosen home region/state. There will also be a nav bar that will house New Resort, New Region, My Resorts(s) and login/logout tabs.

On the new resort window page, the user can search any ski resport by name. They can then view this resorts stats and weather, and choose to add it to their list of resorts. The same applies to region.

They can also select/change which resort is their home resort, which can also be done on the profile settings page. This applies to regions as well. A stretch would be to add the ability to upload photos to each resort on a users profile.

# Installation

To use this app locally, you will need to adjust the connection.js file and server.js file.
You will need to create an .env file, make sure you have a SECRET=XXX, APIURL=(API url call), DATABASE_URI=(local network address for database) or MONGODB_URI=(mongodb cloud path) and PORT=(port number)

You will need to run in your terminal in the root directory of the project:
```console
$ npm install
```

# Link to live site on Heroku:

https://my-ski-resorts.herokuapp.com/


# Technologies

Vanilla javascript, express, MongoDB, Mongoose, liquid express views for templating, snocountry api, openweather api

#### API info
http://feeds.snocountry.net/
https://openweathermap.org/api
The open weather map will require you to generate an API key for free.


# Routes

Users - Signup, Sign In, Edit Account Info, Add Photos

Resorts - Search Resorts, Show resort(s), add to my resorts, show my resorts, edit my resorts.

Regions - Search Regions, Show region, add to my regions, show my regions, delete my regions

Seed - will supply site with photos from Unsplash API for backgorund use

|Name|Path|HTTP Verb:|Purpose|
|:---|:---|:---|:---|
|Show|/users/signup|GET|sign up form to create an account|
|Create|/users/signup|POST|create an account|
|Show|/users/login|GET|log in form for existing user|
|Create|/users/login|POST|log in and create session|
|New|/users/logout|GET|logs out user and destroys  session|
|Create|/resorts/|POST|add resort to DB with signed in user as owner|
|Index|/resorts/home|GET|display signed in user's resorts and regions if there are any and their repsective api data|
|Destroy|/resorts/home|DELETE|remove a resort from user's resorts and the db|
|Index|/resorts/home|GET|display signed in user's resorts and regions|
|New|/resorts/new|GET|search page for resorts|
|New|/resorts/new|POST|view searched resort's API data|
|Create|/resorts/|POST|add resort to DB with signed in user as owner|
|Show|/resorts/show/:resortId|GET|show page for an individual resort owned by the user|
|Update|/resorts/update|PUT|updates resorts to home or not home resort|
|Seed|/resorts/seed|GET|adds states and countries to the DB for use with openweather API|
|Destroy|/regions/delete/:regionName|DELETE|remove region from users regions and db|
|New|/regions/new|GET|search form for new regions|
|New|/regions/new|POST|search for new region with API call|
|Create|/regions|POST|add region to DB with signed in user as owner|
|Show|/regions/show/regionId|GET|show page for individual region owned by user|



# Models

##### users collection

username: {
type: String,
required: true,
unique: true
}, password {
type: String,
required: true
}


##### Resorts collection

name: {
type: String,
required: true
}
resort_id: {
type: string,
required: true
},
icon: String,



##### Regions collection

name: String

owner: {
type: Schema.Types.ObjectId,
ref: 'User',
required: true
}



### Project Planning

### 
User stories

This will be personal ski resort tracker that will allow the user to store
ski resorts of their preference/relevance to their created account, and then request and show data about them. This is made possible by the snocountry API and openweathermap API. Unsplash API will be used for site styling. 

The home page will be a sign in/create account page. On the sign in page, the user will enter some info, including their location. After logging in, the user will come to their home page where data such as the forecast and snow quality about any resorts they have chosen are displayed, as well as suggested resorts based on their location (as provided in their account details). 

There will be extra emphasis on the user's chosen home resort, as well as the users chosen home region/state. There will also be a nav bar that will house  New Resort, New Region, My Resorts(s) and profile settings tabs. 

On the new resort window page, the user can search any ski resport by name. They can then view this resorts stats, and choose to add it to their list of resorts. The same applies to region. 


On the My Resorts page, the user can rate and comment on their resorts. They can also select/change which resort is their home resort, which can also be done on the profile settings page. This applies to regions as well. A stretch would be to add the ability to upload photos to each resort on a users profile.

### 
Models

Users: Will store usernames and passwords

Site_photos: Will store photos from Unsplash's API that will be used for rotating site background

User_photos: Part of a stretch goal, but will hold photos uploaded by users that will share a relationship with the resort the photo is from.

Resorts: This model will hold the resorts saved by users to their accounts so that subdocs may exists. 

###
TODO's

As I will be using a combination between snoCountry and openweather map, I will need to find a way to modifiy/use search queries so that they satisfy both APIs' query parameters. Will need to somehow find the zip code of the resort the user is searching, and preferably not by having the user entre it manually. 


###
Routes

Users - Signup, Sign In, Edit Account Info, Add Photos

Resorts - Search Resorts, Search Regions, Show resort(s), show regions, add to my resorts, show my resorts, edit my resorts

Seed - will supply site with photos from Unsplash API for backgorund use

Comments/Likes - Post Likes and comments on users own list of resorts. 

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


Resorts database

name: String,
region: String,
resort_id: String,
base Depth: Number,
new Snow: Number,
current Weather: String,
next 48: String,
next 7 days: String


site  Photos database

url: {
    type: String,
    required: true
}

User Photos Database:

I have never done this before so im not entirely sure how these docs will look




# TMDBMoviesApp

> App showing movies from TMDB API

> React Native & Context API & React Hooks & Functional components

![](Screenshot1.png)
![](Screenshot2.png)
![](Screenshot3.png)
![](Screenshot4.png)
![](Screenshot5.png)

## Main Features
* Login to application using Facebook or Google account
* Main page showing most popular movies from TMDB
* App header shows user profile picture and favorites button
* After clicking a movie a modal pops up and showing:
  * Movie title
  * Year
  * Rating
  * Overview
  * Add/Remove from favorites button
* Each movie can be added to favorites
* Clicking header favorites button opens favorites screen
  On this screen user can view and delete current favorite movies

## Development setup

For login to work properly please setup this application in facebook and google APIs

1. Clone
2. Run `npm install` on main folder.
3. Set .env file on main folder:
```sh
GOOGLE_CID=Google API client id
GOOGLE_CSECRET=Google API client secret
TMDB_KEY=TMDB API key
```
4. Setup Facebook API App ID:
 * Open `android/app/res/values/strings.xml` file.
 * Edit string element with the name attribute `facebook_app_id`
   and value as your Facebook App ID to the file
   `<string name="facebook_app_id">Facebook App ID</string>`

5. Run `react-native run-android`

## Meta

Liron Perel – lironp90@gmail.com

[https://github.com/lironperel/TMDBMoviesApp](https://github.com/lironperel/TMDBMoviesApp)

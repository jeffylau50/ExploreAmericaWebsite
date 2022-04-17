# Explore America | Travel Website

This full Stack Travel Website built with EJS, Node.js & MongoDB.

Deployed on Heroku: [frozen-anchorage-09220.herokuapp.com/]

Front End: HTML, CSS, Bootstrap, Javascript, EJS Templating Engine
Back End: Node.js, Express.js, MongoDB  
Deployment: Heroku  

***This Online Chat App achieved a score of 90%+ on Google PageSpeed Insights***

***Window 10 PC Demo***

<img src="https://github.com/jeffylau50/ExploreAmericaWebsite/blob/master/demo/EAPCdemo.gif"/>


## Responsive Mobile Design

Although this app was mainly developed for the desktop web platform, mobile adaptability was also one of the main focus of this project. Therefore, Responsive design was used in this project. This chat app should work on most mobile devices as shown below.

***iPhone 11 Demo***

<img src="https://github.com/jeffylau50/ExploreAmericaWebsite/blob/master/demo/EAmobileDemo.gif" width="414" height="900"/>

## Table of Contents

- [Installation](#installation)
- [Feature](#feature)
- [Performance](#Performance)

## Installation  
  
### Setup

> Install npm packages and npm start

```shell
$ npm install
$ node app.js

```

---

## Feature

### Sign in and Register Methods

1. Built in Email/ Username/ Password Login system

### Icon and Display Name Feature

1. For users that signed in with their Google account. Orange Chat will use their default Google account profile picture and name as their chat icon/display name in the app.

2. For users that registered via the built in Email/ Password system, users will get to choose their own display name and a randomly assigned in-app icon which can be chosen in the register page. 

<img src='https://res.cloudinary.com/djgjwxdih/image/upload/v1650176141/github/IconRandom_k0v6pp.gif'>

### Emoji Picker

Unlike mobile platform, desktop/laptop users may not have easy access to Emoji since most personal computer operating system does not come built in with an Emoji keyboard. Therefore, I added an Emoji Picker into the application for better user experience.

<img src="https://github.com/jeffylau50/OnlineChatApp/blob/master/demo/emojiDemo.PNG"/>



## Performance

### Client Side Routing

Instead of traditional server side routing, I opted to use client side routing with react router dom. This can greatly improved user experience because every component is rendered all at once which eliminated the loading process between different pages of the site. As a result, this makes the entire application appears to run a lot smoother for the user.

### Performance Scores

***This Online Chat App achieved a score of 90%+ on Google PageSpeed Insights***

<img src="https://github.com/jeffylau50/ExploreAmericaWebsite/blob/master/demo/testResult.PNG"/>

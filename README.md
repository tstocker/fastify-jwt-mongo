# fastify-jwt-mongo

This project is a init project for an api with fastify, a node framework.
It use a jwt token for users sessions and mongodb as database.

`note: this project is a good start for api witch need jwt token sessions, not for the objectives i have now. So i let this projet in stand-by. a made a fork for cookie sessions users for common websites witch needs users sessions.`

## Last updates

- Refactoring register/user.js, explode code for factorisation usage with a user manager witch contains 
users fonctionalities and db requests.
- Adding md5 encoding and salt on passwords.

## Requirement

You need `nodejs`, `npm` and `mongodb` you can look at theirs own installation documentations.
 
You can also use `yarn` as i'll do.
  
## Installation

Clone this repository ad then install dependecies with :

```bash
yarn install
```
Next step is configure your own fastify.api
```bash
cp config.js.dist config.js
```

Edit your own `config.js` and set your 
- jwt secret,
- port (default is 3000)
- mongodb path
- mongodb name

## Start api

You need to start mongodb first either you will get connections errors

```bash
yarn start
```
or
```bash
node api
```

## Api doc
I will give a documentation add postman config for this api as soon as possible.

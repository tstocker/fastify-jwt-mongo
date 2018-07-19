# fastify-jwt-mongo

This project is a init project for an api with fastify, a node framework.
It use a jwt token for users sessions and mongodb as database.


##Requirement

You need `nodejs`, `npm` and `mongodb` you can look at theirs own installation documentations.
 
You can also use `yarn` as i'll do.

##Installation

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

```bash
yarn start
```
or
```bash
node api
```

## Api doc
I will give a documentation add postman config for this api as soon as possible.

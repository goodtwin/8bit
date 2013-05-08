# [8 Bit Omaha](http://8bitomaha.com)

## Steps for install

1. ```npm install``` from this directory.

2. ```bower install```

3. ```grunt``` to build or ```grunt server``` for a quick local server.

4. after building serve up ```\dist```. run node server to receive the contact for if you so choose.


## What in the eff is this?

One of GoodTwin's designers started drawing eight bits of friends as a stress reliever / creative mental exercise. We thought they were insteresting art. So we decided to whip up a site using all parts of [yeoman](http://yeoman.io/) as a simple proof of concept around the workflow.

## Tech stack

* Node
* Express (barely used)
* Angular
* RequireJS
* Grunticon for generating SVG fallbacks

So the near stack? grean stack?

## What can I learn from this?

Check out the Grunfile.js to see the goodness of this project. The Gruntfile.js created by the scaffolding is a great starting point for making sure you are completing the right build tasks for any web development project.

The basics of the setup:

* Got the app rolling quickly with ```yo angular```
* Added in [grunt-bower-requirejs](https://github.com/yeoman/grunt-bower-requirejs) to easily incorporate components pulled in with bower into the [require.js paths config](http://requirejs.org/docs/api.html#config). Modified GruntFile.js accordingly
* Added [grunticon](https://github.com/filamentgroup/grunticon) for handling SVG images with appropriate fallbacks.

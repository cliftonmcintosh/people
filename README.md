# People
A simple project for a RESTful API for people and families. The RESTful service in the people-api directory is built with [Spring Boot](http://projects.spring.io/spring-boot/) and [Spring Data Rest](http://projects.spring.io/spring-data-rest/). The UI in the people-ui
is built with AngularJS.

The API and the UI are intended to be run separately. Directions are offered below.

## Setting up the UI

The people-ui part of the project can be set up and run via grunt. You will need node, the grunt-cli, bower and npm (which comes with node) From within the people-ui directory, run

`bower install`

then

`npm install`

## Running the UI

From within the people-ui directory run 

`grunt serve`

The UI will be available on port 9000 at 

`http://localhost:9000/#/`

There are two views, one for people, and one for families.

### Don't want to have to run with grunt?

A zipped dist folder for the UI has been provided. You don't even need a server for the UI. You can just open the index.html file in a browser and go from there. But if you want something nicer, you can start up the ui a simple web server such as Python's SimpleHTTPServer on whatever port you want (try to avoid 8080 since that is where the API is set to run) by unzipping the dist, changing into the root directory and running, like this:

`python -m SimpleHTTPServer 9000`

## Running the RESTful web service
The people-api part of the project includes a Gradle wrapper and can be run from the people-api directory by invoking bootRun with the wrapper:

`./gradlew bootRun`

## Using the API

### Accessing the API
The root of the API is `http://localhost:8080`.

The root of the API provides documentation on the structure, including a list of endpoints. The `http://localhost:8080/alps` endpoint provides metadata about the structure of the application.

### Creating a person
To create a person, POST JSON to the people endpoint:

`curl -v -H "Content-Type: application/json" -X POST -d '{"firstName":"Paul","lastName":"Murphy"}' http://localhost:8080/people`

On success, a 201 response will include a Location header for the record created:

`Location: http://localhost:8080/people/6`

### Creating a family
To create a family, POST JSON with an empty people list:

`curl -v -H "Content-Type: application/json" -X POST -d '{"people": []}' http://localhost:8080/families`

On success, a 201 response will include a Location header for the record created:

`Location: http://localhost:8080/families/3`

People cannot be created by posting a person JSON structure in the body of the family-creation POST. People must be created through the people endpoint and then have a family attached to them with a PUT to the person's family endpoint:

`curl -v -X PUT -H "Content-Type: text/uri-list" -d "http://localhost:8080/families/3" http://localhost:8080/people/6/family`

### Removing a person from a family
Removing a person from a family is done by making a DELETE request to the person's family endpoint:

`curl -i -H "Accept: application/json" -X DELETE http://localhost:8080/people/6/family`

This dissolves the association between the person and the family. It does not delete the family, even when the person is that last person associated with the family.

### Deleting a family
Deleting a family is done by making a DELETE request to the family's endpoint:

`curl -i -H "Accept: application/json" -X DELETE http://localhost:8080/families/3`

This deletes the family. It dissolves the family and removes each person's association with that family, but it does not kill its people.

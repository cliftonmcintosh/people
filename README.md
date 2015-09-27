# People
A simple project for a RESTful API for people and families. This project is built with [Spring Boot](http://projects.spring.io/spring-boot/) and [Spring Data Rest](http://projects.spring.io/spring-data-rest/).

# Running the project
The project includes a Gradle wrapper and can be run by invoking bootRun with the wrapper:

`./gradlew bootRun`

# Using the API

## Accessing the API
The root of the API is `http://localhost:8080`.

The root of the API provides documentation on the structure, including a list of endpoints. The `http://localhost:8080/alps` endpoint provides metadata about the structure of the application.

## Creating a person
To create a person, POST JSON to the people endpoint:

`curl -v -H "Content-Type: application/json" -X POST -d '{"firstName":"Paul","lastName":"Murphy"}' http://localhost:8080/people`

On success, a 201 response will include a Location header for the record created:

`Location: http://localhost:8080/people/6`

## Creating a family
To create a family, POST JSON with an empty people list:

`curl -v -H "Content-Type: application/json" -X POST -d '{"people": []}' http://localhost:8080/families`

On success, a 201 response will include a Location header for the record created:

`Location: http://localhost:8080/families/3`

People cannot be created by posting a person JSON structure in the body of the family-creation POST. People must be created through the people endpoint and then have a family attached to them with a PUT to the person's family endpoint:

`curl -v -X PUT -H "Content-Type: text/uri-list" -d "http://localhost:8080/families/3" http://localhost:8080/people/6/family`

## Removing a person from a family
Removing a person from a family is done by making a DELETE request to the person's family endpoint:

`curl -i -H "Accept: application/json" -X DELETE http://localhost:8080/people/6/family`

This dissolves the association between the person and the family. It does not delete the family, even when the person is that last person associated with the family.

## Deleting a family
Deleting a family is done by making a DELETE request to the family's endpoint:

`curl -i -H "Accept: application/json" -X DELETE http://localhost:8080/families/3`

This deletes the family. It dissolves the family and removes each person's association with that family, but it not kill its people.

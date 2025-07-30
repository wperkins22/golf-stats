# Golf Stats API

## Description
This is an api to interact with a golf_stats database. 

## Features
Allows user to save golf course and round data, including golf course rating, slope, length and round scores, plus other data.
User can save, retrieve, update, and delete course and round data.

## Getting Started
### Database setup
This project was intended for personal, local use. If you would like to use this API, a local database is required to be set up. PostgreSQL is recommended. To set up the database...
1. After PostreSQL is installed, connect to it by running ***psql -U postgres*** in a Command Line Interface
2. Create a new psql role: ***CREATE ROLE db_user WITH LOGIN PASSWORD 'password';***
3. Alter the role: ***ALTER ROLE db_user WITH CREATEDB;***
4. Disconnect from current psql session: ***\\q***
5. Reconnect using new role: ***psql -d postgres -U db_user***
6. Create the database: ***CREATE DATABASE golf_stats;***
7. Connect to the database: ***\\c golf_stats***
8. Copy and paste the ***CREATE TABLE*** statements from the database.sql file to create the database's tables
### API Usage
1. Download the code from GitHub
2. Navigate to the directory that the project was downloaded to using CLI and run ***npm install*** to install dependencies.
3. To start server listening, run ***npm start*** from the CLI
5. You must use an API platform to interact with the API. Postman is recommended. Requests will be sent to the URLs http://localhost:3001/courses and http://localhost:3001/rounds. The current supported operations are:
    * POST http://localhost:3001/courses to add a new course to the database. Will need to include request body with name, rating, slope, length_yd, public, location_city, location_state fields
    * GET http://localhost:3001/courses to get a list of all courses in the database
    * GET http://localhost:3001/courses?name={courseName} to search courses based on course name (replace {courseName} with course name) (use %20 in place of spaces in the course name). This will return 0, 1 or many courses
    * GET http://localhost:3001/courses?location_state={courseState} to search courses based on the state they are in (replace {courseState} with 2-digit state abbreviation). This will return 0, 1 or many courses
    * GET http://localhost:3001/courses/{id} to search courses based on course ID (replace {id} with course ID)
    * PUT http://localhost:3001/courses/{id} to update a course's data based on course ID (replace {id} with course ID). Will need to include request body with name, rating, slope, length_yd, public, location_city, location_state fields
    * DELETE http://localhost:3001/courses/{id} to remove a course's data from the database based on course ID (replace {id} with course ID)
    * POST http://localhost:3001/rounds to add a new round to the database. Will need to include request body with date, played_18, front_9_score, back_9_score, total_score and course_id fields
    * GET http://localhost:3001/rounds to get a list of all rounds in the database
    * GET http://localhost:3001/rounds/{id} to search rounds based on round ID (replace {id} with round ID)
    * PUT http://localhost:3001/rounds/{id} to update a round's data based on round ID (replace {id} with course ID). Will need to include request body with date, played_18, front_9_score, back_9_score, total_score and course_id fields
    * DELETE http://localhost:3001/rounds/{id} to remove a round's data from that database based on round ID (replace {id} with round ID)

## Technologies
This project uses the JavaScript programming language and depends on Node.js, Express.js, Morgan, CORS, body-parser and PG. PostgreSQL was used to create my personal instance of the database.
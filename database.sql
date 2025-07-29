CREATE TABLE course (
    id serial PRIMARY KEY,
    name varchar(200) NOT NULL,
    rating double precision NOT NULL,
    slope int NOT NULL,
    length_yd int NOT NULL,
    public boolean,
    location_city varchar(200) NOT NULL,
    location_state varchar(2) NOT NULL
);

CREATE TABLE round (
    id serial PRIMARY KEY,
    date date NOT NULL,
    played_18 boolean NOT NULL,
    front_9_score int,
    back_9_score int,
    total_score int NOT NULL CHECK (total_score = front_9_score + back_9_score),
    course_id int REFERENCES course (id)
);
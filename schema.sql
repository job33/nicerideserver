CREATE TABLE rides (
  id serial primary key,
  rideFrom character varying(30) NOT NULL,
  rideTo character varying(30) NOT NULL,
  date character varying(20) NOT NULL,
  depTime character varying(10) NOT NULL,
  seatsAvailable integer NOT NULL,
  cost integer NOT NULL
);

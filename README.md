# This is UI application for Patients Records app

It has the features for CRUD operations on Patient, Doctor, Visits, Dignosis, Patients Dashboard, Cohorts (enables users to save queries/filters for reuse)

# How to run

From the root of project, run following commands

docker build -t healthrecord-ui . 
docker run -p 80:80 healthrecord-ui

OR

npm start

The app is configured to call backend api's on localhost:8080



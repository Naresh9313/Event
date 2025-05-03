1step :Clone for Github  git clone "https://github.com/Naresh9313/Event-Registration-System.git"

2step: frontend & backend  both are  npm i   
       frontend side run in : npm start 
       backend  side run in : nodemon index.js

#Mail
EMAIL_HOST=smtp.gmail.com      
EMAIL_PORT=587                   
EMAIL_SECURE=false                
EMAIL_USER=Email Id,
EMAIL_PASS=App password,
EMAIL_FROM="Event App "

#Mongodb  connection 
MONGODB_URI=mongodb://localhost:27017/EventRegistrationSystem

![image](https://github.com/user-attachments/assets/28e79482-6aa7-45e7-b36c-e7373ccff7fe)

users
![image](https://github.com/user-attachments/assets/a9602531-9cdf-4eb2-a22d-c0cfe9569abc)

event
![image](https://github.com/user-attachments/assets/e68affed-73ee-48ac-914c-fd448e12a1fa)

register
![image](https://github.com/user-attachments/assets/e8b7fa84-4e25-4e16-b460-9717912e6142)


3 step :  
register api  url POST
http://localhost:5000/api/auth/register 
Example {
  "name": "Naresh Prajapati",
  "email": "naresh123.com",
  "password": "password123"
}
![image](https://github.com/user-attachments/assets/8c4344ed-81cf-4437-b403-b2273f8c1abf)

login api url POST
http://localhost:5000/api/auth/login

Example{
  "email": "naresh123.com",
  "password": "password123"
}
![image](https://github.com/user-attachments/assets/419ba083-76a8-44b8-9d0e-975955665158)






Event api  url POST
Authorization select Bearer Token-> paste token
headers ma key ma  select  Authorization & value ma token 
http://localhost:5000/api/events/
Example {
  "title": "Naresh Prajapati",
  "description": "Latest in tech",
  "date": "2025-06-15T10:00:00Z",
  "location": "Ahmedabad",
  "totalSeats": 50
}
![image](https://github.com/user-attachments/assets/c5d0f9c9-faf1-40bf-b817-f013539d49e5)


Register Event url POST
Authorization select Bearer Token-> paste token
headers ma key ma  select  Authorization & value ma token 
http://localhost:5000/api/events/<eventId>/register
![image](https://github.com/user-attachments/assets/84e9cef8-7d85-47b3-92fc-705dce7f75ab)



Event url GET
Authorization select Bearer Token-> paste token
headers ma key ma  select  Authorization & value ma token 
http://localhost:5000/api/events
![image](https://github.com/user-attachments/assets/7a4fadb7-e977-40e8-9024-4a6c02d5baed)



4 step: frontend run to npm start in login to api are generate email & passsword to enter and login the event system

Ex:  
 "email": "naresh@example.com",
 "password": "password123"


5 Step:  Add event in api thi
Event api  url POST
Authorization select Bearer Token-> paste token
headers ma key ma  select  Authorization & value ma token 
http://localhost:5000/api/events/
{
  "title": "Naresh Prajapati",
  "description": "Latest in tech",
  "date": "2025-06-15T10:00:00Z",
  "location": "Ahmedabad",
  "totalSeats": 50
}


& show available event & category by default categry Other

step 5: My Profile  show not event regsiter profile are balnk event register show in profile


step 6:event register mail to confirmation are provide register has been succesfully event.

setp 7: logout functionality


 
![image](https://github.com/user-attachments/assets/706f9bcc-96b7-4341-8df5-27aa2543fb04)
![image](https://github.com/user-attachments/assets/35065e14-4723-4fe2-b34d-b52eb87a4ee3)
![image](https://github.com/user-attachments/assets/63ac478e-c232-4fff-9a93-1d20bb285d23)
![image](https://github.com/user-attachments/assets/6833a4c5-7b85-49d0-a54a-4b6c90afccc3)
![image](https://github.com/user-attachments/assets/16d5cd79-3c37-472d-bbb7-2aeeeb3bd069)
![image](https://github.com/user-attachments/assets/7ea8e872-16e6-401b-8027-858759fd7c43)
![image](https://github.com/user-attachments/assets/2024e70a-8db1-4c7d-a757-1017cf0dcc2e)















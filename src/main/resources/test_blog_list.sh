# mysql
truncate table user;
truncate table friendship;
truncate table friendship_application;
truncate table blog;

# create three new user
curl -X POST http://localhost:8080/user/register \
-H "Content-Type: application/json" \
-d '{
"username": "YunjieWei",
"password": "123456",
"gender": "male",
"birthday": "2000-01-01",
"education": "Bachelor",
"nationality": "CN",
"hasImage":1,
"imageId":1
}'

curl -X POST http://localhost:8080/user/register \
-H "Content-Type: application/json" \
-d '{
"username": "Tom",
"password": "123456",
"gender": "male",
"birthday": "2000-01-01",
"education": "Bachelor",
"nationality": "CN",
"hasImage":0,
"imageId":null
}'

curl -X POST http://localhost:8080/user/register \
-H "Content-Type: application/json" \
-d '{
"username": "Jerry",
"password": "123456",
"gender": "male",
"birthday": "2000-01-01",
"education": "Bachelor",
"nationality": "CN",
"hasImage":0,
"imageId":null
}'
# login three user
curl -X POST http://localhost:8080/user/login \
-H "Content-Type: application/json" \
-d '{"username":"YunjieWei","password":"123456"}'


curl -X POST http://localhost:8080/user/login \
-H "Content-Type: application/json" \
-d '{"username":"Tom","password":"123456"}'


curl -X POST http://localhost:8080/user/login \
-H "Content-Type: application/json" \
-d '{"username":"Jerry","password":"123456"}'

# gain friendship between user1 and user2
curl -X POST http://localhost:8080/friend/request \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b" \
-H "Content-Type: application/json" \
-d '{
  "uid2": "2",
  "detail": "Hello, 1 to 2"
}'


curl -X POST http://localhost:8080/friend/judge \
-H "uid: 2" \
-H "token: 0b2a8e2f4e4246868cf224029ff5e7c5" \
-H "Content-Type: application/json" \
-d '{
"uid": "1",
"uid2": "2",
"status": "ACCEPTED"
}'

# create 9 different kind of permission blog

curl -X POST http://localhost:8080/blog/submit \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b" \
-H "Content-Type: application/json" \
-d '{ "title":"PRIVATE 1", "content": "c", "hasImage":0, "imageId":null, "permission":"PRIVATE" }'

curl -X POST http://localhost:8080/blog/submit \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b" \
-H "Content-Type: application/json" \
-d '{ "title":"PUBLIC 1", "content": "c", "hasImage":0, "imageId":null, "permission":"PUBLIC" }'

curl -X POST http://localhost:8080/blog/submit \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b" \
-H "Content-Type: application/json" \
-d '{ "title":"FRIEND 1", "content": "c", "hasImage":0, "imageId":null, "permission":"FRIEND" }'

curl -X POST http://localhost:8080/blog/submit \
-H "uid: 2" \
-H "token: 0b2a8e2f4e4246868cf224029ff5e7c5" \
-H "Content-Type: application/json" \
-d '{ "title":"PRIVATE 2", "content": "c", "hasImage":0, "imageId":null, "permission":"PRIVATE" }'

curl -X POST http://localhost:8080/blog/submit \
-H "uid: 2" \
-H "token: 0b2a8e2f4e4246868cf224029ff5e7c5" \
-H "Content-Type: application/json" \
-d '{ "title":"PUBLIC 2", "content": "c", "hasImage":0, "imageId":null, "permission":"PUBLIC" }'

curl -X POST http://localhost:8080/blog/submit \
-H "uid: 2" \
-H "token: 0b2a8e2f4e4246868cf224029ff5e7c5" \
-H "Content-Type: application/json" \
-d '{ "title":"FRIEND 2", "content": "c", "hasImage":0, "imageId":null, "permission":"FRIEND" }'

# user1
# Three tags combined as a single selection.
curl -X POST http://localhost:8080/blog/get_with_parameter \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b" \
-H "Content-Type: application/json" \
-d '{
"privateTag":1,
"friendTag": 0,
"publicTag":0,
"startTime": "1970-01-01 00:00:00",
"endTime": null
}'
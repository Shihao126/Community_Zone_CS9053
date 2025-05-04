
############################################################################################################
#Personal information
############################################################################################################
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


curl -X POST http://localhost:8080/user/login \
-H "Content-Type: application/json" \
-d '{"username":"YunjieWei","password":"123456"}'


curl -X POST http://localhost:8080/user/login \
-H "Content-Type: application/json" \
-d '{"username":"Tom","password":"123456"}'


curl -X POST http://localhost:8080/user/login \
-H "Content-Type: application/json" \
-d '{"username":"Yunjie","password":"12345678999"}'





curl -X POST http://localhost:8080/user/info/update \
-H "uid: 1" \
-H "token: aff7db95c76e4770923d67d6e36b5159"\
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

# get self information
curl -X POST http://localhost:8080/user/info/get \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b"

#get other's information
curl -X POST http://localhost:8080/user/info/other/1 \
-H "uid: 2" \
-H "token: d93daffb7f1a4223aaf3df7e453f6620"

# logout
curl -X POST http://localhost:8080/user/logout \
-H "uid: 1" \
-H "token: aff7db95c76e4770923d67d6e36b5159"


############################################################################################################
#Friendship
############################################################################################################
# 1 send friendship request to 2
curl -X POST http://localhost:8080/friend/request \
-H "uid: 1" \
-H "token: a8efa5c6b5734e3fb564a6cf9a87dfad"\
-H "Content-Type: application/json" \
-d '{
"uid2": "2",
"detail": "Hello, 1 to 2"
}'

# 1 send friendship request to 3
curl -X POST http://localhost:8080/friend/request \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b" \
-H "Content-Type: application/json" \
-d '{
"uid2": "3",
"detail": "Hello, 1 to 3"
}'

# 2 send friendship request to 3
curl -X POST http://localhost:8080/friend/request \
-H "uid: 2" \
-H "token: 0b2a8e2f4e4246868cf224029ff5e7c5" \
-H "Content-Type: application/json" \
-d '{
"uid2": "3",
"detail": "Hello, 2 to 3"
}'

# 3 check others' friendship request with the status of WAITING
curl -X POST http://localhost:8080/friend/application/list \
-H "uid: 3" \
-H "token: 3f69612fe6294c72ba6ae1bef4944857"

# 3 judge others' friendship request
curl -X POST http://localhost:8080/friend/judge \
-H "uid: 3" \
-H "token: f706a07affcb46f895d65a521409f13c" \
-H "Content-Type: application/json" \
-d '{
"uid": "1",
"uid2": "3",
"status": "ACCEPTED"
}'

# 1 check his application
curl -X POST http://localhost:8080/friend/request/list \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b"


# 3 judge the application of 1
curl -X POST http://localhost:8080/friend/judge \
-H "uid: 3" \
-H "token: 3f69612fe6294c72ba6ae1bef4944857" \
-H "Content-Type: application/json" \
-d '{
"uid": "1",
"uid2": "3",
"status": "ACCEPTED"
}'

# 1 check all his friends
curl -X POST http://localhost:8080/friend/friendship/list \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b"


# 1 delete friend 3
curl -X POST http://localhost:8080/friend/friendship/delete \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b" \
-H "Content-Type: application/json" \
-d '{
"uid2": "3"
}'


############################################################################################################
#Chat
#群聊：创建群聊，查看群聊简介元数据，加入群聊，查看加入的群聊（chat/group/join）
#私聊：查看好友列表（/friendship/list）
#根据sessionId，往指定群聊/私聊发送消息， 查看指定群聊/私聊的消息，
############################################################################################################
#submit new message.
curl -X POST http://localhost:8080/chat/record/submit \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b" \
-H "Content-Type: application/json" \
-d '{
"sessionType":"Friend",
"sessionId":"1_2",
"record":" chat record."
}'


#get message in the time range of start time and end time.
curl -X POST http://localhost:8080/chat/record/get \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b" \
-H "Content-Type: application/json" \
-d '{
"sessionType":"Friend",
"sessionId":"1_2",
"startTime":"2025-03-30 22:01:04",
"endTime":"2025-03-30 22:19:18 "
}'

# create a new group
curl -X POST http://localhost:8080/chat/group/create \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b" \
-H "Content-Type: application/json" \
-d '{
"name":"Group 1",
"description":"for test"
}'

# join a group
curl -X POST http://localhost:8080/chat/group/join \
-H "uid: 2" \
-H "token: 0b2a8e2f4e4246868cf224029ff5e7c5" \
-H "Content-Type: application/json" \
-d '{
"groupId":1
}'

# gain group info by id
curl -X POST http://localhost:8080/chat/group/detail/1 \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b"

# gain list of groups has entered
curl -X POST http://localhost:8080/chat/group/list \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b"

############################################################################################################
#Blob
############################################################################################################
# upload image
# 实际使用按照前端适合的上传方式， 返回的detail是图片的id
curl -X POST http://localhost:8080/image/upload \
-H "Content-Type: multipart/form-data" \
-F "file=@./src/main/resources/image/img.png"

# download image
# 实际使用需要按照前端适合的接受方式
curl -o src/main/resources/image/output.png http://localhost:8080/image/download/1

#submit blog
#返回值的detail 是 blog的id
curl -X POST http://localhost:8080/blog/submit \
-H "uid: 1" \
-H "token: 4536d9ce7da04adba76d6cbb6c3bfe48" \
-H "Content-Type: application/json" \
-d '{
"title":"blog with image",
"content": "content1",
"hasImage":1,
"imageId":2,
"permission":"PRIVATE"
}'

# submit a new blog
curl -X POST http://localhost:8080/blog/submit \
-H "uid: 1" \
-H "token: 4536d9ce7da04adba76d6cbb6c3bfe48" \
-H "Content-Type: application/json" \
-d '{
"title":"blog with image",
"content": "content1",
"hasImage":0,
"imageId":null,
"permission":"PRIVATE"
}'

# get one blog
curl -X POST http://localhost:8080/blog/get/1 \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b"

# update details in the blog
# 字段可以缺少，id 必须在
curl -X POST http://localhost:8080/blog/edit \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b" \
-H "Content-Type: application/json" \
-d '{
"id":2,
"title":"new title",
"content": "content1",
"permission":"PUBLIC"
}'

#delete blog by id
curl -X POST http://localhost:8080/blog/delete/1 \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b"

curl -X POST http://localhost:8080/blog/delete/2 \
-H "uid: 2" \
-H "token: 0b2a8e2f4e4246868cf224029ff5e7c5"


# gain blog by parameter
curl -X POST http://localhost:8080/blog/get_with_parameter \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b" \
-H "Content-Type: application/json" \
-d '{
"privateTag":1,
"friendTag":1,
"publicTag":1,
"startTime":"2025-04-01",
"endTime":"2025-04-03"

}'

# submit comment with blog_id
curl -X POST http://localhost:8080/blog/comment/submit \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b" \
-H "Content-Type: application/json" \
-d '{
"blogId":1,
"content": "content2"
}'

# gain all comments by bolg_id
curl -X POST http://localhost:8080/blog/comment/get/1 \
-H "uid: 1" \
-H "token: 5f91c084c2644daba18410e853c8b14b"



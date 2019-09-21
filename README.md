# OAuth2Server
 implement OAuth 2 using NodeJS and Redis. I will be using Password Grant for OAuth2.

#Making Authorization requests

Token request:

POST oauth/token. Allows a registered application to obtain an OAuth 2 Bearer Token, which can be used to make API requests on an application’s own behalf, without a user context. This is called Application-only authentication.

**Headers**

    Authorization: "Basic " +  clientId:clientSecret base64'd
    
(for example, to use application:secret, you should send 
Basic YXBwbGljYXRpb246c2VjcmV0)

**Body**   
contains 3 parameters: grant_type, username and password)

    grant_type: password
    username: "somename"
    password: "xyz"


#Request using Bearer token :

**Headers**

    Authorization: "Bearer " +  accesstoken
    
(for example, Bearer d3e07f7c14f8f73268eea97e96398f96af8c89da)


#Steps:
1. run `npm install`
2. run create_data file to create users and clients in redis

   ` $ node create_date.js`
3. Launch app

   `node app.js`

4. open the post man to make a request

   `localhost:5000/oauth/token`

5 After making the above request you will get the access token.


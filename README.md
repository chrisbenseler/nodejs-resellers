# Resellers Cashback

### Dependencies
- NodeJS > 10
- MongoDB > 4

## Installation
<pre>
npm install
</pre>

Copy .env.sample to .env and change values.
By default, the application will connect to a local MongoDB instance (DBHOST) and launch a webserver on port 3000 (PORT)

## Running
<pre>
npm run start
</pre>

## Usage

### Authentication
First, create a reseller and then sign in using its credentials (email and password)

### Check if reseller is authenticated
The sign in endpoint returns a token. This should be used as a bearer token.
Hit the /auth/profile and a status 200 response with the user data will be returned

### Sale
Use the new sale endpoint providing both code and value from the sale. There is no need to provide the user's CPF because this endpoints requires authentication.
A reseller can create a sale entry only for himself. The response won't have the cashback calculated because the process of calculation has been implemented to run asynchronously.
To list its sales, hit the list resellers endpoint. This will list the reseller's sales with cashback information.

### Cashback credit
To check the reseller's cashback credit, hit the ednpoint /resellers/{cpf}/cashback
CPF format can be either with or without special characters.

## Test
<pre>
npm run test
</pre>

You can also import the `postman_collection.json` to your API test tool. 


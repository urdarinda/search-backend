# search-backend


## Installation
Prerequisites: Node.js (>=16.0.0)

You can install and configure the api using this command:
```bash
npm ci
```

## How to run
To run the api just do the following command
```bash
npm start
```
The above command will bootstrap the data automatically and start a fastify server.
Now you can hit the following endpoints and search for any post you like!

Few examples
```bash
curl --request GET \
  --url 'http://localhost:3000/searchPost?query=%22the%20king%22' 

curl --request GET \
  --url 'http://localhost:3000/searchPost?query=%22the%20king%22&page=1' 

curl --request GET \
  --url 'http://localhost:3000/searchPost?query=the%20king' 

curl --request GET \
  --url 'http://localhost:3000/searchPost?query=the%20king&sortKey=dateLastEdited'

curl --request GET \
  --url 'http://localhost:3000/searchPost?query=the%20king&sortKey=random'

curl --request GET \
  --url 'http://localhost:3000/searchPost?query=the%20king&pageSize=115'
```


## Tests
Just run the following
```bash
npm test
```

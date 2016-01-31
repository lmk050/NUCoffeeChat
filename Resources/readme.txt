wild: frontend resource server	
	(handles requests from browsers and returns web pages)
	- GET: response: web pages
	- POST: request: application/json
			response: web pages

cat: backend resource server
	(handles requests from frontend resource server and returns json data)
	- GET: response: application/json
	- POST: request: application/json
			response: application/json
	- PUT: request: application/json
		   response: application/json
	- DELETE: request: application/json
			  response: application/json

elf: backend server
	 (not accessible from outside)
	 (handles more serious business logic: e.g. DB)
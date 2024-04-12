# Taskar

To setup this project into your PC, head over and clone this repository using gh CLI or otherwise. 

## Setup Environment Variables

```
MONGODB_URI=""  //add your mongoDB connection URL
PORT=8000 
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=""
REFERESH_TOKEN_SECRET=""
ACCESS_TOKEN_EXPIRY=""


CLOUD_NAME ='' 
CLOUD_API_KEY = ''
CLOUD_API_SECRET= ''

DEFAULT_AVATAR=""
DEFAULT_COVER_IMAGE=""    
```

Head over to cloudinary api and fetch your key and secrets.

Then, to install the node modules and libraries and run the server at the PORT 8000, by default
```bash
npm i && npm run dev
```

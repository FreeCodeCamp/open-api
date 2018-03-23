![FreeCodeCamp](https://camo.githubusercontent.com/60c67cf9ac2db30d478d21755289c423e1f985c6/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f66726565636f646563616d702f776964652d736f6369616c2d62616e6e65722e706e67)
Join FreeCodeCamp to learn to code and help nonprofits.

# open-api Project

**This project is currently being refactored, performance and API will be unstable.**

## About

Free Code Camp's open API initiative is an implementation of the FreeCodeCamp's open-data policy. The open API exposes user performance and some more details on Free Code Camp users. Third parties are encouraged to develop tools to present FCC user data in a creative way. 


## Getting Started

Start a self contained service, this will spin up a MongoDB server
````
docker-compose -f docker-compose.yml -f docker-compose-isolated.yml up
````

Start service, attaching to a shared network created by 
running the main website in sharing mode. This assumes you:
* Have a checkout of https://github.com/freeCodeCamp/freeCodeCamp
* Are running the site with `docker-compose -f docker-compose.yml -f docker-compose-shared.yml up`

```
 docker-compose -f docker-compose.yml -f docker-compose-shared.yml up
```


### Getting an API key
TBD
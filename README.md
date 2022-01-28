# route_optimization_web_service_basics

![Route Optimization Web Service Basics](https://blog.afi.io/content/images/size/w1600/2021/11/Screen-Shot-2021-11-06-at-9.29.59-PM.png "Route Optimization Web Service Basics")

Taken from: 
- [Build your own Route Optimization API with Google Maps (Part 1 of 6)](https://blog.afi.io/build-your-own-route-optimization-api-with-google-maps/)
- [Creating a Route with the Google Maps Directions API (Part 2 of 6)](https://blog.afi.io/creating-a-route-with-the-google-maps-directions-api/)
- [Optimizing a Route with the Google Maps Directions API (Part 3 of 6)](https://blog.afi.io/optimizing-a-route-with-the-google-maps-directions-api/)
- [Route Optimization Web Service Basics (Part 4 of 6)](https://blog.afi.io/route-optimization-web-service-basics/)
- [Let's Build a Route Optimization Web Service (Part 5 of 6)](https://blog.afi.io/lets-build-a-route-optimization-web-service/)
- [Testing our Route Optimization Web Service in Production (Part 6 of 6)](www.google.com)

 How to run the app:
 1. cd into your project.
 2. Install packages by running `yarn` and enter `yarn start` to run the app in development mode.
 3. Create a `.env` file in the root folder and add the following lines of code (be sure to replace the placeholder text with your actual API keys).

```
DATABASE_URI='MONGODB_DATABASE_URI'
GOOGLE_KEY='GOOGLE_API_KEY'
```

The `DATABASE_URI` is the [MongoDB connection string](https://docs.mongodb.com/manual/reference/connection-string/) used to connect to a MongoDB deployment. This project uses [MongoDB Atlas](https://atlas.mongodb.com). Atlas provides an easy way for us to host and manage our data in the cloud. To obtain the URI, follow these steps:

1. [Sign up for a MongoDB Atlas account](https://docs.atlas.mongodb.com/tutorial/create-atlas-account/)
2. Create an [admin user](https://docs.mongodb.com/manual/tutorial/manage-users-and-roles/) by selecting Database Access > Add New Database User and choosing `Atlas Admin .
3. Create a database cluster ([this guide](https://docs.atlas.mongodb.com/tutorial/deploy-free-tier-cluster/) shows you  how to create one for free).
4. Under Databases > Database Deployments click Connect > Connect your Application and copy the URI string provided.

When the app is run, it will automatically connect to Atlas and create a new database with the appropriate collections (database tables) as defined in the ob ject models.

`GOOGLE_KEY` is the API key found on the Google Maps Platform > Credentials [page](https://console.cloud.google.com/projectselector2/google/maps-apis/credentials) when you log into your Google Cloud Platform console.

Please contact afian@afi.io if you have any questions or suggestions. Pull requests are welcome.

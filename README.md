Start mongo db in local

1. sudo /Users/<homepaht name>/mongodb-osx-x86_64-3.2.8/bin/mongod 


MongoDB 2.4 database added.  Please make note of these credentials:

   Root User:     admin
   Root Password: 7Kp781i6TQzr
   Database Name: alphatrackn

Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/


Server API Integration
Integrate our API

Our Server API is provided as an alternative if you didn't find a client SDK that matched your needs or if you need custom server integration:

For calling our APIs from your server, you can use our Server REST API.
If you couldn't find a client SDK that met your requirements, you can contact us about that or wrap your own using one of our native SDKs.
Your App ID: 91a74dcc-e034-427d-8def-b9b009ea7a89
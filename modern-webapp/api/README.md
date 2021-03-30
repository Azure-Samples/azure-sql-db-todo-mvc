# API Service
Assuming you have this code cloned down to your local machine. We are going to build locally, then tell ARO to wrap that into a container and deploy it:

1. mvn package
2. oc new-build --binary --name=modern-webapp-api -l app=modern-webapp-api
3. oc patch bc/modern-webapp-api -p "{\"spec\":{\"strategy\":{\"dockerStrategy\":{\"dockerfilePath\":\"src/main/docker/Dockerfile.jvm\"}}}}"
4. oc start-build modern-webapp-api --from-dir=. --follow
5. oc new-app --name=modern-webapp-api --image-stream=modern-webapp-api:latest -e CHECKSUM_SECRET=somethingsecret -e QUICKAUTH_USER=changeme -e QUICKAUTH_PASSWORD=changeme
6. oc expose service modern-webapp-api
7. export HS_URL="http://$(oc get route | grep modern-webapp-api | awk '{print $2}')"
8. curl $HS_URL && echo

Now we can tell the running app where the CosmosDB is :
1. oc set env deployment/modern-webapp-api QUARKUS_MONGODB_CONNECTION_STRING="YOUR_CONNECTION_STRING"

Note: your connection string was printed when you ran the `setupCosmos.sh` script and looks something like:

 `oc set env deployment/modern-webapp-api QUARKUS_MONGODB_CONNECTION_STRING=mongodb://cosmos-arowebappsexample:2SNJeAQdSNHguDecg3l8J42KS16oTHjTzX0SPEQr9gcbrlUwn5cVWRFnNgM0Jgp9yiv5PERYY6IdHPSCdXFX0Q==@cosmos-arowebappsexample.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@cosmos-arowebappsexample@`

---

You can read the [original README here](https://github.com/CodeCafeOpenShiftGame/openshift-highscores-api-service).


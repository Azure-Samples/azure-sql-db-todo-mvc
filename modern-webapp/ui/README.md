# UI
Run the following two commands:

```
oc new-app nodeshift/ubi8-s2i-web-app:latest~https://github.com/dudash/openshiftexamples-aro-webapp-azuresql \
--context-dir=modern-webapp/ui \
--build-env OUTPUT_DIR=dist \
--build-env DEBUG_INPUT=false \
--build-env API_SERVER_URL=http://highscores-api-service-aro-demo.apps.xsdef4sd4.region.aroapp.io:80 \
--build-env API_SERVER_WEBSOCKET_URL=ws://highscores-api-service-aro-demo.apps.xsdef4sd4.region.aroapp.io:80 \
--name=modern-webapp-ui
```

```
oc expose service openshift-highscores-phaser-ui
````

Note 1: `API_SERVER_URL` and `API_SERVER_WEBSOCKET_URL` can use `https` and `wss` as long as they a both set to be secure (use port 443)

Note 2: The build process packs the URLs into the app so you can't change them at deploy time - rebuild/redeploy is required

Note 3: We are serving this from an ARO container, but you could also take the webpack and run it in Azure Blob

---

You can read the [original README here](https://github.com/CodeCafeOpenShiftGame/openshift-highscores-phaser-ui).
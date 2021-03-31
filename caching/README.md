# Caching Service
Depending on your requirements, it’s often recommended that the webapps utilize a containerized and replicated caching service for the relational database data. This caching service can remove pressure from the SQL database and improve performance, scalability, and availability. The more data that you have and the larger the number of users that need to access this data, the greater the benefits of caching.


## How to deploy

First, install the operator that will manage our caching service
1. Login to ARO as Administrator
2. Navigate to OperatorHub and search for "Data Grid Operator"
3. Select Install and continue to Create Operator Subscription
4. Refine how you want it to run (defaults and All namespaces is fine)
5. Select Subscribe to install Data Grid Operator

Next, tell the operator to create a new cache service instance 
This is the YAML for a basic cache service. You can create it via CLI or webconsole.
```
apiVersion: infinispan.org/v1
kind: Infinispan
metadata:
  name: example-infinispan
spec:
  replicas: 2
  service:
    type: Cache 
```

1. Make sure you are in the right project
2. Click the + and paste it in or `oc apply -f ` it.
3. Check the pods in the webconsole or `oc get pods -w` to see when it's up and running


## Hooking the apps up to use caching
Find details on how to do this in the following guides.

## More guidance
* https://access.redhat.com/documentation/en-us/red_hat_data_grid/8.1/html/running_data_grid_on_openshift/index
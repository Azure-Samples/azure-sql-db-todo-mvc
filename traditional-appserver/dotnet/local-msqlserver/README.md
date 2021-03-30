# You can use this JSON to deploy a containerized SQL Server into ARO
1. `oc create -f ./mssql2019.json`
2. `oc process --parameters mssql2019`
3. `oc new-app --template=mssql2019 -p ACCEPT_EULA=Y`

In addition to deploying SQL Server in a container, the template creates a secret (mssql-secret), which stores the administrator password. It also creates a persistent volume claim (mssql-pvc) for storage. Note that the secret includes the SQL Server service name, which facilitates binding to SQL Server later.

You can use the oc status command or the OpenShift web console to monitor the deployment’s progress.

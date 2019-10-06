## welcome.

Welcome to my demo for the take home challenge! It uses `docker` & `docker-compose` to make your life for setting it up extremely easy. These are the only dependencies you need for this projject. Head over to (mac)[https://docs.docker.com/docker-for-mac/install/](windows)[https://docs.docker.com/docker-for-windows/install/] and grab a copy of docker if you don't have these utilities already. Depending on your OS you may have to install compose seperately, if that's the case head here ()[https://docs.docker.com/compose/install/].

## :wrench: Setup

Clone the project

```
git clone https://github.com/BennettDixon/tellus_takehome;
cd tellus-takehome;
```

Run the container network, this will build them the first time so be patient while images are downloaded and containers are built

```
docker-compose up -d
```

This will spin containers up, but you will see an error printed to the screen telling you `ROLE postgres_user DOES NOT EXIST`. Do not fret, follow these steps, this is intended. We need to setup the table and database for the backend to populate with testdata.

Locate the postgres container id using

```
docker ps
```

You can either use the name of the container or the id of the container to substitute in the next portion. The name should be something like `tellus_takehome_postgres_1` and is under the `NAMES` column, the id is under `CONTAINER ID` and is a random alpha-numeric hash.

Execute the following, substituting your postgres container id. This will setup a user and database in your postgres container. You only need to do this once unless you delete the docker-compose volume mount or the postgres data on your local machine.

```
docker exec -it <container-id/name> psql -U postgres -f /app/pgsetup.sql
```

Once the role is created the backend will load the test data into postgres after performing the migrations. That's all you need to do!

Visit the GraphQL endpoint `localhost:8800/graphql` and play with GraphQL Queries!

Feel free to add objects to the `/nginx_router/backend/books.json` file for further testing! They will be loaded in each time you boot the containers.

### Shutting it down

```
docker-compose down
```

# Create T3 App

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.

## Getting Started

Follow the instructions to run the application on your machine.

__Step 1:__ Clone this repository `git clone https://github.com/rschw/t3-app-playground` and rename `.env-example` to `.env`.

__Step 2:__ Configure the `datasource` in `schema.prisma` to either use `sqlite` or `postgres`. When `postgres` is used make sure to spin up a docker container and configure `DATABASE_URL` in `.env`.

```prisma
// --> schema.prisma

// sqlite
datasource db {
    provider = "sqlite"
    url      = "file:./db.sqlite"
}

// postgres
datasource db {
    provider = "postgres"
    url      = env("DATABASE_URL")
}
```

__Step 3:__ Run `npm install` which has a `postinstall` hook that will run `npx prisma generate` for you to create the prisma db schema.

__Step 4:__ Run `npx prisma db push` to push the db schema to whatever db provider you chose.

__Step 5:__ Run `npx @soketi/soketi start` to spin up a local websocket server. `.env-example` is preconfigured to use `soketi` defaults.

__Step 6:__ Run `npm run dev` to start the Next.js dev server.

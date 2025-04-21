# How to start the project

## Prerequisite

Check the version of the node install to be 14 or above, use the command `node --version`

Install packages by running `npm install`

Create `.env` file in the root folder using the `.env.example`

Run the migration `npm run migrate:up` Run the seeders `npm run seed:all`

Start the project locally with `npm run dev`

## How to run on production

- Install packages by running `npm install` Make sure that you have set the `NODE_ENV` to production in the env variable
- Run the DB scripts with `npm run prepareDB`
- Build the project with `npm run build` (this will create a dist folder with the typescript code transpiled to
  javascript)
- Start the node serve with `npm run prod`

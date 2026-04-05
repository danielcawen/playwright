# playwright
playwright + ts for: real world app
this is using the cypress real world app as the base for the app to test

## how to run the "real world app" locally

1. verify the complete documentation at: https://github.com/cypress-io/cypress-realworld-app
2. install yarn: `npm install yarn@latest -g`
3. `git clone https://github.com/cypress-io/cypress-realworld-app`
4. `cd cypress-realworld-app`
5. `yarn`
6. `yarn dev`

### note
- seems that the last working node is the 22.22.2 for the cypress real world app

## how to run the tests locally

1. Copy the example env file: `cp .env.example .env.local`
2. Fill in the credentials in `.env.local`
3. Install dependencies: `yarn install`
4. Run the tests: `yarn playwright test --ui`

### note
- this is an example on how to handle the secrets; for this example the username/password are in the cypress real world app

## how to run test on other .env
- `NODE_ENV=staging yarn playwright test --ui`
- `NODE_ENV=prod yarn playwright test --ui`
- local is the default one

# playwright
playwright + ts for: real world app
this is using the cypress real world app as the base for the app to test

## how to run locally

1. verify: https://github.com/cypress-io/cypress-realworld-app
2. install yarn: npm install yarn@latest -g
3. git clone https://github.com/cypress-io/cypress-realworld-app
4. cd cypress-realworld-app
5. yarn
6. yarn dev

## how to run the tests locally

1. Copy the example env file: `cp .env.example .env`
2. Fill in the credentials in `.env`
3. Install dependencies: `npm install`
4. Run the tests: `npx playwright test --ui`


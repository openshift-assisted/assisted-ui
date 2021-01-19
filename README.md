![](https://github.com/openshift-assisted/assisted-ui/workflows/Build%20and%20push/badge.svg)

# The Assisted Installer User Insterface

The Assisted Installer makes IPI (Installer-Provisioned Infrastructure) OpenShift cluster deployments on bare metal easy.

Hosts building the cluster are discovered by booting an ISO image downloaded from the Assisted Installer.

By entering a few neccessary configuration details (like cluster name, base domain, SSH public keys or netowrk specifics), the Assisted Installer handles all the deployement and configuration automatically, resulting in a ready-to-use cluster.

This project is a user interface backed by Assisted Installer API.

## Getting started

### Prerequisite

- Install [Node.js](https://nodejs.org/en) and [yarn](https://yarnpkg.com/), on Fedora/Centos:
  ```
  dnf install -y nodejs yarn
  ```
- Clone repo:
  ```
  git clone https://github.com/openshift-assisted/assisted-ui.git
  cd assisted-ui
  ```

### Build and run in DEV-mode

- Install javascript dependencies:
  ```
  yarn install
  ```
- Start the webpack dev server to run the application in dev-mode with:

  - Environment variables:

  ```
  REACT_APP_API_URL: required, URL of the BM Inventory
  BROWSER: optional, locally installed browser used to open the web application in
  ```

  - Command:

  ```
  REACT_APP_API_URL=[YOUR_ASSISTED-SERVICE_URL] yarn start
  ```

  - Example:

  ```
  REACT_APP_API_URL=`minikube service assisted-service --url` BROWSER=chromium-browser yarn start
  ```

- Open the UI at `http://localhost:3000`

## Running integration tests

Integration tests are based on [Cypress](https://www.cypress.io/).

### Assumptions
- The upstream tests assume environment provided by [Assisted Test-Infra](https://github.com/openshift/assisted-test-infra), namely result of the `make run_full_flow` which provides API and `test-infra-cluster-assisted-installer` cluster with it's hosts.

- **Please make sure the application** is running prior starting E2E tests (see [Getting started](#2-getting-started)).

- Please review `hacks/cypress_env_local.sh` and tweak variables based on your environment. Their recent version conforms development setup.

### Running tests with a graphical console
To open console for integration tests (Cypress Test Runner), run

```
$ source hacks/cypress_env_local.sh ; yarn cypress-open
```
This mode is probably the best option to develop the tests.

### Head-less tests
The same set of tests can be executed in a head-less mode:

```
$ source hacks/cypress_env_local.sh ; yarn cypress-run
```

### Zero-installation execution via pre-built container
To run E2E tests via pre-built container:

```
$ source hacks/cypress_env_local.sh ; hacks/run-tests.sh
```
This mode is good for automated testing after [test-infra](https://github.com/openshift/assisted-test-infra) redeployment.

It pulls image referenced by the `TESTS_IMAGE` env variable or `quay.io/ocpmetal/ocp-metal-ui-tests:latest` by default. These images are recently built for every commit merged to the assisted-ui master branch.

## Running the production server

TBD

## Production build

You can compile the production executable by running:

```
$ yarn build
```

Optionally, set `REACT_APP_BUILD_MODE=single-cluster` environment variable to disable multi-cluster features.
Example:

```
$ REACT_APP_BUILD_MODE=single-cluster yarn build
```

## Available Scripts

In the project directory, you can run:

### `yarn install`

Installs dependencies to node_modules directory

### `yarn prettier`

This application uses Prettier to check and format code. You can run the above command to clean your
code, or you can [integrate it with your editor](https://prettier.io/docs/en/editors.html), and set
up a Prettier extenson and formatting changes will automatically be applied when you save.

### `yarn start`

Runs the app in the development mode.<br> Open [http://localhost:3000](http://localhost:3000) to
view it in the browser.

The page will reload if you make edits.<br> You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br> See the section about
[running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `yarn test-suite`

Runs the GUI tests, based on Protrator (Selenium). Make sure you run `yarn webdriver-update` at
least once before using protractor, in order to download the needed Selenium web drivers.

You can also run a specific suite with: yarn test-suite --suite <suite-name>

### `yarn webdriver-update`

Downloads the Selenium web drivers for Firefox and Chrome. Run it at least once before trying to run
the test-suite which uses Protractor. You also need to re-run this after every `yarn install` or
update to the node modules.

### `yarn run build`

Builds the app for production to the `build` folder.<br> It correctly bundles React in production
mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br> Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

### `yarn run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time.
This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel,
ESLint, etc) right into your project so you have full control over them. All of the commands except
`eject` will still work, but they will point to the copied scripts so you can tweak them. At this
point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle
deployments, and you shouldn’t feel obligated to use this feature. However we understand that this
tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the
[Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

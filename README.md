![](https://github.com/openshift-metal3/facet/workflows/Build%20and%20push/badge.svg)

# Facet

OpenShift Metal³ installer UI.

Facet is the central integration point for doing a Metal³ deployment of OpenShift. It’s the one
command you run on a provisioning host to kick off the deployment. It performs the following
functions:

- Implements the day 1 provisioning API. In other words, this API provides what is necessary to get
  the masters providing the control plane up and running. From that point, the Machine API and the
  corresponding Metal³ components will take over provisioning the rest of the cluster.

- Will do provisioning host configuration validation at startup.

- Will launch the Ironic containers using podman on the provisioning host.

- Will download the current images of RHCOS that are needed for deployment. (for the bootstrap VM
  and bare metal hosts)

- Will run the installer, launch the bootstrap VM, and drive Ironic APIs.

Here's a diagram of the Facet architecture: ![Facet Architecture](/images/Facet_Architecture.png)

For further details about the Metal³ architecture, see [http://github.com/metal3-io/metal3-docs].

## Getting started

### Prerequisite

- Install [Node.js](https://nodejs.org/en) and [yarn](https://yarnpkg.com/), on Fedora/Centos:
  ```
  dnf install -y nodejs yarn
  ```
- Clone repo:
  ```
  git clone https://github.com/openshift-metal3/facet.git
  cd facet
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

**Please make sure the application** is running prior starting E2E tests (see
[Getting started](#2-getting-started))

To open console for integration tests (Cypress Test Runner), run

```
$ CYPRESS_BASE_URL=http://localhost:3000 yarn cypress-open
```

To run E2E tests in headless mode:

```
$ CYPRESS_BASE_URL=http://localhost:3000 yarn cypress-run
```

To run E2E tests via pre-built container:

```
$ CYPRESS_BASE_URL=http://localhost:3000 hacks/run-tests.sh
```

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

### `hacks/npm-publish.sh`

Increases `patch` version (`.z`) of the package, opens PR with this change and **publishes** the
package to the [npmjs.com](https://www.npmjs.com/package/metal3-facet) repository.

New tag conforming the version is created.

Prior running this script, please be sure you

- are logged in npmjs.com (call `yarn login`)

- can create branches and open PRs in
  [https://github.com/openshift-metal3/facet](https://github.com/openshift-metal3/facet)

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

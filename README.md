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

- Install [Node.js](https://nodejs.org/en) and NPM 
  ```
  dnf install -y nodejs
  ```
- Clone repo:
  ```
  git clone https://github.com/openshift-metal3/facet.git
  cd facet
  ```

### Build and run in DEV-mode

- Install javascript dependencies:
  ```
  npm install
  ```
- Start the webpack dev server to run the application in dev-mode with:

  - Environment variables:

  ```
  REACT_APP_API_URL: required, URL of the BM Inventory
  BROWSER: optional, locally installed browser used to open the web application in
  ```

  - Command:

  ```
  REACT_APP_API_URL=[YOUR_ASSISTED-SERVICE_URL] npm start
  ```

  - Example:

  ```
  REACT_APP_API_URL=`minikube service assisted-service --url` BROWSER=chromium-browser npm start
  ```

- Open the UI at `http://localhost:3000`

## Running integration tests

Integration tests are based on [Cypress](https://www.cypress.io/).

**Please make sure the application** is running prior starting E2E tests (see
[Getting started](#2-getting-started))

To open console for integration tests (Cypress Test Runner), run

```
$ CYPRESS_BASE_URL=http://localhost:3000 npm cypress-open
```

To run E2E tests in headless mode:

```
$ CYPRESS_BASE_URL=http://localhost:3000 npm cypress-run
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
$ npm build
```

## Learn More

You can learn more in the
[Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

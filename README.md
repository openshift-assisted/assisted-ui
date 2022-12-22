![](https://github.com/openshift-assisted/assisted-ui/workflows/Build%20and%20push/badge.svg)

# The Assisted Installer User Interface

The Assisted Installer makes IPI (Installer-Provisioned Infrastructure) OpenShift cluster
deployments on bare metal easy.

Hosts building the cluster are discovered by booting an ISO image downloaded from the Assisted
Installer.

By entering a few necessary configuration details (like cluster name, base domain, SSH public keys
or network specifics), the Assisted Installer handles all the deployment and configuration
automatically, resulting in a ready-to-use cluster.

This project is a user interface backed by Assisted Installer API.

## Getting started

### Prerequisite

- Install [Node.js](https://nodejs.org/en/download/package-manager/#centos-fedora-and-red-hat-enterprise-linux) and [pnpm](https://pnpm.io/installation), on Fedora/Centos/RHEL:
- Clone repo:
  ```bash
  git clone https://github.com/openshift-assisted/assisted-ui.git
  cd assisted-ui
  ```

### Build and run in DEV-mode

- Install javascript dependencies:
  ```bash
  pnpm install
  ```
- Start the webpack dev server to run the application in dev-mode with:  
  ```bash
  REACT_APP_API_URL=[YOUR-ASSISTED-SERVICE-URL] pnpm start
  ```
  - Environment variables:

    - `REACT_APP_API_URL` **required**, this tell the app where the API can be found (see [Assisted Service](https://github.com/openshift/assisted-service))
    - `REACT_APP_BUILD_MODE='single-cluster'` to make it run in Single Cluster mode (currently not working and will be deprecated)
    - `REACT_APP_CLUSTER_PERMISSIONS` a JSON to pass in permission restrictions.
      - The JSON currently admits the `canEdit` parameter.  
        Example:
          ```bash
          REACT_APP_CLUSTER_PERMISSIONS='{"canEdit": false}'
          ```
    - `BROWSER` override the browser used to automatically open the web application
  - Example:  
    ```bash
    REACT_APP_API_URL=`minikube service assisted-service --url` BROWSER=chromium-browser pnpm start
    ```

- The UI will be available at [http://localhost:3000](http://localhost:3000)

## Production build
You can compile the production executable by running:
```
pnpm build
```

Optionally, set the configuration environment variables which you want to use
Example:
```bash
REACT_APP_BUILD_MODE='single-cluster' pnpm build
```

## Container image build

You can build the container image by running:
```bash
$ podman build \
    --build-arg REACT_APP_GIT_SHA="$(git rev-parse HEAD)" \
    --build-arg REACT_APP_VERSION=latest \
    -t quay.io/edge-infrastructure/assisted-installer-ui:latest .
```

## Available Scripts
In the project directory, you can run:

### `pnpm run install`
Installs dependencies to node_modules directory

### `pnpm run format`
This application uses Prettier to check and format code. You can run the above command to clean your
code, or you can [integrate it with your editor](https://prettier.io/docs/en/editors.html), and set
up a Prettier extension and formatting changes will automatically be applied when you save.

### `pnpm run start`
Runs the app in the development mode.<br> Open [http://localhost:3000](http://localhost:3000) to
view it in the browser.

The page will reload if you make edits.<br> You will also see any lint errors in the console.

### `pnpm run test`
Launches the test runner in the interactive watch mode.<br> See the section about
[running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `pnpm run build`
- Builds the app for production to the `build` folder.<br> It correctly bundles React in production
mode and optimizes the build for the best performance.  
- The build is minified and the filenames include the hashes.<br> Your app is ready to be deployed!
- See the [deployment](https://facebook.github.io/create-react-app/docs/deployment) section for
more information.

## Learn More
This project is used as an upstream development tool (see [LICENCE](LICENSE)).   
It uses [React](https://reactjs.org/tutorial)+[TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) and was scaffolded using [Create React App](https://facebook.github.io/create-react-app/docs/getting-started). Check out those links to learn more.

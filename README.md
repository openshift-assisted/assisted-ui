# Facet

User interface for MetalKube

## Getting started

* Install [yarn][1] and [golang][2]
* Set up your `$GOPATH` (this means selecting a directory on your computer where
  all your golang code will go, and setting the `GOPATH` environment variable to
  that path)
* Clone this repository to your `$GOPATH` directory, i.e.
  `$GOPATH/src/github.com/metalkube/facet` (create the `src` and `github.com`
  directories if they don't already exist)
* `cd` into it
* Install javascript dependencies with `yarn install`
* Start the backend server with `go run main.go server`
* Start the yarn server with `yarn start`
* Open the UI at `http://localhost:3000`

[1]: https://yarnpkg.com/en/
[2]: https://golang.org/

## Running the production server

```
$ go run main.go server
```

## Running the development server

During development, you can take advantage of using the Golang server. It
provides a REST API layer (e.g. `/api/hosts`)

To use it, start the `yarn start` server in one tab, and then start the Golang
server with `go run main.go server` in another tab.

The development server will recognize non static asset requests (e.g. `fetch('/api/hosts')`),
and will proxy it to API server (`http://localhost:8080/api/hosts`) as a fallback.

## Available Scripts

In the project directory, you can run:

### `yarn install`

Installs dependencies to node_modules directory

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

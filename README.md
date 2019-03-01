# Facet

Facet is the central integration point for doing a MetalKube deployment of
OpenShift. It’s the one command you run on a provisioning host to kick off the
deployment. It performs the following functions:

- Implements the day 1 provisioning API. In other words, this API provides what
  is necessary to get the masters providing the control plane up and running.
  From that point, the Machine API and the corresponding MetalKube components
  will take over provisioning the rest of the cluster.

- Uses an embedded HTTP server to serve the day 1 UI, which will be the primary
  client of this API.

- Will do provisioning host configuration validation at startup.

- Will launch the Ironic containers using podman on the provisioning host.

- Will download the current images of RHCOS that are needed for deployment. (for
  the bootstrap VM and bare metal hosts)

- Will run the installer, launch the bootstrap VM, and drive Ironic APIs.

For further details about the MetalKube architecture, see
[http://github.com/metalkube/metalkube-docs].

## Getting started

- Install [yarn][1] and [golang][2]
- Set up your `$GOPATH` (this means selecting a directory on your computer where
  all your golang code will go, and setting the `GOPATH` environment variable to
  that path)
- Clone this repository to your `$GOPATH` directory, i.e.
  `$GOPATH/src/github.com/metalkube/facet` (create the `src` and `github.com`
  directories if they don't already exist)
- `cd` into it
- Install javascript dependencies with `yarn install`
- Start the backend server with `go run main.go server`
- Start the yarn server with `yarn start`
- Open the UI at `http://localhost:3000`

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

The development server will recognize non static asset requests (e.g.
`fetch('/api/hosts')`), and will proxy it to API server
(`http://localhost:8080/api/hosts`) as a fallback.

## Production build

You can compile the production executable by running:

```
$ ./build.sh
```

This uses the [statik][3] utility to bundle all of the static assets from
`./build/` into a golang source file. It then compiles the project into a single
binary, and places it into `bin/`.

You can use the binary directly:

```
./bin/facet -h
Facet

Metalkube Facet is an interface to kubernetes baremetal provisioning.

Usage:
  facet [command]

Available Commands:
  help        Help about any command
  host        Interact with baremetal hosts
  server      Run the facet server

Flags:
  -h, --help   help for facet

Use "facet [command] --help" for more information about a command.
```

[3]: https://github.com/rakyll/statik

## Long-running tasks

If you would like to trigger a long-running task from the frontend, we've got
you covered. The REST API endpoint that you will create will trigger the
long-running task, and quickly return with a success message. The long-running
task itself will be sent for background processing in a go routine. The task
will receive a notification channel where it can send any messages indicating
its progress or resulting value. The frontend will receive these notifications
nearly instantly through a websocket connection.

The REST API endpoint handler will look something like this:

```go
func LongRunningTaskHandler(notificationChannel chan Notification) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        response := "OK"
        go performLongTask(notificationChannel)
        respondWithJson(w, response)
    }
}
```

It's a function which takes a notification channel, and returns a regular HTTP
handler. Inside, the `performLongTask` function is actually what performs the
long-running task. It also has access to the notification channel.

The expensive task then looks something like this:

```go
func performLongTask(notificationChannel chan Notification) {
    n := NewNotification("Started a long running task", RUNNING)
    notificationChannel <- n

    // Do important work for 10 seconds
    time.Sleep(10 * time.Second)

    n2 := NewNotification("Finished a long running task", SUCCESS)
    notificationChannel <- n2
}
```

## REST API & CLI commands

The facet repo is the home for both of these parts: both the command line
client, and the REST API. Both of these interfaces will consume a common
integration API (API in the general sense, not an HTTP layer), also in facet.

The REST API code is in github.com/metalkube/facet/pkg/server, the integration
API is in github.com/metalkube/facet/pkg/integration, and any CLI commands will
live in github.com/metalkube/facet/cmd. There are currently two CLI commands:

- "server" which starts the REST API server
- "host" which allows you to interact with baremetal hosts

The CLI commands are self-documenting, so you should be able to run

```
$ go run main.go help
```

to learn about the various commands. Try `go run main.go host list` for example.

The integration package is where most of the code should go. The server and the
cmd packages are consumers of that code.

## Available Scripts

In the project directory, you can run:

### `yarn install`

Installs dependencies to node_modules directory

### `yarn prettier`

This application uses Prettier to check and format code. You can run the above command to clean your code, or you can [integrate it with your editor](https://prettier.io/docs/en/editors.html), and set up a Prettier extenson and formatting changes will automatically be applied when you save.

### `yarn start`

Runs the app in the development mode.<br> Open
[http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br> You will also see any lint errors in
the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br> See the section
about
[running tests](https://facebook.github.io/create-react-app/docs/running-tests)
for more information.

### `yarn run build`

Builds the app for production to the `build` folder.<br> It correctly bundles
React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br> Your app is
ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

### `yarn run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can
`eject` at any time. This command will remove the single build dependency from
your project.

Instead, it will copy all the configuration files and the transitive
dependencies (Webpack, Babel, ESLint, etc) right into your project so you have
full control over them. All of the commands except `eject` will still work, but
they will point to the copied scripts so you can tweak them. At this point
you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for
small and middle deployments, and you shouldn’t feel obligated to use this
feature. However we understand that this tool wouldn’t be useful if you couldn’t
customize it when you are ready for it.

## Learn More

You can learn more in the
[Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

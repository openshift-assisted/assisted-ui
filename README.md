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

## Production build

You can compile the production executable by running:

```
$ ./build.sh
```

This uses the [statik][3] utility to bundle all of the static assets from
`./build/` into a golang source file.  It then compiles the project into a
single binary, and places it into `bin/`.

You can use the binary directly:

```
./bin/facet -h
facet server

Usage:
  facet [command]

Available Commands:
  help        Help about any command
  server      Run the facet server

Flags:
  -h, --help   help for facet

Use "facet [command] --help" for more information about a command.
```

[3]: https://github.com/rakyll/statik

## Long-running tasks

If you would like to trigger a long-running task from the frontend, we've got
you covered.  The REST API endpoint that you will create will trigger the
long-running task, and quickly return with a success message.  The long-running
task itself will be sent for background processing in a go routine.  The task
will receive a notification channel where it can send any messages indicating
its progress or resulting value.  The frontend will receive these notifications
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
handler.  Inside, the `performLongTask` function is actually what performs the
long-running task.  It also has access to the notification channel.

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

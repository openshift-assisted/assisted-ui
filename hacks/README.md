# The hacks/* Scripts

These scripts simplify builds, deployments or development.

## update-assisted-ui-lib
Can be executed right after creating a new `assisted-ui-lib` [release](https://github.com/openshift-assisted/assisted-ui-lib/releases) to update it's version in the
- assisted-ui application
- uhc-portal (OCM)

**Please see `The Release Process` section bellow before using it.**

## run-tests.sh
Executes containerized tests.

Recently not used.

## patch-react-scripts.sh
Called from the yarn's `postinstall` phase to watch changes under `node_modules` within `yarn start`.

With this change, the `openshift-assisted-ui-lib` dependency can be updated on-the-fly during development.

## ocm-deployed-version.sh
Used by QE to check recent version deployed in the staging environment.

## create-test-vm.sh
Used to create a virtual machine from an ISO (like a discovery iso), tested in our development environments (no guarantee about other envs).

See comments inside the script for further details.

## cypress_env_local.sh
Pre-defined environment variables to simplify execution of upstream tests in our development environment. They assume the aplication to be executed via dev-server on http://localhost:3000. See [README.md](../README.md) for more details.

# The Release Process
Please note, the `assisted-ui` application features heavily depend on the `openshift-assisted-ui-lib` JavaSript library. So both projects need to be released in sync.

To simplify testing, release versions of both projects are alligned recently.

## Prerequisities
- Have [uhc-portal](https://gitlab.cee.redhat.com/service/uhc-portal) fork
- Local username (`whoami`) is equal to the gitlab's username
  - if not, use `GITLAB_USER=` env variable when calling `update-assisted-ui-lib.sh` script bellow
## Steps

When releasing new version, following steps are executed:
- **Approve and merge** open PRs intended to be part of the new release in both
  - [assisted-ui pull requests](https://github.com/openshift-assisted/assisted-ui/pulls)
  - [assisted-ui-lib pull requests](https://github.com/openshift-assisted/assisted-ui-lib/pulls)

- **Release** [openshift-assisted-ui-lib via GitHub](https://github.com/openshift-assisted/assisted-ui-lib/releases/new)
  - **Be careful** when providing following input
  - Tag version in format:
    - v1.4.8 or v1.4.8-1 ; notice the letter `v` prefixing the version
  - Release title:
    - use the same as the tag
  - Description:
    - Unless automated in the future, copy&paste all PR titles since last release.
    - To do so, use this [sorted list of closed PRs](https://github.com/openshift-assisted/assisted-ui-lib/pulls?q=is%3Apr+is%3Aclosed+sort%3Aupdated-desc)
  - *Note:* As a consequence, a GitHub action is trigerred on new tag created to build the library, publish to npmjs.com and generate a PR in the `assisted-ui-lib`
  - *Note:* It is recommended to use GitHub web to compose a release to keep track of changes. However, the GitHub action doing majority of the work can be trigerred by a new tag only.
  - **Close/re-open** [a generated PR in the assisted-ui-lib](https://github.com/openshift-assisted/assisted-ui-lib/pulls) which is increasing project's version.
    - **Approve this PR and merge A.S.A.P.** to avoid other PRs slipping in
    - *Note:* It is a GitHub's feature that an action can not trigger execution of another action. So without close/reopen the CI will not be executed on this PR.
  - **Wait till** new `openshift-assisted-ui-lib` version is automatically published to [npmjs.com](https://www.npmjs.com/package/openshift-assisted-ui-lib)

- **Update** `openshift-assisted-ui-lib` in the `assisted-ui` and `uhc-portal` via
  - ```
     $ curl https://raw.githubusercontent.com/openshift-assisted/assisted-ui/master/hacks/update-assisted-ui-lib.sh | sh -
    ```
    - Watch output of the script. It might happen in rare cases that new `openshift-assisted-ui-lib` version is not automatically found (i.e. due to short delay), so you can force it by:
      ```
      $ curl https://raw.githubusercontent.com/openshift-assisted/assisted-ui/master/hacks/update-assisted-ui-lib.sh | ASSISTED_UI_LIB_VERSION=1.5.0 sh -
      ```
- New browser tabs are opened, **finish the process** there by:
  - merge `assisted-ui-lib` version update (if you missed that in the steps above)
  - open a merge request to `uhc-portal`
  - confirm new `assisted-ui` project release - **append** description if needed
- Pass through all Jira and Bugzilla tickets and **fill `Fixed in version`**
  - use [assisted-ui-lib's release notes](https://github.com/openshift-assisted/assisted-ui-lib/releases) to guide you
  - *Note:* We are working on automating this step

- **Announce** new release on `#forum-assisted-installer-qe` slack channel to trigger QA

## To Be Docummented
So far missigned from the docummentation above:
- Downstream build

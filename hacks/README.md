# The hacks/* Scripts

These scripts simplify builds, deployments or development.

## update-facet-lib
Can be executed right after `facet-lib` release to update it's version in
- the facet application
- the uhc-portal (OCM)

**Please see `The Release Process` section bellow before using it.**

## run-tests.sh
Executes containerized tests.

Recently not used.

## patch-react-scripts.sh
Called from the yarn's `postinstall` phase to watch changes under `node_modules` within `yarn start`.

With this change, the `facet-lib` can be updated on-the-fly during development.

## ocm-deployed-version.sh
Used by QE to check recent version deployed in the staging environment.

## create-test-vm.sh
Used to create a virtual machine from an ISO (like a discovery iso), tested in our development environments (no guarantee about other envs).

See comments inside the script for further details.

# The Release Process
Please note, the `facet` application features heavily depend on the `facet-lib` JavaSript library which needs to be released along the `facet` application.

Recently release versions of both project are alligned to simplify testing.

## Prerequisities
- Have [uhc-portal](https://gitlab.cee.redhat.com/service/uhc-portal) fork
- Local username (`whoami`) is equal to the gitlab's username
  - if not, use `GITLAB_USER=` env variable when calling `update-facet-lib.sh` script bellow
- Privileges to write to `facet` master - for tags and `facet-lib` version update
## Steps

When releasing new version, following steps are executed:
- **Approve and merge** open PRs in both
  - [facet pull requests](https://github.com/openshift-metal3/facet/pulls)
  - [facet-lib pull requests](https://github.com/mareklibra/facet-lib/pulls)

- **Release** [facet-lib via GitHub](https://github.com/mareklibra/facet-lib/releases/new)
  - **Be careful** when providing following input
  - Tag version in format:
    - v1.4.8 or v1.4.8-1 ; notice the letter `v` prefixing the version
  - Release title:
    - use the same as the tag
  - Description:
    - Unless automated in the future, copy&paste all PR titles since last release.
    - To do so, use this [sorted list of closed PRs](https://github.com/mareklibra/facet-lib/pulls?q=is%3Apr+is%3Aclosed+sort%3Aupdated-desc)
  - *Note:* As a consequence, a GitHub action is trigerred on new tag created to build the library, publish to npmjs.com and generate a PR in the `facet-lib`
  - *Note:* It is recommended to use GitHub web to compose a release to keep track of changes. However, the GitHub action doing majority of the work is trigerred by a new tag only.
  - **Close/re-open** [a generated PR in the facet-lib](https://github.com/mareklibra/facet-lib/pulls) which is increasing project's version.
    - **Approve this PR and merge a.s.a.p.** to avoid other PRs slipping in
    - *Note:* It is a GitHub's feature that an action can not trigger execution of another action. So without close/reopen the CI will not be executed on this PR.
  - **Wait till** new `facet-lib` version is automatically published to [npmjs.com](https://www.npmjs.com/package/facet-lib)

- **Update** `facet-lib` in the `facet` and `uhc-portal`
  - ```
     $ curl https://raw.githubusercontent.com/openshift-metal3/facet/master/hacks/update-facet-lib.sh | sh -
    ```
    - Watch output of the script. It might happen in rare cases that new `facet-lib` version is not automatically found (i.e. due to short delay), so you can force it by:
      ```
      $ curl https://raw.githubusercontent.com/openshift-metal3/facet/master/hacks/update-facet-lib.sh | FACET_LIB_VERSION=1.4.8 sh -
      ```
- New browser tabs are opened, **finish the process** there by:
  - merge `facet-lib` version (if you missed that in the steps above)
  - open a merge request to `uhc-portal`
  - confirm new `facet` project release - **append** description if needed
- Pass through all Jira and Bugzilla tickets and **fill `Fixed in version`**
  - use [facet-lib's release notes](https://github.com/mareklibra/facet-lib/releases) to guide you
  - *Note:* We are working on automating this step

- **Announce** new release on `#forum-assisted-installer-qe` slack channel to trigger QA

## To Be Docummented
So far missigned from the docummentation above:
- Downstream build

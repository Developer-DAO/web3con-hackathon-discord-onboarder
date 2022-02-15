# web3con-hackathon-discord-onboarder
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

A simple node.js script to onboard hackathon registrants onto discord via CSV.

## Prerequisites

0. [ts-node](https://github.com/TypeStrong/ts-node)
1. [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
2. [nvm](https://github.com/nvm-sh/nvm)

## Usage

### How to build

0. Run `nvm install` in the project root directory
1. Run `yarn` to pull in the dependencies

### Content source

The script uses the `resources/hackers.csv` as the source of truth when preforming preforming discord onboardings. 

### Command Line Options

The script runs entirely through the command line and can be run with the following command and option below:

**Options**

- `-d, --dryrun <boolean>` : Run the script in dryrun mode which will not upload to the blockchain giving you a chance to observe requests before committing to uploading.  Defaults to *true* if not passed

### How to run the script

0. Open up a terminal and traverse to the project root i.e. `cd some/path/to/web3con-hackathon-discord-onboarder`
1. Replace the content of `resources/hackers.csv` with the data of your liking,
2. Run `ts-node onboarder.ts -d true` to run the script in `dryrun` mode to observe how your requests will look like without actually uploading.
3. Observe the `logs/service.log` file to see if your data looks like you expect it to
4. Assuming you are satisfied with your dryrun and/or testweave uploads you can now upload to the Arweave mainnet via `ts-node onboarder.ts -d false -t false`
5. Once the upload is finished, observe the `logs/service.log` file to see the results

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.narbeh.xyz/"><img src="https://avatars.githubusercontent.com/u/29411347?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Narb</b></sub></a><br /><a href="#infra-narbs91" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/narbs91/arweave-json-uploader/commits?author=narbs91" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
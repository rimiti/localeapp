# localeapp

[![Build Status](https://travis-ci.org/rimiti/localeapp.svg?branch=master)](https://travis-ci.org/rimiti/localeapp)

This package provides some powerful features to manage your translation files and sync them with Localeapp. 
If your project uses [Localeapp](https://www.localeapp.com/) to manage locales translation remotely then this tool might come useful.

## Description 

When working with locales through [Localeapp](https://www.localeapp.com/), the files containing translation keys can become extremely large and complex to be easily managed. This tool tries to bring more organization within locales in a project by using folders to separate keys and compile them into a single file that can easily be synchronized with Localeapp.

### Features

- Compile translation keys from a __folder structure__ source to a single `.yml` file.
- Synchronise with your __Localeapp__ project
- Update the source files in the folders when pulling from __Localeapp__.

## Installation

This package is most useful when installed globally, as CLI commands can just be ran through `localeapp [cmd]`, however it can be installed locally by project if necessary. Install `localeapp` locally if you already have `node` dependencies in your project:

```sh
$ npm install @rimiti/localeapp
```
or
```sh
$ yarn add @rimiti/localeapp
```

If you don't have `node` dependencies but still wish to use this package you can install it globally through
```sh
$ npm install -g @rimiti/localeapp
```
or
```sh
$ yarn global add @rimiti/localeapp
```

## How to use it?

### Setup

To start using `localeapp` there is a minimal set up that needs to be taken care of first.

Create a `.localeapprc` file where all the paths and locale information for the `localeapp` commands is specified. A normal usage set up file looks like this:

#### If you want to use simple path definition

```json
{
  "target": "locales",
  "source": "locales",
  "default": "en"
}
```

It will generate the bellow folder structure:

```
src
│
├── locales/
│   ├── en.yml
│   ├── fr.yml
│   ├── pt.yml
│   ├── es.yml
│   └── index.js
│
```

#### If you want to create dynamic paths

```
{
  "target": "locales/{{locale}}",
  "source": "locales/{{locale}}",
  "default": "en"
}
```

The `{{locale}}` (or `{{ locale }}`) variable is automatically replaced by the locale. This option can be really useful if you need to create paths with the bellow structure:

```
src
│
├── locales/
│   ├── en/
│   │   └── en.yml
│   ├── fr/
│   │   └── fr.yml
│   ├── pt/
│   │   └── pt.yml
│   ├── es/
│   │   └── es.yml
│   └── index.js
│
```

Where `target` is the path to the folder where your compiled translation keys file will be written, `source` is the root of your folder structure and `default` is the default language of your locales. `target` is also where all the locale files will be written to when pulling from Localeapp. In this example all local translation keys are in English, and the generated file (in `/locales`) is `en.yml`. It is this file that is then synchronised with Localeapp. The default locale should match the one in your remote  Localeapp project.

To enable syncinc between localeapp and the local files (with push and pull) you have to first initialise localeapp with the localeapp project key with:


#### If you want to use environment variable (recommended)

```sh
$ export LOCALEAPP_KEY=<your Localeapp key>
$ yarn localeapp init
```

#### If you want to pass your key as cli argument (not recommended)

```sh
$ yarn localeapp init <your Localeapp key> 
```

The key can be found in `Settings/API Key` in Localeapp. This file is not commited to it will stay secret in your local environment. The key will be used to synchronise your files with the remote project.

### Commands

There are 3 commands available:
- __UPDATE__: Takes the contents of the source files and compiles them into the single translation keys file, the default locale.
- __PUSH__: Runs _UPDATE_ and then synchronises the local compiled translation with your remote Localeapp project. If your default locale is `en` it will compile everything to `en.yml` and push it to the project.
- __PULL__: Will fetch _all_ the translations from Localeapp and update/create the individual locale files (e.g. `en.yml` and `fr.yml` if you have English and French translations). Then it will update your source files with any changes that might have been made on the remote project in the default locale.


If you installed the package globally you have access to the CLI everywhere, thus you can run:

```sh
$ localeapp <cmd>
```

directly within the root folder of your project. Thus for the above commands you would have:

```sh
$ localeapp update
$ localeapp push
$ localeapp pull
```

Were you to install `localeapp` locally you will need to call `npx localeapp update` or better, `yarn localeapp update`.

**NOTE:** when using options like the ones described below, you will need to include the `--` parameter to ensure the options are passed to localeapp and not Yarn. E.g. `yarn localeapp pull -- --raw`.

#### Options

```sh
$ localeapp push [locale]
```

This option allows you to push a particular locale to the remote Localeapp project. Can be useful when pushing existing non-default translations to Localeapp. E.g. `localeapp push fr` will push the `fr.yml` file.

```sh
$ localeapp update --watch
```
The `--watch` flag (also available as `-w`) will enable watching on all files living in the defined source folder (see [Setup](#setup)), and will call the `update` function on every change.

```sh
$ localeapp pull --raw
$ localeapp push --raw
```

The `--raw` flag will skip building sources when pulling from Localeapp. This is available in case you are using localeapp simply to communicate with the remote project, and the source folders feature is not used.

### Folder structure

Here is what a typical translation key file might look like:
```yml
en:
  topics:
    title: Some of the topics we cover
    marketing:
      title: Marketing
      feedback: Leave us some feedback!
      user_action:
        save: Save file
        cancel: Cancel
    tech:
      code: This is the code we use
      installation: How to install our software
  meta:
    meta_1: Our brand
    meta_2: Follow us
  username: Your username
  password: Your password
  welcome: Welcome aboard!
```

It is safe to assume that any large website can grow up to having more than 1000 of these keys. Thus to arrange keys into categories (folders), something like the following might be easier to search and maintain:

```
src
│
├── topics/
│   ├── marketing/
│   │   ├── index.yml
│   │   ├── newsletters.yml
│   │   └── website.yml
│   │
│   ├── tech/
│   │   └── index.yml
│   │
│   ├── index.yml
│   └── manifest.json
│
├── index.yml
└── manifest.json
```

Where the contents of the `index.yml` (or other names `.yml`) files only contain key-value pairs, and the manifests contain the description of the folders within that directory. Thus the manifest in the `topics` folder would describe:

```json
{
  "marketing": "{{marketing}}",
  "technology": "{{tech}}"
}
```

The key defines the actual translation key, and the value specifies the folder where the tool will look for the child keys. This is done so that one can name a folder differently from the actual key name. The index file in the `marketing` folder contains the keys found under the `marketing` key in the large file above.

The general consensus is that:
- Any keys shared between folders (somewhat categories) should go in the `index.yml` at the root of each folder
- Keys shared between between elements (e.g. the different files within a folder without `manifest.json`) should go in the `index.yml` at the root of that folder. `topics/marketing/index.yml` in the example above for keys shared between `newsletters` and `website`
- Keys only used in a particular element should live within that file and are not used anywhere else; `newsletter.yml` or `website.yml` in the example above

You may follow this example as a template for your own project. [Here](/examples) you can see the full example above with the folders and compiled file.

## Credits

This repository was initially a fork from the [louki](https://github.com/Drawbotics/louki) package. 

## License

MIT. See [LICENSE](LICENSE) for details.

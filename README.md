<p align="center">
  <h1 align="center">TabSplitter</h1>

  <p align="center">
    <a href="https://tab-splitter.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/MTTParry/TabSplitter/issues">Report Bug</a>
    ·
    <a href="https://github.com/MTTParry/TabSplitter/issues">Request Feature</a>
  </p>
</p>

## Contents

- [About](#about)
- [Features](#features)
- [Built with](#built-with)
- [Getting Started](#getting-started)

## About

Have you ever gone out to a restaurant with others and the bill comes and the restaurant can't break it into individual checks? Well, this app lets you do just that.

You create a bill, using the the "Add Bill" feature. This feature also calculates how much to give in tip (you specify a percent) and what the total of the bill should be.

After that, you can create debts, which will calculate proportionately how much an individual owes (including tax and tip, which come from the associated bill).

When a debt is added, an email is sent to the person who owes that debt, informing them about who they owe money to, how that person likes to be paid, and how much they owe.

## Features

- Create Contacts
  - First name, last name, email, and how this person prefers to be paid back
    - Example: John Doe at fake.email prefers to be paid via Venmo(@VenmoUserName)
- Bills
  - User inputs the subtotal, the tax amount, and the tip percentage
  - TabSplitter calculate the tax rate, the tip amount, and the full amount
  - User also inputs when the bill occured, where it happened, who paid, has the bill been paid back, and any additional notes they want to include
   - Example: John Doe paid a bill at Zazie's on 2022-04-18. The subtotal was $101.4, the tax amount was $8.74, and there was no tip ()
- Debts
  - User selects which bill the debt is associated with, as well as inputting the subtotal (menu price of the person's individual items)
  - TabSplitter calculates their total
    - This includes their subtotal, as well as their portion of tax and tip
  - User also inputs who owes this debt, have they been paid back, and any additional notes they want to include
    - This is usually what the person ordered/ate, as well as the base prices for those items, or other information like if it was an even split
  - When a debt is submitted, an email is sent to the person who owes that debt, informing them about what they owe, who they owe, and how to pay them back

## Built With

TabSplitter was built using a PostgreSQL, Express, React, and Node (PERN) stack.

It also uses

- [SendGrid](https://app.sendgrid.com/guide)
- [Auth0](https://auth0.com/docs/get-started)

## Getting Started

### Prerequisites

**Docker**

This project relies on Docker for to run the PostgreSQL server for registered users. To use those features, you must install Docker first before continuing.

Windows:

- Follow Microsoft's instructions to install [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and [Docker](https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers#install-docker-desktop).

MacOS:

- Use [Homebrew](https://docs.brew.sh/Installation): `brew install --cask docker`
- [Follow the instructions on the Docker website](https://www.docker.com/)

Launch Docker Desktop once it is installed.

**Node**

You'll need to install Node v14 or above. [`nvm`](https://github.com/nvm-sh/nvm) is highly recommended.

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/MTTParry/TabSplitter.git
   ```
2. Install all NPM packages using this in the root directory:
   ```sh
   npm install
   ```
3. Database setup:

   1. Copy the root example environment file

   ```sh
   cp .env.example .env
   ```

   2. You can choose to edit `.env` or just use as-is.
   3. Run the following to setup the database with the seed file:

   ```sh
   npm run db:init
   ```

Start the app and view it at <http://localhost:3000> by using:

```sh
npm start
```

Shut Down the Express and React development servers using `Ctrl-C` .

#### Set Up React client for `auth0`

If you want to try it with Auth0, the frontend needs to be setup with the following:

1. Copy the app's example environment file

   ```sh
   cp app/.env.example app/.env
   ```

2. The `.env` file allows the React app to use Auth0, and requires an Auth0 domain + client-id.
   - These can be obtained by signing up for an Auth0 account and [Registering a Single-Page Web Application](https://auth0.com/docs/get-started) in order to get these values.
   - This [graphic](https://images.ctfassets.net/23aumh6u8s0i/1DyyZTcfbJHw577T6K2KZk/a8cabcec991c9ed33910a23836e53b76/auth0-application-settings) from [Auth0's guide](https://auth0.com/blog/complete-guide-to-react-user-authentication/#Connect-React-with-Auth0) may be helpful to locating them.

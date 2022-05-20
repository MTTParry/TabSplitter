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
  - Example: John Doe paid a bill at Zazie's on 2022-04-18.
    - The subtotal was $101.4, the tax amount was $8.74, and there was no tip (0%)
    - The tax rate is 8.62%, the tip amount is $0, and the Total is $110.14.
    - Has John been paid back? False.
    - Notes: Zazie's doesn't accept tips.
- Debts
  - User selects which bill the debt is associated with, as well as inputting the subtotal (menu price of the person's individual items)
  - TabSplitter calculates their total
    - This includes their subtotal, as well as their portion of tax and tip
  - User also inputs who owes this debt, have they been paid back, and any additional notes they want to include
    - This is usually what the person ordered/ate, as well as the base prices for those items, or other information like if it was an even split
  - Example: Jane Doe owes John Doe from the bill on 2022-04-18, at Zazie's.
    - Her subtotal is $43.95
    - Her total debt is $47.74
    - She has not paid back this debt yet.
    - Notes: Jane ordered 2 eggs(29), 1 mocha (6.95), 1 pancake (24/3; she split an order of 3 pancakes with two other people)
  - When a debt is submitted, an email is sent to the person who owes that debt, informing them about what they owe, who they owe, and how to pay them back

## Built With

TabSplitter was built using a PostgreSQL, Express, React, and Node (PERN) stack.

It also uses

- [SendGrid](https://app.sendgrid.com/guide)
- [Auth0](https://auth0.com/docs/get-started)

## Getting Started

### Prerequisites

**Node**

You'll need to install Node v16 or above.

**SendGrid**

1. An api key from SendGrid by Twilio
2. You will also want to verify an email for sending the emails. (Put your verified email address on line 278 of server.js, replacing the fake email)

**Auth0**

1. Go to Applications
2. Click "+ Create Application"
3. Name it and select "Regular Web Applications"
4. "Create Application"
5. Select "Node.js (Express)"
6. Select "Integrate Now" under "I want to integrate with my app"
7. This will give you your CLIENTID and ISSUER (issuerBaseURL) for your .env file (see step 6 below).

### Installation

1. In your terminal, go to where you would like the to install this repo. Once there, run the command:

   ```sh
   git clone https://github.com/MTTParry/TabSplitter.git tabSplitter
   ```

2. Clean the folder from the owner git by running this command in the root folder:

   ```sh
   rm -rf .git
   ```

3. Install all NPM packages using this in the root directory:

   ```sh
   npm install
   ```

4. Also install the the express-openid-connect package for Auth0:

   ```sh
   npm --save install express express-openid-connect
   ```

5. Database setup:

   - Inside of the server folder, run the following command to restore the database dump file:

   ```sh
   psql -U postgres -f db.sql
   ```

6. Set up your .env file. Without this file, the program will not run. Run the following command in the server folder:

  ```sh
   touch .env
  ```

   - Copy the information from .env.example into your .env file

   - In your .env, replace the information in quotes on lines 1, 3, 5, 7, and 8

7.  In the root folder, use the following command to run the dev using nodemon:

  ```sh
  npm run dev
  ```

10. To stop runniing the dev, press `Ctrl-C` while in the terminal running the dev.

#### Set Up React client for `auth0`

If you want to try it with Auth0, the frontend needs to be setup with the following:

1. Copy the app's example environment file

   ```sh
   cp app/.env.example app/.env
   ```

2. The `.env` file allows the React app to use Auth0, and requires an Auth0 domain + client-id.
   - These can be obtained by signing up for an Auth0 account and [Registering a Single-Page Web Application](https://auth0.com/docs/get-started) in order to get these values.
   - This [graphic](https://images.ctfassets.net/23aumh6u8s0i/1DyyZTcfbJHw577T6K2KZk/a8cabcec991c9ed33910a23836e53b76/auth0-application-settings) from [Auth0's guide](https://auth0.com/blog/complete-guide-to-react-user-authentication/#Connect-React-with-Auth0) may be helpful to locating them.

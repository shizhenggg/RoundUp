# RoundUp App

App Demo

The RoundUp App can be accessed [here](https://expo.dev/@shizhenggg/RoundUp) with Expo, compatible with both iOS and Android. <br>
You can also install the RoundUp App directly onto your phone [here](https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40ngsuwen/RoundUp-510c994d5e7e4940926793e7537c97e5-signed.apk).

# Description

The RoundUp App allows user to track their networth, income, expenses and investments all in one app, which solves the painpoint of the conventional budgeting app where tracking of investments is usually not supported.
At any point in time, users of the RoundUp App will be able to know their financial health, empowering them towards achieving or improving financial literacy.

### User Stories

User is able to signup for an account or login if they already have an existing account. The user will remain logged in even after the app is closed. 

![Login and signup page](/assets/readMeScreenShots/login.png)

The investment components will be locked if the account type is basic. User can update their account details at the user profile page. Account type can be upgraded to premium with a referral code. User can also change the password or delete the account at the user profile page. 

![Profile page](/assets/readMeScreenShots/profile.png)

At the home page, user will be shown their current networth, income, expenses and investment balances (past 12 months) presented in bezier charts in a carousel.
User will also have quick access to access their income (Money In), expenses (Money Out) and investment information with cards at the homepage.
User will also be able to conveniently add new entries for income, expenses and investments from the cards.

![Home page](/assets/readMeScreenShots/home.png)

At the income (Money In) segment, the pie chart will display the income details sorted by category for that particular month.
The bezier chart displays the income amount sorted by days of the month.
User will be able to change the month to view the income details at any month.
User will be able to add new entries from this page.
User will be able to view specific entries from this page and make edits or delete that entry.
There is also tabulation of total income per day as well as for the whole month as seen in the accordion component.

The expense (Money Out) segment has the same format and functionality.

![Cash and Expense page](/assets/readMeScreenShots/cash.png)

At the investment segment, the pie chart will display the investment details sorted by category (cryptocurrencies or US stocks).
The bezier chart displays the total investment balance which updates daily using CRON job.
Prices for stocks and crypto will be fetched and updated in the ticker table at the lower portion of the screen.
User can tap into each ticker and view the transaction history for that ticker and make changes or delete a particular entry.
There will also be a ticker card which calculates for each ticker, the cost basis, quantity, total amount paid as well as unrealized profit and loss for that particular ticker.

![Investment page](/assets/readMeScreenShots/investment.png)

### Tech Stack

Front-End:

- React Native with Expo

Back-End [Repo](https://github.com/ngsuwen/RoundUp-BE).

- MongoDB
- Express

API used:

- Finnhub (US stock data)
- CoinGecko (crypto data)

### Ways to improve

- Currently, the investment bezier chart (at the investment page) will not update immediately if a stock/crypto is added, edited or removed. Updates will only happen at the close of the US stock market. One way to improve is to allow immediate update when a new ticker is added. 

### Unsolved problem

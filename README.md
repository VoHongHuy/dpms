# # How to run app?

1. Clone repository
2. Moving to app folder

    `cd frontend`

3. Install npm packages

    `npm install`

4. Start app

    `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# # App structure

```
public
├── configs.js
src
├── assets
│   ├── font-icons
│   └── images
├── components
│   ├── Button
│   ├── CheckBox
│   ├── ConfirmModal
│   ├── Modal
│   ├── Loading
│   ├── Table
│   ├── SectionHeader
│   └── Form
│       ├── DatePicker
│       ├── Input
│       ├── Select
│       ├── TextArea
│       └── Editmember
├── contants
│   ├── paths.js
│   ├── errorCodes.js
│   └── routes.js
├── containers
│   ├── Dashboard
│   │   ├── Members
│   │       ├── ListMembers
│   │       ├── AddMember
│   │       ├── Editmember
│   │       └── routes.js
│   │   ├── Structures
│   │   ├── Organization
│   │   └── UserAccounts
│   │       ├── ListAccounts
│   │       ├── AddAccount
│   │       ├── EditAccount
│   │       └── routes.js
│   ├── ChangePassword
│   └── NotFound
├── HOCs
├── hooks
├── intl
│   └── languages
│       ├── en.js
│       └── hr.js
├── providers
│   └── NotificationProvider
├── redux
│   ├── ducks
│   ├── sagas
│   └── store.js
├── services
│   ├── api.js
│   └── localStorage.js
├── styles
│   ├── styles.scss
│   └── variables.scss
├── utils
├── App.js
├── history.js
└── index.js
```
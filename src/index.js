import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'; 
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <App/>
    </MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();

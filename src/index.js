import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const app = {
  // Application Constructor
  initialize() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },
  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady() {
    ReactDOM.render(<App />, document.getElementById('app'));
  },
};

app.initialize();

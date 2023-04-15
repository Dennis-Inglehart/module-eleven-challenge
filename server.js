const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid'); // hopefully, this is a dependency that can give JSON objects unique IDs
const api = require('./js/index.js'); // I'm not sure if it's appropriate to name this one "api"
const PORT = 3001; // do I even need a PORT for this?
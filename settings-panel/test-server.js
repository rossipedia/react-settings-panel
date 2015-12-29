import express from 'express';
import { urlencoded } from 'body-parser';

const debug = require('debug')('test-server');

const app = express();

const config = {
  dataCenter: "Local",
  tier: "Local"
};

const dataCenters = [
  "Any",
  "Local"
];

const settingsData = {
 "settings": [{
  "name": "Test.BoolValue",
  "description": "A boolean value. Can be true or false",
  "isBool": true,
  "allDefaults": [{
   "dataCenter": "Any",
   "tier": "Any",
   "value": "False"
  }],
  "allOverrides": [],
  "activeOverride": null,
  "defaultValue": {
   "dataCenter": "Any",
   "tier": "Any",
   "value": "False"
  }
 }, {
  "name": "Test.TextValue",
  "description": "A text value. Free-form text input",
  "isBool": false,
  "allDefaults": [{
   "dataCenter": "Any",
   "tier": "Any",
   "value": "Hello, world"
  }],
  "allOverrides": [],
  "activeOverride": null,
  "defaultValue": {
   "dataCenter": "Any",
   "tier": "Any",
   "value": "Hello, world"
  },
 }],
 "availableDataCenters": ["Any", "Local"]
};

const setActiveOverride = setting => {
  // 'Any' is the fallback
  let o = setting.allOverrides.find(o => o.dataCenter === config.dataCenter);
  debug('Override for %s: ', config.dataCenter, o);
  if (!o) {
    o = setting.allOverrides.find(o => o.dataCenter === 'Any');
    debug('Override for Any: ', o);
  }

  setting.activeOverride = o;
};

app.use(urlencoded({ extended: false }));


app.get('/settings.json', (req, res) => {
  res.json(settingsData);
});


app.post('/set', (req, res) => {
  const { settingName, dataCenter, value } = req.body;

  debug('Body:', req.body);
  debug('Config:', config);

  const setting = settingsData.settings.find(s => s.name === settingName);

  if (!setting)
  {
    res.status(404).end();
    return;
  }

  const existing = setting.allOverrides.find(o => o.dataCenter === dataCenter);
  if (existing) {
    existing.value = value;
  } else {
    const override = {
      dataCenter,
      tier: config.tier,
      value
    };
    setting.allOverrides.push(override);
  }

  setActiveOverride(setting);

  res.json(setting);
});

app.post('/clear', (req, res) => {
  const { settingName, dataCenter } = req.body;

  const setting = settingsData.settings.find(s => s.name === settingName);

  if (!setting)
  {
    res.status(404).end();
    return;
  }

  setting.allOverrides = setting.allOverrides.filter(o => o.dataCenter !== dataCenter);
  setActiveOverride(setting);

  res.json(setting);
});

app.use(express.static('public'));
app.use(express.static('dist'));


const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});